import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, X } from "lucide-react";

export type Filters = {
  skills: string[];
  availability: "any" | "weekend" | "month" | "flexible";
  minExperience: number;
};

export const DEFAULT_FILTERS: Filters = {
  skills: [],
  availability: "any",
  minExperience: 0,
};

const ALL_SKILLS = [
  "React", "Vue", "Angular", "Node", "Python", "Go", "Rust", "TypeScript",
  "PostgreSQL", "Docker", "AWS", "LLMs", "OpenAI", "PyTorch", "HuggingFace",
  "Flutter", "Swift", "Figma", "FastAPI", "Three.js", "Framer Motion", "Tailwind",
];

export function FiltersPanel({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
}) {
  const [open, setOpen] = useState(false);

  const activeCount = useMemo(() => {
    let n = value.skills.length;
    if (value.availability !== "any") n++;
    if (value.minExperience > 0) n++;
    return n;
  }, [value]);

  const toggleSkill = (s: string) => {
    onChange({
      ...value,
      skills: value.skills.includes(s)
        ? value.skills.filter((x) => x !== s)
        : [...value.skills, s],
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm hover:bg-white/5 transition"
      >
        <Sliders className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <span
            className="ml-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-xs font-bold"
            style={{ background: "hsl(var(--violet))", color: "white" }}
          >
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] z-50 glass-strong p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "hsl(var(--cyan))" }}>✦ Filters</p>
                  <h2 className="font-display text-2xl font-extrabold mt-1">Narrow your swipes</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Must have skills ({value.skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map((s) => {
                    const active = value.skills.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className="px-3 py-1.5 rounded-full font-mono text-xs transition"
                        style={{
                          background: active ? "hsl(var(--cyan) / 0.2)" : "rgba(255,255,255,0.04)",
                          color: active ? "hsl(var(--cyan))" : "hsl(var(--foreground) / 0.7)",
                          border: `1px solid ${active ? "hsl(var(--cyan))" : "rgba(255,255,255,0.1)"}`,
                          boxShadow: active ? "0 0 10px hsl(var(--cyan) / 0.5)" : "none",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Availability</h3>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { v: "any", l: "Any time" },
                    { v: "weekend", l: "This weekend" },
                    { v: "month", l: "Next month" },
                    { v: "flexible", l: "Flexible" },
                  ] as const).map((o) => {
                    const active = value.availability === o.v;
                    return (
                      <button
                        key={o.v}
                        onClick={() => onChange({ ...value, availability: o.v })}
                        className="rounded-xl py-2.5 px-3 text-sm font-medium transition"
                        style={{
                          background: active ? "hsl(var(--violet) / 0.2)" : "rgba(255,255,255,0.04)",
                          color: active ? "hsl(var(--violet))" : "hsl(var(--foreground) / 0.8)",
                          border: `1px solid ${active ? "hsl(var(--violet))" : "rgba(255,255,255,0.1)"}`,
                        }}
                      >
                        {o.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Min experience: <span className="text-foreground font-bold">{value.minExperience}+ years</span>
                </h3>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={value.minExperience}
                  onChange={(e) => onChange({ ...value, minExperience: Number(e.target.value) })}
                  className="w-full accent-violet-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 sticky bottom-0 pt-4 bg-gradient-to-t from-background to-transparent">
                <button
                  onClick={() => onChange(DEFAULT_FILTERS)}
                  className="flex-1 px-4 py-3 rounded-xl glass hover:bg-white/5 transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-primary text-white font-bold glow-violet hover:scale-[1.02] transition"
                >
                  Apply
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
