export type Game = {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  driveLink: string;
  developer: string;
  description?: string;
  screenshots?: string[];
};

// Data now comes from the useGames hook pulling from public/Project Submission (Responses).xlsx
// The static GAMES array has been removed.

export const CATEGORIES = ["Action", "Arcade", "Puzzle", "Horror", "Racing", "Platformer", "RPG", "Simulation", "Strategy", "Survival", "Adventure"] as const;
