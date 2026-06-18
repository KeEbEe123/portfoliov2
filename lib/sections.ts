export type Section = { id: string; label: string };

/** Single source of truth for nav anchors + scroll-spy. Order = scroll order. */
export const SECTIONS: Section[] = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
