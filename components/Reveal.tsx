"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** translate distance in px */
  y?: number;
};

/**
 * Lightweight scroll-reveal. Animates once on enter; framer-motion + the global
 * prefers-reduced-motion CSS rule keep it accessible (motion also respects the
 * media query internally).
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
