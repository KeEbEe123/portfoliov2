import { ArrowUpRight, FileText, Mail } from "lucide-react";
import Reveal from "./Reveal";
import { SOCIALS, EMAIL, RESUME_URL } from "@/lib/socials";

export default function Contact() {
  return (
    <footer
      id="contact"
      className="scroll-mt-20 border-t border-border py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            06 — Contact
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Let&apos;s build something together.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            I&apos;m open to internships, roles, and interesting collaborations.
            The fastest way to reach me is email.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Mail className="h-4 w-4" />
              {EMAIL}
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>
          </div>
        </Reveal>

        {/* Socials */}
        <Reveal delay={0.1}>
          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SOCIALS.map(({ label, href, icon: Icon, handle }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {handle}
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            ))}
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 Keertan Kuppili. All rights reserved.</p>
          <p className="font-mono text-xs">Built with Next.js & Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
