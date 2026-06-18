"use client";

import { Sparkles, Zap, Boxes } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import SpotifyNowPlaying from "./widgets/SpotifyNowPlaying";
import CodingStats from "./widgets/CodingStats";
import ArtworkCard from "./widgets/ArtworkCard";

const FOCUS = [
  {
    icon: Boxes,
    title: "Full-stack development",
    desc: "End-to-end web apps — from data models to polished interfaces.",
  },
  {
    icon: Sparkles,
    title: "AI integration",
    desc: "LLMs and ML models wired into real product workflows.",
  },
  {
    icon: Zap,
    title: "Real-time systems",
    desc: "Live, collaborative, low-latency experiences.",
  },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="02 — About" title="About me" />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Bio + focus areas */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  I&apos;m a developer who likes building digital products that
                  bridge the gap between complex technology and real human
                  needs. My work spans{" "}
                  <span className="font-medium text-foreground">
                    full-stack development, AI integration, and real-time
                    systems
                  </span>
                  , always with a focus on shipping things that are both
                  intelligent and intuitive.
                </p>
                <p>
                  Right now I&apos;m apprenticing at{" "}
                  <span className="font-medium text-foreground">DBS Tech</span>,
                  and I write about what I learn on{" "}
                  <a
                    href="https://medium.com/@keertan.k"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Medium
                  </a>
                  . When I&apos;m not shipping code, I draw.
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {FOCUS.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <div className="h-full rounded-xl border border-border bg-card p-4">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 text-sm font-semibold text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Personality widgets */}
          <div className="lg:col-span-2">
            <Reveal delay={0.1}>
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Beyond the résumé
                </p>
                <SpotifyNowPlaying />
                <CodingStats />
                <ArtworkCard />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
