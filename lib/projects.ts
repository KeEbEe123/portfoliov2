export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  images: string[];
  /** optional external links */
  github?: string;
  live?: string;
  highlight?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "hire-ai",
    name: "HireAI",
    tagline: "End-to-end AI hiring copilot",
    description:
      "HireAI is an end-to-end AI hiring copilot built with Next.js, Supabase, and large language models to streamline recruitment workflows. It enables natural-language candidate search, automated resume parsing, explainable candidate ranking, interview question generation, and personalized outreach. Designed for scale, the system can process and analyze data from 1,000+ candidates simultaneously, delivering real-time insights and analytics that help recruiters make faster, more informed hiring decisions.",
    tech: ["Next.js", "Supabase", "LLMs", "TypeScript", "PostgreSQL"],
    images: [
      "/projects/hireAI-1.png",
      "/projects/hireAI-2.png",
      "/projects/hireAI-3.png",
      "/projects/hireAI-4.png",
    ],
    highlight: "Analyzes 1,000+ candidates simultaneously",
  },
  {
    id: "voice-ai",
    name: "Voice AI",
    tagline: "AI chord transposition for singers",
    description:
      "An AI-assisted chord transposition platform that helps beginner singers find keys that suit their vocal range. Built with React and TensorFlow, it integrates machine learning models through custom APIs to dynamically shift song keys in real time. Supporting over 100 songs, the system removes manual transposition and showcases the practical application of ML in creative tools through a clean, user-friendly interface.",
    tech: ["React", "TensorFlow", "Python", "REST APIs"],
    images: [
      "/projects/voiceai-1.png",
      "/projects/voiceai-2.jpeg",
      "/projects/voiceai-3.jpeg",
    ],
    highlight: "Real-time key shifting across 100+ songs",
  },
  {
    id: "there",
    name: "THERE",
    tagline: "Real-time collaborative coding",
    description:
      "A real-time collaborative coding platform with AI-powered suggestions and live debugging capabilities, letting multiple developers write, run, and debug code together in a shared session.",
    tech: ["React", "WebSockets", "Node.js", "AI"],
    images: ["/projects/there-1.png", "/projects/there-2.png"],
    highlight: "Live multiplayer editing + AI assist",
  },
  {
    id: "suraksha",
    name: "Suraksha",
    tagline: "Large-scale analytics dashboard",
    description:
      "A powerful data visualization and analytics dashboard for processing large-scale datasets, turning raw data into clear, actionable insights through interactive charts and views.",
    tech: ["React", "Data Viz", "Charts", "TypeScript"],
    images: [
      "/projects/suraksha-1.png",
      "/projects/suraksha-2.png",
      "/projects/suraksha-3.png",
      "/projects/suraksha-4.png",
    ],
    highlight: "Built for large-scale data processing",
  },
];
