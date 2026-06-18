"use client";

import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | number | null;
  sub?: string;
  loading?: boolean;
  href?: string;
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  loading,
  href,
}: Props) {
  const inner = (
    <>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="font-mono text-[11px] uppercase tracking-wider">
          {label}
        </span>
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-20 animate-pulse rounded bg-muted" />
      ) : (
        <p className="mt-2 font-display text-3xl font-bold text-foreground">
          {value ?? "—"}
        </p>
      )}
      {sub && !loading && (
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      )}
    </>
  );

  const cls =
    "flex flex-col rounded-xl border border-border bg-card p-4 transition-colors";

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
    >
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
