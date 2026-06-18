"use client";

import { useEffect, useState } from "react";
import { Github, Code2 } from "lucide-react";
import StatCard from "./StatCard";

export default function CodingStats() {
  const [github, setGithub] = useState<{
    totalContributions: number;
    streak: number;
  } | null>(null);
  const [ghLoading, setGhLoading] = useState(true);

  const [leet, setLeet] = useState<{ totalSolved: number } | null>(null);
  const [leetLoading, setLeetLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/github-stats")
      .then((r) => r.json())
      .then((d) => !cancelled && setGithub(d))
      .catch((e) => console.error(e))
      .finally(() => !cancelled && setGhLoading(false));

    fetch("https://alfa-leetcode-api.onrender.com/keebee/solved")
      .then((r) => r.json())
      .then((d) => !cancelled && setLeet({ totalSolved: d.solvedProblem ?? 39 }))
      .catch(() => !cancelled && setLeet({ totalSolved: 39 }))
      .finally(() => !cancelled && setLeetLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={Github}
        label="GitHub"
        value={
          github ? github.totalContributions.toLocaleString() : null
        }
        sub={github ? `${github.streak} day streak` : undefined}
        loading={ghLoading}
        href="https://github.com/KeEbEe123"
      />
      <StatCard
        icon={Code2}
        label="LeetCode"
        value={leet ? leet.totalSolved : null}
        sub="problems solved"
        loading={leetLoading}
        href="https://leetcode.com/u/keebee/"
      />
    </div>
  );
}
