const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Handle preflight CORS requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // GET /api/health
    if (pathname === '/api/health' && request.method === 'GET') {
      return json({ status: 'ok', message: 'Tangerine API is running' });
    }

    // POST /api/auth
    if (pathname === '/api/auth' && request.method === 'POST') {
      const { password } = await request.json();

      if (!password || !env.PASSWORD_HASH) {
        return json({ authenticated: false });
      }

      const hash = await hashPassword(password);
      const authenticated = hash === env.PASSWORD_HASH;
      return json({ authenticated });
    }

    // GET /api/vocabulary
    if (pathname === '/api/vocabulary' && request.method === 'GET') {
      const level = url.searchParams.get('level');
      const lesson = url.searchParams.get('lesson');

      let query = 'SELECT * FROM vocabulary';
      const params = [];

      if (level && lesson) {
        query += ' WHERE level = ? AND lesson = ?';
        params.push(level, lesson);
      } else if (level) {
        query += ' WHERE level = ?';
        params.push(level);
      }

      const { results } = await env.tangerine_db.prepare(query).bind(...params).all();
      return json(results);
    }

    // POST /api/upload
    if (pathname === '/api/upload' && request.method === 'POST') {
      const { rows, level } = await request.json();

      if (!Array.isArray(rows) || rows.length === 0) {
        return json({ error: 'No rows provided' }, 400);
      }

      let inserted = 0;
      let skipped = 0;
      const errors = [];

      for (const row of rows) {
        const { traditional, simplified, pinyin, part_of_speech, definition, lesson } = row;

        if (!traditional || !pinyin || !definition || !lesson) {
          skipped++;
          continue;
        }

        const existing = await env.tangerine_db
          .prepare('SELECT id FROM vocabulary WHERE traditional = ? AND level = ? AND lesson = ?')
          .bind(traditional, level, lesson)
          .first();

        if (existing) {
          skipped++;
          continue;
        }

        try {
          await env.tangerine_db
            .prepare('INSERT INTO vocabulary (level, lesson, traditional, simplified, pinyin, part_of_speech, definition) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .bind(level, lesson, traditional, simplified || '', pinyin, part_of_speech || '', definition)
            .run();
          inserted++;
        } catch (err) {
          errors.push({ row, error: err.message });
          skipped++;
        }
      }

      return json({ inserted, skipped, errors });
    }

    // POST /api/session/start
    if (pathname === '/api/session/start' && request.method === 'POST') {
      const { levels, lessons } = await request.json();
      const now = new Date().toISOString();

      const result = await env.tangerine_db
        .prepare('INSERT INTO sessions (started_at, levels, lessons) VALUES (?, ?, ?)')
        .bind(now, JSON.stringify(levels), JSON.stringify(lessons))
        .run();

      return json({ sessionId: result.meta.last_row_id });
    }

    // POST /api/session/answer
    if (pathname === '/api/session/answer' && request.method === 'POST') {
      const { sessionId, vocabularyId, direction, isCorrect, hintUsed, attemptNumber } = await request.json();
      const now = new Date().toISOString();

      await env.tangerine_db
        .prepare('INSERT INTO answers (session_id, vocabulary_id, direction, is_correct, hint_used, attempt_number, answered_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(sessionId, vocabularyId, direction, isCorrect ? 1 : 0, hintUsed ? 1 : 0, attemptNumber, now)
        .run();

      return json({ success: true });
    }

    // GET /api/dashboard
    if (pathname === '/api/dashboard' && request.method === 'GET') {
      const totalWords = await env.tangerine_db
        .prepare('SELECT COUNT(*) as count FROM vocabulary')
        .first();

      const totalSessions = await env.tangerine_db
        .prepare('SELECT COUNT(*) as count FROM sessions')
        .first();

      const lastSession = await env.tangerine_db
        .prepare('SELECT started_at FROM sessions ORDER BY started_at DESC LIMIT 1')
        .first();

      return json({
        totalWords: totalWords?.count ?? 0,
        totalSessions: totalSessions?.count ?? 0,
        lastSession: lastSession?.started_at ?? null,
      });
    }

    return json({ error: 'Not found' }, 404);
  },
};
