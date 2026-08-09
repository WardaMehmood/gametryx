import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const wb = XLSX.readFile("Project Submission (Responses).xlsx");
const sheet = wb.Sheets[wb.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(sheet);

const VALID_CATEGORIES = [
  "Action",
  "Arcade",
  "Puzzle",
  "Horror",
  "Racing",
  "Platformer",
  "RPG",
  "Simulation",
  "Strategy",
  "Survival",
  "Adventure",
];

const parsed = rawData
  .map((row, index) => {
    const title = String(row["Game Name"] || "").trim();
    const driveLink = String(row["Project Google Drive link"] || "").trim();
    if (!title || !driveLink) return null;

    const developer = String(row["Group Name with ids"] || "Unknown Developer").trim();
    const fullDesc = String(row["Game Description with genre"] || "").trim();

    let category = String(row["Category"] || "").trim();
    if (!VALID_CATEGORIES.includes(category)) {
      const text = (title + " " + fullDesc).toLowerCase();
      if (/horror|granny|haunted|ghost|monster|nightmare/.test(text)) category = "Horror";
      else if (/racing|race|street|road/.test(text)) category = "Racing";
      else if (/arcade|runner|star|ball/.test(text)) category = "Arcade";
      else if (/puzzle|solve|maze|grid|escape/.test(text)) category = "Puzzle";
      else if (/platformer|2d|jump/.test(text)) category = "Platformer";
      else if (/rpg|role|stealth/.test(text)) category = "RPG";
      else if (/simulation|simulator|life/.test(text)) category = "Simulation";
      else if (/strategy|board|chess/.test(text)) category = "Strategy";
      else if (/survival|survive/.test(text)) category = "Survival";
      else if (/adventure|explore/.test(text)) category = "Adventure";
      else category = "Action";
    }

    return {
      id: `row_${index + 1}`,
      title,
      developer,
      category,
      thumbnail: "",
      driveLink,
      description: fullDesc,
      screenshots: [],
    };
  })
  .filter(Boolean);

const content = `import { Game } from "./games";\n\nexport const FALLBACK_GAMES: Game[] = ${JSON.stringify(parsed, null, 2)};\n`;
fs.writeFileSync(path.join("src", "data", "fallbackGames.ts"), content);
console.log(`Generated fallbackGames.ts with ${parsed.length} games.`);
