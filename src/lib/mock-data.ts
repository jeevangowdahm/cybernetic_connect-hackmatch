export type Developer = {
  id: string;
  name: string;
  username: string;
  role: string;
  bio: string;
  skills: string[];
  experience: number;
  hackathons: number;
  availability: "weekend" | "month" | "flexible";
  goal: "win" | "learn" | "network";
  city: string;
  remote: boolean;
  matchScore: number;
  avatarColor: string;
  online: boolean;
};

export const mockDevelopers: Developer[] = [
  {
    id: "1",
    name: "Aria Chen",
    username: "aria",
    role: "Full-Stack Engineer",
    bio: "Shipped 12 hackathon projects. Love building wild AI demos in 48h.",
    skills: ["React", "Node", "TypeScript", "PostgreSQL", "OpenAI"],
    experience: 6,
    hackathons: 12,
    availability: "weekend",
    goal: "win",
    city: "San Francisco",
    remote: true,
    matchScore: 94,
    avatarColor: "from-violet-500 to-cyan-400",
    online: true,
  },
  {
    id: "2",
    name: "Marco Reyes",
    username: "marco",
    role: "AI/ML Engineer",
    bio: "Fine-tuning LLMs for fun. Looking for a frontend wizard.",
    skills: ["Python", "PyTorch", "LLMs", "HuggingFace", "FastAPI"],
    experience: 4,
    hackathons: 7,
    availability: "weekend",
    goal: "win",
    city: "Berlin",
    remote: true,
    matchScore: 88,
    avatarColor: "from-pink-500 to-violet-500",
    online: true,
  },
  {
    id: "3",
    name: "Priya Sharma",
    username: "priya",
    role: "Frontend Developer",
    bio: "Pixel-perfect UIs and motion design. Framer Motion is my love language.",
    skills: ["React", "Framer Motion", "Three.js", "Tailwind", "Figma"],
    experience: 5,
    hackathons: 9,
    availability: "flexible",
    goal: "learn",
    city: "Bangalore",
    remote: true,
    matchScore: 82,
    avatarColor: "from-cyan-400 to-emerald-400",
    online: false,
  },
  {
    id: "4",
    name: "Theo Ndlovu",
    username: "theo",
    role: "Backend / DevOps",
    bio: "I make things scale. Kubernetes whisperer.",
    skills: ["Go", "Rust", "Docker", "AWS", "PostgreSQL"],
    experience: 8,
    hackathons: 5,
    availability: "month",
    goal: "network",
    city: "Cape Town",
    remote: true,
    matchScore: 76,
    avatarColor: "from-amber-400 to-rose-500",
    online: true,
  },
  {
    id: "5",
    name: "Yuki Tanaka",
    username: "yuki",
    role: "Mobile Engineer",
    bio: "Flutter + Swift. Built 3 winning hackathon apps last year.",
    skills: ["Flutter", "Swift", "Firebase", "Figma", "Dart"],
    experience: 5,
    hackathons: 11,
    availability: "weekend",
    goal: "win",
    city: "Tokyo",
    remote: false,
    matchScore: 71,
    avatarColor: "from-rose-400 to-amber-300",
    online: true,
  },
  {
    id: "6",
    name: "Lena Petrova",
    username: "lena",
    role: "Product Designer",
    bio: "Design systems & vibes. Find me sketching at 3am with cold brew.",
    skills: ["Figma", "Framer", "UX Research", "Prototyping"],
    experience: 7,
    hackathons: 6,
    availability: "flexible",
    goal: "learn",
    city: "Lisbon",
    remote: true,
    matchScore: 65,
    avatarColor: "from-emerald-400 to-cyan-500",
    online: false,
  },
];
