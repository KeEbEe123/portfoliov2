"use client";

import { Instagram } from "lucide-react";

export default function ArtworkCard() {
  return (
    <a
      href="https://www.instagram.com/_.keebee._/"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/spidermanDrawing.png"
        alt="A drawing by Keertan"
        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
        <span className="text-sm font-semibold text-white">I draw too</span>
        <span className="inline-flex items-center gap-1.5 text-xs text-white/90">
          <Instagram className="h-3.5 w-3.5" />
          keebee._
        </span>
      </div>
    </a>
  );
}
