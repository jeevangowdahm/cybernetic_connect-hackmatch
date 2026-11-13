import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { MatchRing } from "@/components/MatchRing";
import { aiSearchDevelopers } from "@/lib/ai-search.functions";
import { Sparkles, Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/ai-search")({
  head: () => ({
    meta: [
      { title: "AI Search — HackMatch" },
      { name: "description", content: "Find teammates using natural language. Powered by AI." },
    ],
  }),
  component: AISearch,
});

const suggestions = [
  "Find me a React dev who knows AI",
  "Who can do backend + deployment?",
  "Find someone to build a ChatGPT UI",
  "Need AI + Backend combo",
];

type Message =
  | { role: "ai"; type: "text"; content: string }
  | { role: "ai"; type: "results"; content: string; results: Awaited<ReturnType<typeof aiSearchDevelopers>>["results"] }
  | { role: "user"; type: "text"; content: string };

function AISearch() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", type: "text", content: "Hey! Describe what you're building or what skills you need, and I'll search through developers and rank the best matches with reasons." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", type: "text", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiSearchDevelopers({ data: { prompt: text } });
      if (res.error) {
        setMessages((m) => [...m, { role: "ai", type: "text", content: `⚠️ ${res.error}` }]);
      } else if (res.results.length === 0) {
        setMessages((m) => [...m, { role: "ai", type: "text", content: "No matches found. Try a different prompt." }]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "ai",
            type: "results",
            content: `Found ${res.results.length} great match${res.results.length === 1 ? "" : "es"}:`,
            results: res.results,
          },
        ]);
      }
    } catch {
      setMessages((m) => [...m, { role: "ai", type: "text", content: "⚠️ Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[88px] pb-12 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center pt-4 pb-8">
            <div className="relative mx-auto h-20 w-20 mb-4">
              <div className="absolute inset-0 rounded-full animate-spin-slow" style={{ background: "conic-gradient(from 0deg, hsl(var(--violet)), hsl(var(--cyan)), hsl(var(--rose)), hsl(var(--violet)))" }} />
              <div className="absolute inset-[5px] rounded-full bg-background flex items-center justify-center">
                <Sparkles className="h-7 w-7" style={{ color: "hsl(var(--cyan))" }} />
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-gradient">HackMatch AI</h1>
            <p className="mt-1 text-xs text-muted-foreground font-mono flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full animate-pulse-dot" style={{ background: "hsl(var(--matrix))" }} />
              Connected to 12,400+ profiles
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-4 mb-6">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "user" ? (
                    <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-gradient-primary text-white">
                      {m.content}
                    </div>
                  ) : m.type === "results" ? (
                    <div className="max-w-full w-full">
                      <div className="glass rounded-2xl px-5 py-3 mb-3 max-w-[80%]" style={{ borderColor: "hsl(var(--violet) / 0.4)" }}>
                        <p className="text-sm">{m.content}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {m.results.map((r) => (
                          <motion.div
                            key={r.id}
                            whileHover={{ scale: 1.02 }}
                            className="glass-strong rounded-2xl p-4 cursor-pointer transition-all hover:glow-violet"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${r.avatarColor} flex items-center justify-center font-display text-xl font-extrabold text-white flex-shrink-0`}>
                                {r.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="font-display font-extrabold truncate">{r.name}</h3>
                                  <MatchRing value={r.matchScore} size={44} />
                                </div>
                                <p className="text-xs font-mono uppercase tracking-wider mt-0.5" style={{ color: "hsl(var(--cyan))" }}>{r.role}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {r.skills.slice(0, 4).map((s) => (
                                <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono"
                                  style={{ background: "hsl(var(--violet) / 0.15)", color: "hsl(var(--violet))", border: "1px solid hsl(var(--violet) / 0.3)" }}>
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className="mt-3 text-xs text-foreground/70 italic">"{r.reason}"</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="glass rounded-2xl px-5 py-3 max-w-[80%]" style={{ borderColor: "hsl(var(--violet) / 0.4)" }}>
                      <p className="text-sm">{m.content}</p>
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="glass rounded-2xl px-5 py-3 flex items-center gap-2" style={{ borderColor: "hsl(var(--violet) / 0.4)" }}>
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: "hsl(var(--violet))" }} />
                    <span className="text-sm text-muted-foreground">Searching profiles…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-full glass text-xs font-mono hover:bg-white/10 transition disabled:opacity-50"
                  style={{ borderColor: "hsl(var(--cyan) / 0.3)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="glass-strong rounded-2xl p-2 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your dream teammate..."
              className="flex-1 bg-transparent px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-11 w-11 rounded-xl bg-gradient-primary text-white flex items-center justify-center hover:scale-105 transition glow-violet disabled:opacity-50 disabled:hover:scale-100"
              aria-label="Send"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
