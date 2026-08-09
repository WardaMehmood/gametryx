import { ArrowRight } from "lucide-react";
import { GameCard } from "./GameCard";
import type { Game } from "@/data/games";

export function CategoryRow({
  title,
  games,
  limit = 5,
}: {
  title: string;
  games: Game[];
  limit?: number;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Category</div>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">
            <span className="neon-text">{title}</span> Games
          </h2>
        </div>
        <a
          href="#"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          View All
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
        {games.slice(0, limit).map((g, i) => (
          <GameCard key={g.id} game={g} index={i} />
        ))}
      </div>
    </section>
  );
}
