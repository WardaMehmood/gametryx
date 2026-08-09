import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Game } from "../data/games";
import { FALLBACK_GAMES } from "../data/fallbackGames";

export function useGames() {
  const [games, setGames] = useState<Game[]>(FALLBACK_GAMES);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        const CSV_URL =
          "https://docs.google.com/spreadsheets/d/19CVf_oS3dByqMt--c8tjNGhGLYcslc-fEpYQe6lEwZg/export?format=csv";
        const response = await fetch(CSV_URL);

        if (!response.ok) {
          return;
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

        const parsedGames: Game[] = [];

        rawData.forEach((row: Record<string, unknown>, index: number) => {
          const title = String(row["Game Name"] || "");
          const driveLink = String(row["Project Google Drive link"] || "");

          if (!title.trim() || !driveLink.trim()) return;

          const developer = String(row["Group Name with ids"] || "Unknown Developer");
          const fullDesc = String(row["Game Description with genre"] || "");

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

          let category = "";

          const rawCategory = String(row["Category"] || "").trim();
          if (VALID_CATEGORIES.includes(rawCategory)) {
            category = rawCategory;
          }

          if (!category && fullDesc) {
            const lastComma = fullDesc.lastIndexOf(",");
            if (lastComma !== -1) {
              const afterComma = fullDesc.substring(lastComma + 1).trim();
              const lastWord = afterComma.split(/\s+/).pop() || "";
              if (VALID_CATEGORIES.includes(lastWord)) {
                category = lastWord;
              } else if (VALID_CATEGORIES.includes(afterComma)) {
                category = afterComma;
              }
            }
          }

          if (!category) {
            const text = (title + " " + fullDesc).toLowerCase();
            if (
              /horror|granny|haunted|ghost|monster.*stalk|survival horror|no escape.*forest/.test(
                text,
              )
            )
              category = "Horror";
            else if (/racing game|race against|race.*ai|street.*racing|road rush/.test(text))
              category = "Racing";
            else if (
              /endless.?run|runner game|\barcade\b|falling.*star|catch.*star|dotix|penguin.*run/.test(
                text,
              )
            )
              category = "Arcade";
            else if (/\bpuzzle\b|wire.*cut|maze|labyrinth|slide.*solve|arrange.*block/.test(text))
              category = "Puzzle";
            else if (/platformer|2d.*platform|fruit.*survival/.test(text)) category = "Platformer";
            else if (/\brpg\b|role.?play|stealth.*rpg/.test(text)) category = "RPG";
            else if (/simulation|simulator|parking.*game|developer.*life/.test(text))
              category = "Simulation";
            else if (/\bstrategy\b|board game|ludo|chess/.test(text)) category = "Strategy";
            else if (/survival game|survive|open world.*survival/.test(text)) category = "Survival";
            else if (/adventure|mystery|explore/.test(text)) category = "Adventure";
            else category = "Action";
          }

          parsedGames.push({
            id: `row_${index + 1}`,
            title: title.trim(),
            developer: developer.trim(),
            category,
            thumbnail: "",
            driveLink: driveLink.trim(),
            description: fullDesc.trim(),
            screenshots: [],
          });
        });

        if (parsedGames.length > 0) {
          setGames(parsedGames);
        }
      } catch (err: unknown) {
        console.warn("Could not fetch live Google Sheets data, using pre-loaded games.", err);
      }
    }

    fetchGames();
  }, []);

  return { games, loading, error };
}
