const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const FILE_PATH = '/Users/doraemon58/Documents/The Vault/The Vault 2026/2026 Chinese I - 226S-15849-CHIN-1411-001/Chinese_I_Vocabulary.xlsx';
const OUTPUT_SQL = path.join(__dirname, 'vocabulary-seed.sql');
const LEVEL = 1;

const wb = XLSX.readFile(FILE_PATH);
const sheet = wb.Sheets['learn'];
const rows = XLSX.utils.sheet_to_json(sheet);

console.log(`Read ${rows.length} rows from 'learn' sheet`);

const escape = (str) => (str || '').trim().replace(/'/g, "''");

const lines = [];
let skipped = 0;

for (const row of rows) {
  const traditional = escape(row['Traditional']);
  const simplified = escape(row['Simplified']);
  const pinyin = escape(row['Pinyin']);
  const partOfSpeech = escape(row['Part of Speech']);
  const definition = escape(row['Definition']);
  const lesson = parseInt(row['Lesson']);

  if (!traditional || !pinyin || !definition || !lesson) {
    console.log(`Skipping incomplete row:`, row);
    skipped++;
    continue;
  }

  lines.push(
    `INSERT INTO vocabulary (level, lesson, traditional, simplified, pinyin, part_of_speech, definition) VALUES (${LEVEL}, ${lesson}, '${traditional}', '${simplified}', '${pinyin}', '${partOfSpeech}', '${definition}');`
  );
}

fs.writeFileSync(OUTPUT_SQL, lines.join('\n') + '\n');

console.log(`Generated ${lines.join('\n').split('\n').length} SQL statements`);
console.log(`Skipped: ${skipped}`);
console.log(`Output: ${OUTPUT_SQL}`);
