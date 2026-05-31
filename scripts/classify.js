/**
 * classify.js — Run this whenever you download a fresh Excel from Google Sheets
 *
 * Steps:
 *   1. Download latest Excel from Google Sheets → File > Download > .xlsx
 *   2. Place it in the project root as "Project Submission (Responses).xlsx"
 *   3. Run:  node scripts/classify.js
 *   4. Commit & redeploy — done!
 */

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, '..', 'Project Submission (Responses).xlsx');
const DEST = path.join(__dirname, '..', 'public', 'Project Submission (Responses).xlsx');

if (!fs.existsSync(SRC)) {
  console.error('❌  File not found:', SRC);
  console.error('    Download the latest Excel from Google Sheets and place it in the project root.');
  process.exit(1);
}

function classifyCategory(name, desc) {
  const text = (name + ' ' + desc).toLowerCase();

  // 1. Check if description already ends with ", Category" (from our upload form)
  const VALID = ['Action','Arcade','Puzzle','Horror','Racing','Platformer','RPG','Simulation','Strategy','Survival','Adventure'];
  const lastComma = desc.lastIndexOf(',');
  if (lastComma !== -1) {
    const afterComma = desc.substring(lastComma + 1).trim();
    const lastWord   = afterComma.split(/\s+/).pop() || '';
    if (VALID.includes(lastWord))    return lastWord;
    if (VALID.includes(afterComma)) return afterComma;
  }

  // 2. Keyword matching
  if (/horror|granny|haunted house|ghost|survival horror|no escape.*forest/.test(text))        return 'Horror';
  if (/island beast runner|zombie.*apoc|open world.*survival|survival game|go back.*servival/.test(text)) return 'Survival';
  if (/racing game|race against|race.*ai|race.*track|street.*rebuild.*racing|road rush|racing car/.test(text)) return 'Racing';
  if (/endless.?run|runner game|\barcade\b|catch.*star|falling.*star|dotix|penguin.*run|bullet.*fracture|hop.*game|mouse.*runner|cube.*runner|neon.*rush|endless.*driving/.test(text)) return 'Arcade';
  if (/\bpuzzle\b|wire.*cut|bomb.*defus|maze|labyrinth|slide.*solve|arrange.*block|one wire cut/.test(text))  return 'Puzzle';
  if (/platformer|2d.*platform|fruit.*survival|5 levels.*story|jump.*enemies/.test(text))      return 'Platformer';
  if (/\brpg\b|role.?play|stealth.*rpg|agent.*247/.test(text))                                 return 'RPG';
  if (/simulation|simulator|parking.*game|developer.*life|smartpark/.test(text))               return 'Simulation';
  if (/\bstrategy\b|board game|ludo|chess/.test(text))                                         return 'Strategy';
  if (/\bfps\b|first.?person.*shoot|shoot.*game|\baction\b|combat|parkour|stealth.*action|3d.*action|action.*adventure/.test(text)) return 'Action';
  if (/adventure|mystery|explore|quest|open.*world/.test(text))                                return 'Adventure';

  return 'Action'; // default
}

const wb   = XLSX.readFile(SRC);
const ws   = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

let added = 0;
const updated = rows.map((row, i) => {
  const name  = String(row['Game Name']                   || '');
  const desc  = String(row['Game Description with genre'] || '');
  const cat   = classifyCategory(name, desc);
  if (!row['Category']) added++;
  return { ...row, Category: cat };
});

const newWs = XLSX.utils.json_to_sheet(updated);
const newWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWb, newWs, wb.SheetNames[0]);

if (!fs.existsSync(path.join(__dirname, '..', 'public'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'public'), { recursive: true });
}

XLSX.writeFile(newWb, DEST);

console.log(`✅  Done! ${updated.length} games processed (${added} newly classified).`);
console.log(`📄  Saved to: ${DEST}`);
console.log('');
console.log('Next steps:');
console.log('  git add public && git commit -m "update games" && git push');
