import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";

const links = [
  { to: "/explore", label: "Explore" },
  { to: "/matches", label: "Matches" },
  { to: "/teams", label: "Teams" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[68px]">
      <div className="glass-strong relative h-full">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-primary glow-violet group-hover:scale-110 transition-transform">
              <div className="absolute inset-[2px] rounded-[10px] bg-background/40 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="font-display text-2xl font-extrabold text-gradient tracking-tight">HackMatch</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active ? "bg-cyan/5" : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                  }`}
                  style={active ? { borderColor: "hsl(var(--cyan))", color: "hsl(var(--cyan))", border: "1px solid" } : undefined}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              to="/ai-search"
              className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium glass hover:bg-white/5 transition"
              style={{ borderColor: "hsl(var(--violet) / 0.5)" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "hsl(var(--matrix))" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "hsl(var(--matrix))" }} />
              </span>
              AI Search
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button className="relative p-2 rounded-lg hover:bg-white/5 transition" aria-label="Notifications">
                  <Bell className="h-5 w-5 text-foreground/80" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ background: "hsl(var(--rose))" }} />
                </button>
                <div className="relative" ref={ref}>
                  <button
                    onClick={() => setOpen((v) => !v)}
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 via-cyan-400 to-rose-400 ring-2 ring-white/10 flex items-center justify-center font-bold text-sm text-white"
                    aria-label="Account"
                  >
                    {(user.email || "U").charAt(0).toUpperCase()}
                  </button>
                  {open && (
                    <div className="absolute right-0 mt-2 w-56 glass-strong rounded-xl p-2 shadow-xl">
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <div className="text-xs text-muted-foreground font-mono">Signed in as</div>
                        <div className="text-sm truncate">{user.email}</div>
                      </div>
                      <button
                        onClick={signOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-lg bg-gradient-primary text-white font-bold text-sm glow-violet hover:scale-105 transition"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-rainbow animate-rainbow opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-rainbow animate-rainbow opacity-60 blur-md" />
      </div>
    </header>
  );
}
