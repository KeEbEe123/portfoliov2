import { Briefcase, Trophy } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { TIMELINE } from "@/lib/experience";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="04 — Journey"
          title="Experience"
          subtitle="Roles, internships, and a few wins along the way."
        />

        <div className="mt-12 max-w-3xl">
          <ol className="relative border-l border-border">
            {TIMELINE.map((item, i) => {
              const Icon = item.kind === "achievement" ? Trophy : Briefcase;
              return (
                <li key={`${item.title}-${i}`} className="mb-9 ml-8 last:mb-0">
                  <Reveal delay={i * 0.05}>
                    <span className="absolute -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card">
                      <Icon className="h-4 w-4 text-primary" />
                    </span>
                    <div className="rounded-xl border border-border bg-card p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        {item.current && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-primary">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        <span className="text-foreground">{item.org}</span>
                        <span className="mx-2 text-border">•</span>
                        <span className="font-mono text-xs">{item.period}</span>
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
