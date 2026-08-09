import { motion } from "framer-motion";
import { Download } from "lucide-react";
import type { Game } from "@/data/games";
import { Link } from "@tanstack/react-router";

export function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  return (
    <Link to="/game/$id" params={{ id: game.id }} className="block">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.4, delay: (index % 5) * 0.05 }}
        className="group hover-glow relative overflow-hidden rounded-2xl glass"
      >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          decoding="async"
          width={960}
          height={544}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-primary/50 bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur">
          {game.category}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-display text-base font-bold leading-tight">{game.title}</h3>
          <p className="text-xs text-muted-foreground">by {game.developer}</p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(game.driveLink, '_blank');
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground transition hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_20px_oklch(0.55_0.28_305_/_0.6)]"
        >
          <Download className="size-3.5" /> Download
        </button>
      </div>
      </motion.article>
    </Link>
  );
}