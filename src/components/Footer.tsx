import { Github, Twitter, Twitch, Youtube, MessageCircle as Discord } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-primary/40 pt-16 pb-8"
      style={{ boxShadow: "0 -1px 30px oklch(0.55 0.28 305 / 0.5)" }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Game Tryx is the neon-lit launcher for indie game creators. Discover, download, and play games built by developers and students worldwide.
          </p>
        </div>

        <div className="md:justify-self-center">
          <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {["Home", "Categories", "Trending", "Upload"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="text-foreground/80 transition hover:text-primary">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:justify-self-end">
          <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Follow</h4>
          <div className="mt-4 flex gap-3">
            {[Twitter, Discord, Github, Twitch, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="social"
                className="grid size-10 place-items-center rounded-full border border-primary/40 bg-card/50 text-muted-foreground transition hover:scale-110 hover:border-primary hover:text-foreground hover:shadow-[0_0_20px_oklch(0.55_0.28_305_/_0.7)]">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-primary/20 px-6 pt-6 text-xs text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Game Tryx. All rights reserved.</p>
        <p>Crafted with <span className="text-accent" style={{color:"oklch(0.7 0.32 340)"}}>♥</span> for indie creators.</p>
      </div>
    </footer>
  );
}
