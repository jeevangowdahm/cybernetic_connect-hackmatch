import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Construction } from "lucide-react";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Your Matches — HackMatch" },
      { name: "description", content: "Chat with your matched hackathon teammates in real time." },
    ],
  }),
  component: Matches,
});

function Matches() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[88px] px-6">
        <div className="mx-auto max-w-3xl text-center pt-20">
          <Construction className="h-12 w-12 mx-auto mb-6" style={{ color: "hsl(var(--cyan))" }} />
          <h1 className="font-display text-5xl font-extrabold text-gradient mb-4">Matches</h1>
          <p className="text-muted-foreground font-mono">
            Realtime chat & match grid coming in v2.
          </p>
        </div>
      </main>
    </>
  );
}
