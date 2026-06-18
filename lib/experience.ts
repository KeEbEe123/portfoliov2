export type TimelineItem = {
  kind: "role" | "achievement";
  title: string;
  org: string;
  period: string;
  current?: boolean;
  description: string;
};

/**
 * Edit these entries with your real details.
 * The two roles use placeholders where you haven't given specifics yet —
 * just swap the TODO text.
 */
export const TIMELINE: TimelineItem[] = [
  {
    kind: "role",
    title: "Apprentice", // TODO: your exact role title at DBS Tech
    org: "DBS Tech",
    period: "Jun 2026 — Present",
    current: true,
    description:
      "Apprenticing as a software developer — building on real-world engineering projects.", // TODO: one line on what you do
  },
  {
    kind: "role",
    title: "Software Intern", // TODO: actual role title
    org: "Skilltag",
    period: "Jul — Aug 2025",
    description:
      "One-month software internship.", // TODO: one line on what you did
  },
];
