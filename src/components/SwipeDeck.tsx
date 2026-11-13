import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Heart, X, Star, MapPin, Wifi, MessageCircle, Eye } from "lucide-react";
import { mockDevelopers, type Developer } from "@/lib/mock-data";
import { MatchRing } from "./MatchRing";
import type { Filters } from "./FiltersPanel";

function applyFilters(devs: Developer[], f: Filters): Developer[] {
  return devs.filter((d) => {
    if (f.skills.length > 0 && !f.skills.every((s) => d.skills.includes(s))) return false;
    if (f.availability !== "any" && d.availability !== f.availability) return false;
    if (d.experience < f.minExperience) return false;
    return true;
  });
}

function DevCard({
  dev, onSwipe, index, total,
}: {
  dev: Developer;
  onSwipe: (dir: "left" | "right" | "up") => void;
  index: number;
  total: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const likeOpacity = useTransform(x, [40, 160], [0, 1]);
  const nopeOpacity = useTransform(x, [-160, -40], [1, 0]);

  const isTop = index === 0;
  const offset = index * 12;
  const scale = 1 - index * 0.04;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotate: isTop ? rotate : 0,
        zIndex: total - index,
      }}
      initial={{ scale, y: offset, opacity: 0 }}
      animate={{ scale, y: offset, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 600 : x.get() < 0 ? -600 : 0,
        y: y.get() < -100 ? -600 : 0,
        opacity: 0,
        transition: { duration: 0.4 },
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 140) onSwipe("right");
        else if (info.offset.x < -140) onSwipe("left");
        else if (info.offset.y < -140) onSwipe("up");
      }}
      whileTap={isTop ? { cursor: "grabbing" } : {}}
    >
      <div className="relative h-full w-full glass-strong rounded-3xl overflow-hidden cursor-grab">
        {isTop && (
          <>
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 right-8 z-20 rotate-12">
              <span style={{ color: "hsl(var(--matrix))", borderColor: "hsl(var(--matrix))", padding: "8px 16px", border: "4px solid", borderRadius: 12, display: "inline-block", fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800 }}>
                MATCH
              </span>
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 left-8 z-20 -rotate-12">
              <span style={{ color: "hsl(var(--destructive))", borderColor: "hsl(var(--destructive))", padding: "8px 16px", border: "4px solid", borderRadius: 12, display: "inline-block", fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800 }}>
                NOPE
              </span>
            </motion.div>
          </>
        )}

        <div className="relative p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className={`h-32 w-32 rounded-2xl bg-gradient-to-br ${dev.avatarColor} ring-2 ring-white/10 glow-violet flex items-center justify-center font-display text-5xl font-extrabold text-white`}>
              {dev.name.charAt(0)}
            </div>
            <MatchRing value={dev.matchScore} size={72} />
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-3xl font-extrabold text-foreground">{dev.name}</h2>
              {dev.online && <span className="h-2.5 w-2.5 rounded-full" style={{ background: "hsl(var(--matrix))", boxShadow: "0 0 10px hsl(var(--matrix))" }} />}
            </div>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-wider" style={{ color: "hsl(var(--cyan))", borderColor: "hsl(var(--cyan) / 0.4)" }}>
              {dev.role}
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground font-mono">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {dev.city}</span>
              {dev.remote && <span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3" /> Remote</span>}
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <p className="text-sm text-foreground/80 leading-relaxed">{dev.bio}</p>
        </div>

        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {dev.skills.slice(0, 5).map((skill, i) => {
              const colors = ["hsl(var(--violet))", "hsl(var(--cyan))", "hsl(var(--rose))", "hsl(var(--matrix))", "hsl(var(--gold))"];
              const c = colors[i % colors.length];
              return (
                <span key={skill} className="px-2.5 py-1 rounded-md text-xs font-mono"
                  style={{ background: c.replace(")", " / 0.12)"), color: c, border: `1px solid ${c.replace(")", " / 0.35)")}` }}>
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <div>
            <div className="text-muted-foreground uppercase tracking-wider">Experience</div>
            <div className="text-foreground font-bold text-base">{dev.experience}y</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground uppercase tracking-wider">Hackathons</div>
            <div className="text-foreground font-bold text-base">{dev.hackathons}</div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground uppercase tracking-wider">Goal</div>
            <div className="font-bold text-base capitalize" style={{ color: "hsl(var(--rose))" }}>{dev.goal}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SwipeDeck({ filters }: { filters: Filters }) {
  const filtered = useMemo(() => applyFilters(mockDevelopers, filters), [filters]);
  const [deck, setDeck] = useState<Developer[]>(filtered);
  const [showMatch, setShowMatch] = useState<Developer | null>(null);

  // Re-seed deck whenever filters change
  useEffect(() => { setDeck(filtered); }, [filtered]);

  const handleSwipe = (dir: "left" | "right" | "up") => {
    const top = deck[0];
    if (!top) return;
    if (dir === "right" && top.matchScore >= 80) setShowMatch(top);
    setTimeout(() => setDeck((d) => d.slice(1)), 50);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleSwipe("left");
      if (e.key === "ArrowRight") handleSwipe("right");
      if (e.key === "ArrowUp") handleSwipe("up");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: "min(420px, 92vw)", height: 580 }}>
        <AnimatePresence>
          {deck.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 glass rounded-3xl flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="font-display text-2xl font-extrabold text-gradient mb-2">No more matches</h3>
              <p className="text-muted-foreground text-sm font-mono">
                Try loosening your filters or check back soon.
              </p>
            </motion.div>
          ) : (
            deck.slice(0, 3).map((dev, i) => (
              <DevCard key={dev.id} dev={dev} onSwipe={handleSwipe} index={i} total={3} />
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-5">
        <ActionButton onClick={() => handleSwipe("left")} color="hsl(var(--destructive))" label="Reject"><X className="h-6 w-6" /></ActionButton>
        <ActionButton onClick={() => handleSwipe("up")} color="hsl(var(--gold))" label="Super-like" large><Star className="h-7 w-7" /></ActionButton>
        <ActionButton onClick={() => handleSwipe("right")} color="hsl(var(--matrix))" label="Like"><Heart className="h-6 w-6" /></ActionButton>
      </div>

      <p className="mt-4 text-xs font-mono text-muted-foreground">← skip · ↑ super-like · → match</p>

      <AnimatePresence>
        {showMatch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setShowMatch(null)}>
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", damping: 18 }} className="glass-strong rounded-3xl p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
              {/* Avatars */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 via-cyan-400 to-rose-400 ring-2 ring-white/10 glow-violet" />
                <div className="text-3xl">⚡</div>
                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${showMatch.avatarColor} ring-2 ring-white/10 glow-cyan flex items-center justify-center font-display text-3xl font-extrabold text-white`}>
                  {showMatch.name.charAt(0)}
                </div>
              </div>

              <h2 className="font-display text-5xl font-extrabold text-gradient mb-2">It's a Match!</h2>
              <p className="text-foreground/80 mb-2">
                You and <span className="font-bold" style={{ color: "hsl(var(--cyan))" }}>{showMatch.name}</span> liked each other.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-6 text-xs font-mono" style={{ borderColor: "hsl(var(--matrix) / 0.4)" }}>
                <span className="h-2 w-2 rounded-full" style={{ background: "hsl(var(--matrix))" }} />
                <span style={{ color: "hsl(var(--matrix))" }}>{showMatch.matchScore}% compatibility</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowMatch(null)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass hover:bg-white/10 transition text-sm font-medium"
                >
                  <Eye className="h-4 w-4" /> View profile
                </button>
                <button
                  onClick={() => setShowMatch(null)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-primary text-white font-bold glow-violet hover:scale-105 transition text-sm"
                >
                  <MessageCircle className="h-4 w-4" /> Start chat
                </button>
              </div>
              <button
                onClick={() => setShowMatch(null)}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground transition font-mono"
              >
                Keep swiping →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({
  children, color, onClick, label, large,
}: { children: React.ReactNode; color: string; onClick: () => void; label: string; large?: boolean }) {
  const size = large ? "h-16 w-16" : "h-14 w-14";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`${size} rounded-full glass flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
      style={{ color, borderColor: color.replace(")", " / 0.6)"), boxShadow: `0 0 24px ${color.replace(")", " / 0.5)")}` }}
    >
      {children}
    </button>
  );
}
