import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SwipeDeck } from "@/components/SwipeDeck";
import { FiltersPanel, DEFAULT_FILTERS, type Filters } from "@/components/FiltersPanel";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Developers — HackMatch" },
      { name: "description", content: "Swipe through hackathon-ready developers and find your perfect teammate." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-[88px] pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "hsl(var(--cyan))" }}>
                ✦ Explore
              </p>
              <h1 className="mt-2 font-display text-4xl md:text-5xl font-extrabold">
                <span className="text-foreground">Swipe Your </span>
                <span className="text-gradient">Future Team</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground font-mono">
                Drag right to match · left to skip · up to super-like
              </p>
            </div>
            <FiltersPanel value={filters} onChange={setFilters} />
          </header>

          <div className="flex justify-center">
            <SwipeDeck filters={filters} />
          </div>
        </div>
      </main>
    </>
  );
}
