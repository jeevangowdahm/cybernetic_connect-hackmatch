import { createFileRoute, Link } from "@tanstack/react-router";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HackMatch — Find Your Hackathon Dream Team" },
      { name: "description", content: "Tinder-style teammate finder for hackathon developers. Swipe, match, build, win." },
      { property: "og:title", content: "HackMatch — Find Your Hackathon Dream Team" },
      { property: "og:description", content: "Tinder-style teammate finder for hackathon developers. Swipe, match, build, win." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden pt-[68px]">
        <div className="absolute inset-0">
          <ParticleBackground density={120} />
        </div>

        <section className="relative z-10 min-h-[calc(100vh-68px)] flex flex-col items-center justify-center px-6 text-center">
          {/* Eyebrow */}
          <div
            className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass font-mono text-xs uppercase tracking-[0.3em]"
            style={{ animationDelay: "0ms", color: "hsl(var(--cyan))", borderColor: "hsl(var(--cyan) / 0.4)" }}
          >
            ✦ Hackathon Teammate Finder ✦
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up mt-8 font-display font-extrabold leading-[0.95] tracking-tight text-[clamp(3rem,9vw,7.5rem)]"
              style={{ animationDelay: "120ms" }}>
            <span className="block text-foreground">Find Your</span>
            <span className="block text-gradient">Dream Team</span>
          </h1>

          {/* Subtext */}
          <p
            className="animate-fade-up mt-8 max-w-2xl text-lg md:text-xl text-foreground/70 leading-relaxed"
            style={{ animationDelay: "240ms" }}
          >
            Swipe through 12,400+ developers. Match by skills, vibe, and hackathon goals.
            Build your dream team in minutes — not weeks.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
               style={{ animationDelay: "360ms" }}>
            <Link
              to="/explore"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-primary text-white font-display font-bold text-lg glow-violet hover:scale-105 transition-transform"
            >
              Find My Team
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl glass border-2 font-display font-bold text-lg text-foreground hover:bg-white/5 transition"
              style={{ borderColor: "hsl(var(--cyan) / 0.4)" }}
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="animate-fade-up mt-20 grid grid-cols-3 gap-8 md:gap-16"
               style={{ animationDelay: "480ms" }}>
            <Stat n="12,400+" label="Developers" />
            <Stat n="3,200+" label="Teams Formed" />
            <Stat n="840+" label="Hackathons Won" />
          </div>
        </section>
      </main>
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display font-extrabold text-4xl md:text-5xl text-gradient">{n}</div>
      <div className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
    </div>
  );
}
