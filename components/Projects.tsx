"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Github, X } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/projects";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  // lock body scroll + escape-to-close while modal is open
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section id="projects" className="scroll-mt-20 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="01 — Work"
          title="Selected projects"
          subtitle="A few things I've built across AI, full-stack, and real-time systems."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.06}>
              <button
                type="button"
                onClick={() => setActive(project)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={project.images[0]}
                    alt={`${project.name} preview`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority={i === 0}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {project.name}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.name} details`}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="overflow-y-auto">
                {/* screenshots */}
                <div className="grid grid-cols-1 gap-2 bg-muted p-2 sm:grid-cols-2">
                  {active.images.map((img, idx) => (
                    <div
                      key={img}
                      className={`relative aspect-video overflow-hidden rounded-lg bg-background ${
                        active.images.length === 1 ? "sm:col-span-2" : ""
                      } ${idx === 0 && active.images.length === 3 ? "sm:col-span-2" : ""}`}
                    >
                      <Image
                        src={img}
                        alt={`${active.name} screenshot ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {active.name}
                  </h3>
                  <p className="mt-1 text-sm text-primary">{active.tagline}</p>

                  {active.highlight && (
                    <p className="mt-4 inline-block rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
                      ★ {active.highlight}
                    </p>
                  )}

                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {active.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {active.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {(active.github || active.live) && (
                    <div className="mt-6 flex gap-3">
                      {active.github && (
                        <a
                          href={active.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                        >
                          <Github className="h-4 w-4" /> Code
                        </a>
                      )}
                      {active.live && (
                        <a
                          href={active.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                        >
                          <ArrowUpRight className="h-4 w-4" /> Live
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
