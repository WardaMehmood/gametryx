import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryRow } from "@/components/CategoryRow";
import { UploadSection } from "@/components/UploadSection";
import { Footer } from "@/components/Footer";
import { Game } from "@/data/games";
import { useState } from "react";
import { useGames } from "@/hooks/useGames";
import {
  LayoutGrid,
  Swords,
  Gamepad2,
  BrainCircuit,
  Skull,
  Car,
  Layers,
  Wand2,
  Building2,
  Network,
  Shield,
  Compass,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Game Tryx — Discover. Download. Play." },
      { name: "description", content: "Neon-lit indie game showcase. Discover, download and play games crafted by developers and students." },
      { property: "og:title", content: "Game Tryx — Indie Game Showcase" },
      { property: "og:description", content: "A futuristic gaming launcher for indie creators." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
}));

// Lucide icon map per category
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  All: LayoutGrid,
  Action: Swords,
  Arcade: Gamepad2,
  Puzzle: BrainCircuit,
  Horror: Skull,
  Racing: Car,
  Platformer: Layers,
  RPG: Wand2,
  Simulation: Building2,
  Strategy: Network,
  Survival: Shield,
  Adventure: Compass,
};

function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { games, loading, error } = useGames();

  // Helper to apply search text filter
  const filterBySearch = (gameList: Game[]) => {
    if (!searchQuery.trim()) return gameList;
    return gameList.filter((g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.developer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // All games (no limit)
  const trendingGames = filterBySearch(games);

  // Dynamically derive categories from loaded game data
  const allCategories = Array.from(new Set(games.map((g) => g.category).filter(Boolean))).sort();
  const categoriesToShow = selectedCategory === "All"
    ? allCategories
    : allCategories.filter((c) => c === selectedCategory);

  // Filter tabs: "All" first, then sorted categories
  const filterTabs = ["All", ...allCategories];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />
      <main>
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={allCategories}
        />

        <div id="games-section" className="mx-auto max-w-7xl px-6 py-12 md:py-16 scroll-mt-20">

          {/* ── Skeleton while loading ── */}
          {loading && (
            <div className="space-y-8">
              <div className="flex gap-2 overflow-x-hidden">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-9 w-24 shrink-0 rounded-full bg-white/5 animate-pulse" />
                ))}
              </div>
              <div className="flex flex-col gap-6">
                <div className="h-8 w-48 rounded-md bg-white/5 animate-pulse" />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="aspect-[16/13] rounded-2xl glass animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Error state ── */}
          {error && (
            <div className="text-center py-20 opacity-70">
              <h3 className="text-2xl font-bold text-destructive">Error Loading Games</h3>
              <p className="mt-2 text-muted-foreground">{error}</p>
            </div>
          )}

          {/* ── Category Filter Pills ── */}
          {!loading && !error && allCategories.length > 0 && (
            <div className="mb-10">
              <div className="flex flex-wrap gap-2">
                {filterTabs.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const IconComponent = CATEGORY_ICONS[cat] ?? LayoutGrid;
                  const count = cat === "All" ? trendingGames.length : trendingGames.filter(g => g.category === cat).length;
                  
                  return (
                    <button
                      key={cat}
                      id={`filter-${cat.toLowerCase()}`}
                      onClick={() => setSelectedCategory(cat)}
                      style={
                        isActive
                          ? {
                              background: "linear-gradient(135deg, oklch(0.55 0.28 305), oklch(0.6 0.22 240))",
                              boxShadow: "0 0 16px oklch(0.55 0.28 305 / 0.5), 0 0 4px oklch(0.55 0.28 305 / 0.3)",
                              borderColor: "oklch(0.55 0.28 305 / 0.7)",
                              color: "#fff",
                            }
                          : {
                              background: "oklch(0.17 0.025 290 / 0.6)",
                              borderColor: "oklch(0.3 0.04 290 / 0.5)",
                              color: "oklch(0.65 0.04 290)",
                            }
                      }
                      className={[
                        "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest",
                        "transition-all duration-200 cursor-pointer outline-none",
                        "hover:scale-105 active:scale-95",
                        isActive ? "" : "hover:border-primary/40 hover:text-foreground",
                      ].join(" ")}
                    >
                      <IconComponent size={13} strokeWidth={2} />
                      <span>{cat}</span>
                      <span 
                        className={`ml-0.5 flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                          isActive ? "bg-white/20 text-white" : "bg-white/10 text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* neon divider */}
              <div
                className="mt-5 h-px w-full"
                style={{
                  background: "linear-gradient(to right, transparent, oklch(0.55 0.28 305 / 0.3), transparent)",
                }}
              />
            </div>
          )}

          {/* ── All Games grid ── */}
          {!loading && !error && selectedCategory === "All" && trendingGames.length > 0 && (
            <div id="all-games" className="animate-in fade-in duration-500">
              <CategoryRow title="All" games={trendingGames} limit={500} />
            </div>
          )}

          {/* ── Filtered category grid ── */}
          {!loading && !error && selectedCategory !== "All" && (
            <div id="categories" className="space-y-20 animate-in fade-in duration-500">
              {categoriesToShow.map((cat) => {
                const categoryGames = filterBySearch(games.filter((g) => g.category === cat));
                if (categoryGames.length === 0) return null;
                return (
                  <CategoryRow
                    key={cat}
                    title={cat}
                    games={categoryGames}
                    limit={500}
                  />
                );
              })}

              {categoriesToShow.every(
                (cat) => filterBySearch(games.filter((g) => g.category === cat)).length === 0
              ) && (
                <div className="text-center py-20 opacity-70">
                  <h3 className="text-2xl font-bold">
                    No games found{searchQuery ? ` for "${searchQuery}"` : ""}
                  </h3>
                  <p className="mt-2 text-muted-foreground">Try searching for a different title or developer.</p>
                </div>
              )}
            </div>
          )}

          {/* ── No search results ── */}
          {!loading && !error && selectedCategory === "All" && trendingGames.length === 0 && searchQuery && (
            <div className="text-center py-20 opacity-70">
              <h3 className="text-2xl font-bold">No games found for "{searchQuery}"</h3>
              <p className="mt-2 text-muted-foreground">Try searching for a different title or developer.</p>
            </div>
          )}

        </div>

        <UploadSection />
      </main>
      <Footer />
    </div>
  );
}
