import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.svg";

export function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = [],
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categories?: string[];
}) {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <img
        src={heroBg}
        alt="Hero Background"
        className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/30 -z-10" />

      {/* content over the image */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center px-6"
        >
          <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-6xl lg:text-7xl text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.85)]">
            <span className="block neon-text">DISCOVER.</span>
            <span className="block neon-text">DOWNLOAD.</span>
            <span className="block neon-text">PLAY.</span>
          </h1>

          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Explore amazing games made by developers and players like you.
          </p>

          <div className="mt-8 glass rounded-2xl p-3 shadow-[0_10px_40px_-15px_oklch(0.55_0.28_305_/_0.6)]">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex flex-1 items-center gap-2 border-b md:border-b-0 border-white/10 pb-2 md:pb-0">
                <Search className="ml-3 size-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search games by title or developer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center gap-2 pt-2 md:pt-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 md:flex-none cursor-pointer rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary appearance-none"
                >
                  <option value="All" className="bg-background">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-background">
                      {cat}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={() => {
                    document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_12px_oklch(0.55_0.28_305_/_0.5)] transition hover:scale-105"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
