import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { SKILL_GROUPS } from "@/lib/skills";

export default function Skills() {
  return (
    <section
      id="skills"
      className="scroll-mt-20 border-y border-border bg-card/30 py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="03 — Stack"
          title="Skills & tools"
          subtitle="The technologies I reach for most often."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_GROUPS.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-5">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  {group.title}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-border px-2.5 py-1.5 text-sm text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
