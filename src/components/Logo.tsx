import logoImg from "@/assets/logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/** Display the provided logo if available; fallback to the SVG when not */}
      <div className="relative">
        <img src={logoImg} alt="Game Tryx" className="w-9 h-9 rounded object-contain drop-shadow-[0_0_10px_oklch(0.55_0.28_305_/_0.7)]" />
      </div>
      <span className="font-display text-lg font-bold tracking-widest neon-text" style={{ fontFamily: "var(--font-display)" }}>
        GAME TRYX
      </span>
    </div>
  );
}
