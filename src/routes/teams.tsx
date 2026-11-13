import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Users } from "lucide-react";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Your Teams — HackMatch" },
      { name: "description", content: "Manage your hackathon teams and track skill coverage." },
    ],
  }),
  component: Teams,
});

function Teams() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[88px] px-6">
        <div className="mx-auto max-w-3xl text-center pt-20">
          <Users className="h-12 w-12 mx-auto mb-6" style={{ color: "hsl(var(--rose))" }} />
          <h1 className="font-display text-5xl font-extrabold text-gradient mb-4">Teams</h1>
          <p className="text-muted-foreground font-mono">
            Team builder with skill radar coming in v2.
          </p>
        </div>
      </main>
    </>
  );
}
