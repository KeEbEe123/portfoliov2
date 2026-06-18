"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music } from "lucide-react";

type Recent = {
  trackName: string;
  artistName: string;
  imageUrl?: string;
  trackUrl?: string;
};

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<Recent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/spotify/recent", { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const j = await res.json();
        if (!cancelled) setData(j);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    data?.trackUrl ? (
      <a
        href={data.trackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </a>
    ) : (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
        {children}
      </div>
    );

  return (
    <Wrapper>
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
        {data?.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.trackName ?? "Album art"}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
          Last played
        </p>
        {loading ? (
          <div className="mt-1 space-y-1.5">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <>
            <p className="truncate text-sm font-semibold text-foreground">
              {data?.trackName ?? "Nothing right now"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {data?.artistName ?? "—"}
            </p>
          </>
        )}
      </div>
    </Wrapper>
  );
}
