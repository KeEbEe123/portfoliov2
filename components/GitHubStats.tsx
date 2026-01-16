"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "./CountUp";

type GitHubData = {
  totalContributions: number;
  streak: number;
  topLanguages: { name: string }[];
  radar: {
    commits: number;
    prs: number;
    issues: number;
    reviews: number;
    repos: number;
    stars: number;
  };
};

const languageIconMap: Record<string, string> = {
  TypeScript: "/assets/TypeScript.svg",
  JavaScript: "/assets/JavaScript.svg",
  HTML: "/assets/HTML5.svg",
  CSS: "/assets/CSS3.svg",
  Python: "/assets/Python.svg",
};

export default function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  /* ---------------------------------
     Fetch GitHub stats
  ---------------------------------- */
  useEffect(() => {
    fetch("/api/github-stats")
      .then((res) => res.json())
      .then((fetchedData) => {
        setData(fetchedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  /* ---------------------------------
     Radar chart
  ---------------------------------- */
  useEffect(() => {
    if (!data || !chartRef.current) return;

    import("chart.js/auto").then((Chart) => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const radarValues = [
        Math.min(data.radar.commits / 50, 100),
        Math.min(data.radar.prs * 10, 100),
        Math.min(data.radar.issues * 10, 100),
        Math.min(data.radar.reviews * 10, 100),
        Math.min(data.radar.repos * 5, 100),
        Math.min(data.radar.stars / 10, 100),
      ];

      chartInstance.current = new Chart.default(
        chartRef.current!.getContext("2d")!,
        {
          type: "radar",
          data: {
            labels: ["Commits", "PRs", "Issues", "Reviews", "Repos", "Stars"],
            datasets: [
              {
                data: radarValues,
                backgroundColor: "rgba(30,181,182,0.2)",
                borderColor: "#1eb5b6",
                borderWidth: 2,
                pointBackgroundColor: "#1eb5b6",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
            scales: {
              r: {
                angleLines: { color: "#444" },
                grid: { color: "#444" },
                pointLabels: {
                  color: "#fffecb",
                  font: {
                    size: 6,
                    family: "DM Sans, sans-serif",
                  },
                },
                ticks: { display: false },
                suggestedMin: 0,
                suggestedMax: 100,
              },
            },
          },
        }
      );
    });

    return () => chartInstance.current?.destroy();
  }, [data]);

  return (
    <div
      className="relative w-full h-full rounded-[20px] overflow-hidden"
      style={{
        backgroundImage: "url(/assets/folder.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header - Always visible */}
      <div className="absolute top-1 left-12">
        <p className="font-bold text-[16px] text-[#fffecb]">GitHub</p>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#fffecb] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Content - Fade in when loaded */}
      {data && (
        <div
          className={`transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Streak */}
          <div className="absolute top-7 right-4">
            <span className="text-[12px] font-bold bg-gradient-to-r from-[#f09f09] to-[#d12128] bg-clip-text text-transparent">
              🔥 {data.streak} day streak
            </span>
          </div>

          {/* Contributions */}
          <div className="absolute top-[45px] left-4">
            <p className="text-[16px] text-[#fffecb] opacity-50 mb-1 font-bold">
              Total Contributions
            </p>
            <span className="text-[48px] font-bold text-[#fffecb] -mt-4 block">
              <CountUp
                from={0}
                to={data.totalContributions}
                duration={1}
                separator=","
                onStart={() => {}}
                onEnd={() => {}}
              />
            </span>
          </div>

          {/* Radar */}
          <div className="absolute top-14 right-1 w-[120px] h-[120px]">
            <canvas ref={chartRef} />
          </div>

          {/* Languages */}
          <div className="absolute bottom-4 left-4">
            <p className="text-[14px] text-[#fffecb] opacity-50 mb-2 font-bold">
              Top Languages
            </p>
            <div className="flex gap-3">
              {data.topLanguages.map((lang) => (
                <img
                  key={lang.name}
                  src={languageIconMap[lang.name]}
                  alt={lang.name}
                  className="w-8 h-8 object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
