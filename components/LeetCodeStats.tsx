"use client";

import { useEffect, useState } from "react";

interface Submission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

interface LeetCodeData {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  submissionCalendar: Record<string, number>;
  recentSubmissions: Submission[];
}

export default function LeetCodeStats() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://alfa-leetcode-api.onrender.com/keebee/profile")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch LeetCode stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-[540px] h-[540px] bg-gray-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const activeDays = Object.keys(data.submissionCalendar).length;
  const maxStreak = calculateMaxStreak(data.submissionCalendar);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const easyPct = (data.easySolved / data.totalEasy) * 100;
  const mediumPct = (data.mediumSolved / data.totalMedium) * 100;
  const hardPct = (data.hardSolved / data.totalHard) * 100;

  return (
    <div className="w-[540px] h-[540px] bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
      {/* Radial Progress Section */}
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg className="transform -rotate-90 w-52 h-52">
              <circle cx="104" cy="104" r={radius} stroke="#374151" strokeWidth="10" fill="none" />
              <circle cx="104" cy="104" r={radius} stroke="#00b8a3" strokeWidth="10" fill="none"
                strokeDasharray={`${(easyPct / 100) * circumference * 0.33} ${circumference}`}
                strokeLinecap="round" className="transition-all duration-1000" />
              <circle cx="104" cy="104" r={radius} stroke="#ffc01e" strokeWidth="10" fill="none"
                strokeDasharray={`${(mediumPct / 100) * circumference * 0.33} ${circumference}`}
                strokeDashoffset={-((easyPct / 100) * circumference * 0.33)}
                strokeLinecap="round" className="transition-all duration-1000" />
              <circle cx="104" cy="104" r={radius} stroke="#ef4743" strokeWidth="10" fill="none"
                strokeDasharray={`${(hardPct / 100) * circumference * 0.33} ${circumference}`}
                strokeDashoffset={-(((easyPct + mediumPct) / 100) * circumference * 0.33)}
                strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-white">{data.totalSolved}</div>
              <div className="text-sm text-gray-400">/{data.totalQuestions}</div>
              <div className="text-green-400 flex items-center gap-1 mt-1">
                <span>✓</span>
                <span className="text-sm">Solved</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-[#00b8a3] text-sm font-semibold mb-1">Easy</div>
              <div className="text-white text-xl font-bold">{data.easySolved}/{data.totalEasy}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-[#ffc01e] text-sm font-semibold mb-1">Med.</div>
              <div className="text-white text-xl font-bold">{data.mediumSolved}/{data.totalMedium}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-[#ef4743] text-sm font-semibold mb-1">Hard</div>
              <div className="text-white text-xl font-bold">{data.hardSolved}/{data.totalHard}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-3 bg-gray-800/30 border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-around text-gray-400 text-sm">
          <span>Total active days: <span className="text-white text-6xl font-semibold">{activeDays}</span></span>
          <span>Max streak: <span className="text-white font-semibold">{maxStreak}</span></span>
        </div>
      </div>

      {/* Recently Solved Section */}
      <div className="p-6 flex-1 overflow-hidden flex flex-col">
        <h3 className="text-xl font-bold text-white mb-3">Recently Solved</h3>
        <div className="space-y-2 overflow-y-auto flex-1">
          {data.recentSubmissions.filter((sub) => sub.statusDisplay === "Accepted").slice(0, 5)
            .map((submission, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{submission.title}</div>
                  <div className="text-gray-400 text-xs">{submission.lang}</div>
                </div>
                <div className="text-green-400 text-xs ml-2">✓</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function calculateMaxStreak(calendar: Record<string, number>) {
  const timestamps = Object.keys(calendar).map(Number).sort((a, b) => a - b);
  let maxStreak = 0;
  let currentStreak = 0;
  let lastTimestamp = 0;

  timestamps.forEach((timestamp) => {
    const dayDiff = (timestamp - lastTimestamp) / 86400;
    if (dayDiff === 1 || lastTimestamp === 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (dayDiff > 1) {
      currentStreak = 1;
    }
    lastTimestamp = timestamp;
  });

  return maxStreak;
}
