import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../index.js';

// Mock D1 database
function mockDb(overrides = {}) {
  return {
    prepare: vi.fn().mockReturnValue({
      bind: vi.fn().mockReturnValue({
        all: vi.fn().mockResolvedValue({ results: [] }),
        run: vi.fn().mockResolvedValue({ meta: { last_row_id: 1 } }),
        first: vi.fn().mockResolvedValue({ count: 0 }),
      }),
      all: vi.fn().mockResolvedValue({ results: [] }),
      first: vi.fn().mockResolvedValue(null),
      run: vi.fn().mockResolvedValue({ meta: { last_row_id: 1 } }),
    }),
    ...overrides,
  };
}

function makeRequest(path, method = 'GET', body = null) {
  const options = { method };
  if (body) {
    options.body = JSON.stringify(body);
    options.headers = { 'Content-Type': 'application/json' };
  }
  return new Request(`https://tangerine-worker.pacificatch.workers.dev${path}`, options);
}

describe('Worker API', () => {
  let env;

  beforeEach(() => {
    env = { tangerine_db: mockDb() };
  });

  describe('GET /api/health', () => {
    it('returns status ok', async () => {
      const response = await worker.fetch(makeRequest('/api/health'), env);
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.message).toBe('Tangerine API is running');
    });
  });

  describe('OPTIONS (CORS preflight)', () => {
    it('returns 200 for preflight requests', async () => {
      const response = await worker.fetch(makeRequest('/api/health', 'OPTIONS'), env);
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });

  describe('POST /api/auth', () => {
    it('returns authenticated false when no password provided', async () => {
      const response = await worker.fetch(
        makeRequest('/api/auth', 'POST', { password: '' }),
        { ...env, PASSWORD_HASH: 'abc123' }
      );
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.authenticated).toBe(false);
    });

    it('returns authenticated false for wrong password', async () => {
      // SHA-256 of 'correctpassword'
      const response = await worker.fetch(
        makeRequest('/api/auth', 'POST', { password: 'wrongpassword' }),
        { ...env, PASSWORD_HASH: 'correcthash' }
      );
      const data = await response.json();
      expect(data.authenticated).toBe(false);
    });

    it('returns authenticated false when PASSWORD_HASH secret not set', async () => {
      const response = await worker.fetch(
        makeRequest('/api/auth', 'POST', { password: 'anypassword' }),
        { ...env, PASSWORD_HASH: undefined }
      );
      const data = await response.json();
      expect(data.authenticated).toBe(false);
    });
  });

  describe('GET /api/lessons', () => {
    it('returns distinct level/lesson pairs', async () => {
      env.tangerine_db.prepare = vi.fn().mockReturnValue({
        all: vi.fn().mockResolvedValue({
          results: [{ level: 1, lesson: 1 }, { level: 1, lesson: 2 }],
        }),
        bind: vi.fn().mockReturnValue({
          all: vi.fn().mockResolvedValue({ results: [] }),
          run: vi.fn().mockResolvedValue({ meta: { last_row_id: 1 } }),
          first: vi.fn().mockResolvedValue(null),
        }),
        first: vi.fn().mockResolvedValue(null),
        run: vi.fn().mockResolvedValue({}),
      });

      const response = await worker.fetch(makeRequest('/api/lessons'), env);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('level');
      expect(data[0]).toHaveProperty('lesson');
    });
  });

  describe('GET /api/vocabulary', () => {
    it('returns vocabulary list', async () => {
      const response = await worker.fetch(makeRequest('/api/vocabulary'), env);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST /api/session/start', () => {
    it('creates a new session and returns sessionId', async () => {
      const response = await worker.fetch(
        makeRequest('/api/session/start', 'POST', { levels: [1], lessons: [1, 2] }),
        env
      );
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.sessionId).toBe(1);
    });
  });

  describe('POST /api/session/answer', () => {
    it('records an answer and returns success', async () => {
      const response = await worker.fetch(
        makeRequest('/api/session/answer', 'POST', {
          sessionId: 1,
          vocabularyId: 1,
          direction: 'char_to_eng',
          isCorrect: true,
          hintUsed: false,
          attemptNumber: 1,
        }),
        env
      );
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('GET /api/dashboard', () => {
    it('returns comprehensive dashboard stats', async () => {
      env.tangerine_db.prepare = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue({ count: 0, correct: 0, total: 0, started_at: null }),
        all: vi.fn().mockResolvedValue({ results: [] }),
        bind: vi.fn().mockReturnValue({
          all: vi.fn().mockResolvedValue({ results: [] }),
          run: vi.fn().mockResolvedValue({ meta: { last_row_id: 1 } }),
          first: vi.fn().mockResolvedValue(null),
        }),
        run: vi.fn().mockResolvedValue({}),
      });

      const response = await worker.fetch(makeRequest('/api/dashboard'), env);
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('totalWords');
      expect(data).toHaveProperty('totalSessions');
      expect(data).toHaveProperty('lastSession');
      expect(data).toHaveProperty('accuracy');
      expect(data).toHaveProperty('streak');
      expect(data).toHaveProperty('mostMissed');
      expect(data).toHaveProperty('lessonAccuracy');
      expect(data).toHaveProperty('recentSessions');
    });
  });

  describe('POST /api/upload', () => {
    it('returns error when no rows provided', async () => {
      const response = await worker.fetch(
        makeRequest('/api/upload', 'POST', { rows: [], level: 1 }),
        env
      );
      expect(response.status).toBe(400);
    });

    it('skips duplicate entries', async () => {
      // Mock db to simulate existing record
      env.tangerine_db = mockDb();
      env.tangerine_db.prepare = vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue({ id: 1 }), // simulate duplicate
          run: vi.fn().mockResolvedValue({}),
          all: vi.fn().mockResolvedValue({ results: [] }),
        }),
        first: vi.fn().mockResolvedValue(null),
        all: vi.fn().mockResolvedValue({ results: [] }),
        run: vi.fn().mockResolvedValue({}),
      });

      const response = await worker.fetch(
        makeRequest('/api/upload', 'POST', {
          rows: [{ traditional: '你好', simplified: '', pinyin: 'nǐ hǎo', part_of_speech: 'phrase', definition: 'hello', lesson: 1 }],
          level: 1,
        }),
        env
      );
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.skipped).toBe(1);
      expect(data.inserted).toBe(0);
    });

    it('inserts new rows successfully', async () => {
      // Mock db to simulate no existing record
      env.tangerine_db = mockDb();
      env.tangerine_db.prepare = vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(null), // no duplicate
          run: vi.fn().mockResolvedValue({}),
          all: vi.fn().mockResolvedValue({ results: [] }),
        }),
        first: vi.fn().mockResolvedValue(null),
        all: vi.fn().mockResolvedValue({ results: [] }),
        run: vi.fn().mockResolvedValue({}),
      });

      const response = await worker.fetch(
        makeRequest('/api/upload', 'POST', {
          rows: [{ traditional: '你好', simplified: '', pinyin: 'nǐ hǎo', part_of_speech: 'phrase', definition: 'hello', lesson: 1 }],
          level: 1,
        }),
        env
      );
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.inserted).toBe(1);
      expect(data.skipped).toBe(0);
    });
  });

  describe('Unknown route', () => {
    it('returns 404 for unknown routes', async () => {
      const response = await worker.fetch(makeRequest('/api/unknown'), env);
      expect(response.status).toBe(404);
    });
  });
});
