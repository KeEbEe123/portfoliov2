export type SkillGroup = { title: string; items: string[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "HTML", "CSS", "SQL"],
  },
  {
    title: "Frameworks",
    items: ["React", "Next.js", "Node.js", "Tailwind CSS"],
  },
  {
    title: "AI / ML",
    items: ["LLMs", "TensorFlow", "Prompt engineering", "RAG"],
  },
  {
    title: "Tools & Cloud",
    items: ["Supabase", "PostgreSQL", "Git", "WebSockets", "Three.js", "GSAP"],
  },
];
