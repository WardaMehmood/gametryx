import { createFileRoute } from '@tanstack/react-router'
import { Download, Star, Info, Share2, ChevronLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useGames } from '@/hooks/useGames'

export const Route = createFileRoute('/game/$id')({
  component: GameDetailsComponent,
})

function GameDetailsComponent() {
  const { id } = Route.useParams()
  const { games, loading, error } = useGames()
  const game = games.find(g => g.id === id)

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 animate-pulse">
        <div className="mb-6 h-4 w-24 bg-white/5 rounded"></div>
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="shrink-0">
            <div className="size-32 rounded-2xl glass md:size-48" />
          </div>
          <div className="flex flex-1 flex-col justify-center space-y-4 w-full">
            <div>
              <div className="h-10 w-3/4 rounded-md glass mb-2" />
              <div className="h-6 w-1/3 rounded-md glass" />
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-20 rounded-full glass" />
              <div className="h-8 w-16 rounded-full glass" />
            </div>
            <div className="h-12 w-48 rounded-xl glass mt-2" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-destructive">Error Loading Game</h2>
        <p className="text-muted-foreground">{error}</p>
        <Link to="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Game Not Found</h2>
        <Link to="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ChevronLeft className="size-4" /> Back to Games
      </Link>

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="shrink-0">
          <img 
            src={game.thumbnail} 
            alt={game.title} 
            className="size-32 rounded-2xl object-cover shadow-2xl md:size-48 border border-white/10"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
        
        <div className="flex flex-1 flex-col justify-center space-y-4">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-5xl">{game.title}</h1>
            <p className="text-lg text-primary/80">{game.developer}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-primary border border-primary/30">
              {game.category}
            </span>
            <span className="flex items-center gap-1 text-yellow-500">
              <Star className="size-4 fill-current" /> 4.8
            </span>
            <span className="text-muted-foreground">1M+ Downloads</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-muted-foreground">Everyone</span>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => window.open(game.driveLink, '_blank')}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-[0_0_20px_oklch(0.55_0.28_305_/_0.5)] transition hover:scale-105 active:scale-95 md:flex-none"
            >
              <Download className="size-5" /> Download Game
            </button>
            <button className="inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10">
              <Share2 className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Screenshots Section */}
      {game.screenshots && game.screenshots.length > 0 && (
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Screenshots</h2>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden">
            {game.screenshots.map((img, i) => (
              <img 
                key={i}
                src={img} 
                alt={`${game.title} screenshot ${i+1}`}
                className="aspect-video w-[280px] shrink-0 snap-center rounded-xl object-cover shadow-lg border border-white/5 md:w-[400px] hover:scale-[1.02] transition-transform"
              />
            ))}
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="mt-8 space-y-4 pb-12">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Info className="size-5 text-primary" /> About this game
        </h2>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 leading-relaxed text-muted-foreground shadow-inner">
          {game.description || "No description available for this game."}
        </div>
      </div>
    </div>
  )
}
