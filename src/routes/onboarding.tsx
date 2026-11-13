import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ParticleBackground } from "@/components/ParticleBackground";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your profile — HackMatch" },
      { name: "description", content: "Tell us about your skills and goals to find perfect teammates." },
    ],
  }),
  component: Onboarding,
});

const SKILL_GROUPS: { label: string; color: string; skills: string[] }[] = [
  { label: "Frontend", color: "hsl(var(--cyan))", skills: ["React", "Vue", "Angular", "CSS", "Tailwind", "Framer Motion"] },
  { label: "Backend", color: "hsl(var(--violet))", skills: ["Node", "Django", "FastAPI", "Go", "Rust", "PostgreSQL"] },
  { label: "AI/ML", color: "hsl(var(--rose))", skills: ["Python", "TensorFlow", "PyTorch", "LLMs", "HuggingFace", "OpenAI"] },
  { label: "Mobile", color: "hsl(var(--matrix))", skills: ["Flutter", "Swift", "React Native", "Kotlin"] },
  { label: "DevOps", color: "hsl(var(--gold))", skills: ["Docker", "AWS", "Kubernetes", "CI/CD", "Terraform"] },
  { label: "Design", color: "hsl(var(--rose))", skills: ["Figma", "Framer", "UX Research"] },
];

const ROLES = ["Frontend Developer", "Backend Developer", "Full-Stack Engineer", "AI/ML Engineer", "Mobile Engineer", "DevOps Engineer", "Product Designer", "Data Engineer"];

type FormState = {
  name: string;
  bio: string;
  city: string;
  is_remote: boolean;
  skills: string[];
  github_url: string;
  portfolio_url: string;
  experience_years: number;
  hackathon_count: number;
  role: string;
  team_size: number;
  availability: "weekend" | "month" | "flexible";
  goal: "win" | "learn" | "network";
};

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    bio: "",
    city: "",
    is_remote: true,
    skills: [],
    github_url: "",
    portfolio_url: "",
    experience_years: 3,
    hackathon_count: 0,
    role: "Full-Stack Engineer",
    team_size: 4,
    availability: "weekend",
    goal: "win",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      setUserId(session.user.id);
      // Pre-fill name from user metadata
      const metaName = (session.user.user_metadata as { name?: string; full_name?: string })?.name
        ?? (session.user.user_metadata as { full_name?: string })?.full_name;
      if (metaName) setForm((f) => ({ ...f, name: metaName }));
    });
  }, [navigate]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleSkill = (s: string) =>
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter((x) => x !== s) : [...f.skills, s],
    }));

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const finish = async () => {
    if (!userId) return;
    setSaving(true);
    const username = form.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20) + Math.floor(Math.random() * 1000);
    const { error } = await supabase.from("profiles").update({
      name: form.name,
      username,
      bio: form.bio,
      city: form.city,
      is_remote: form.is_remote,
      skills: form.skills,
      github_url: form.github_url || null,
      portfolio_url: form.portfolio_url || null,
      experience_years: form.experience_years,
      hackathon_count: form.hackathon_count,
      role: form.role,
      team_size: form.team_size,
      availability: form.availability,
      goal: form.goal,
      onboarded: true,
    }).eq("id", userId);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile complete! Time to swipe 🎉");
    navigate({ to: "/explore" });
  };

  const canAdvance =
    (step === 0 && form.name.trim().length > 0) ||
    (step === 1 && form.skills.length >= 3) ||
    (step === 2) ||
    step === 3;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <ParticleBackground density={60} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 font-mono text-xs uppercase tracking-widest">
              <span style={{ color: "hsl(var(--cyan))" }}>Step {step + 1} of 4</span>
              <span className="text-muted-foreground">{Math.round(((step + 1) / 4) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / 4) * 100}%` }}
                transition={{ type: "spring", damping: 20 }}
                style={{ boxShadow: "0 0 12px hsl(var(--violet))" }}
              />
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-8 min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {step === 0 && <Step1 form={form} update={update} />}
                {step === 1 && <Step2 form={form} toggleSkill={toggleSkill} />}
                {step === 2 && <Step3 form={form} update={update} />}
                {step === 3 && <Step4 form={form} update={update} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl glass disabled:opacity-30 hover:bg-white/5 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 3 ? (
              <button
                onClick={next}
                disabled={!canAdvance}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-bold glow-violet hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-bold glow-violet hover:scale-105 transition disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StepHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "hsl(var(--cyan))" }}>✦ {eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{sub}</p>
    </>
  );
}

const inputClass = "w-full glass rounded-xl px-4 py-3 outline-none focus:border-cyan transition";

function Step1({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader eyebrow="Identity" title="Who are you?" sub="The basics — your fellow hackers want to know." />
      <div className="mt-6">
        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Display name</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} placeholder="Ada Lovelace" />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Bio ({form.bio.length}/160)</label>
        <textarea
          value={form.bio}
          onChange={(e) => update("bio", e.target.value.slice(0, 160))}
          rows={3}
          className={inputClass}
          placeholder="What do you love to build? What kind of teammate are you?"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">City</label>
          <input value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} placeholder="San Francisco" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Open to remote?</label>
          <button
            type="button"
            onClick={() => update("is_remote", !form.is_remote)}
            className={`w-full rounded-xl py-3 px-4 font-bold transition ${form.is_remote ? "bg-gradient-primary text-white glow-violet" : "glass"}`}
          >
            {form.is_remote ? "Yes — remote OK" : "In-person only"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Step2({ form, toggleSkill }: { form: FormState; toggleSkill: (s: string) => void }) {
  return (
    <div>
      <StepHeader eyebrow="Stack" title="What's your stack?" sub={`Pick at least 3 skills. ${form.skills.length} selected.`} />
      <div className="mt-6 space-y-5">
        {SKILL_GROUPS.map((g) => (
          <div key={g.label}>
            <h3 className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: g.color }}>{g.label}</h3>
            <div className="flex flex-wrap gap-2">
              {g.skills.map((s) => {
                const active = form.skills.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSkill(s)}
                    className="px-3 py-1.5 rounded-full font-mono text-xs transition"
                    style={{
                      background: active ? g.color.replace(")", " / 0.2)") : "rgba(255,255,255,0.04)",
                      color: active ? g.color : "hsl(var(--foreground) / 0.7)",
                      border: `1px solid ${active ? g.color : "rgba(255,255,255,0.1)"}`,
                      boxShadow: active ? `0 0 12px ${g.color.replace(")", " / 0.5)")}` : "none",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step3({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader eyebrow="Experience" title="Show your work" sub="Help others gauge your background." />
      <div className="grid grid-cols-1 gap-4 mt-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">GitHub URL</label>
          <input value={form.github_url} onChange={(e) => update("github_url", e.target.value)} className={inputClass} placeholder="https://github.com/yourname" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Portfolio URL</label>
          <input value={form.portfolio_url} onChange={(e) => update("portfolio_url", e.target.value)} className={inputClass} placeholder="https://yourname.dev" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
            Years of experience: <span className="text-foreground font-bold">{form.experience_years}+</span>
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={form.experience_years}
            onChange={(e) => update("experience_years", Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Past hackathons</label>
            <input
              type="number"
              min={0}
              value={form.hackathon_count}
              onChange={(e) => update("hackathon_count", Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Preferred role</label>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className={inputClass}
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const Tile = <K extends keyof FormState>({
    field, value, label, color,
  }: { field: K; value: FormState[K]; label: string; color: string }) => {
    const active = form[field] === value;
    return (
      <button
        type="button"
        onClick={() => update(field, value)}
        className="rounded-xl py-4 px-3 font-bold text-sm transition"
        style={{
          background: active ? color.replace(")", " / 0.2)") : "rgba(255,255,255,0.03)",
          color: active ? color : "hsl(var(--foreground) / 0.8)",
          border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
          boxShadow: active ? `0 0 16px ${color.replace(")", " / 0.5)")}` : "none",
        }}
      >
        {label}
      </button>
    );
  };
  return (
    <div className="space-y-6">
      <StepHeader eyebrow="Goals" title="What do you want?" sub="We'll match you with people who want the same." />

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Team size: <span className="text-foreground font-bold">{form.team_size} people</span>
        </label>
        <input
          type="range" min={2} max={5}
          value={form.team_size}
          onChange={(e) => update("team_size", Number(e.target.value))}
          className="w-full accent-violet-500"
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Availability</label>
        <div className="grid grid-cols-3 gap-3">
          <Tile field="availability" value="weekend" label="This weekend" color="hsl(var(--matrix))" />
          <Tile field="availability" value="month" label="Next month" color="hsl(var(--cyan))" />
          <Tile field="availability" value="flexible" label="Flexible" color="hsl(var(--rose))" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Goal</label>
        <div className="grid grid-cols-3 gap-3">
          <Tile field="goal" value="win" label="🏆 Win it" color="hsl(var(--gold))" />
          <Tile field="goal" value="learn" label="🧠 Learn" color="hsl(var(--cyan))" />
          <Tile field="goal" value="network" label="🤝 Network" color="hsl(var(--rose))" />
        </div>
      </div>
    </div>
  );
}
