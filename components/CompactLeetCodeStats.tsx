"use client";

import { useEffect, useState, useRef } from "react";
import CountUp from './CountUp'

interface LeetCodeData {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export default function CompactLeetCodeStats() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("https://alfa-leetcode-api.onrender.com/keebee/profile")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch LeetCode stats:", err);
        // Use dummy data on error
        setData({
          totalSolved: 39,
          totalQuestions: 3786,
          easySolved: 37,
          mediumSolved: 2,
          hardSolved: 0,
        });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Import Chart.js dynamically
    import('chart.js/auto').then((Chart) => {
      const chart = new Chart.default(ctx, {
        type: 'radar',
        data: {
          labels: ['Easy', 'Medium', 'Hard'],
          datasets: [{
            label: 'LeetCode Skills',
            data: [
              Math.min((data.easySolved / 50) * 100, 100), // Easy problems (normalized to 50)
              Math.min((data.mediumSolved / 30) * 100, 100), // Medium problems (normalized to 30)
              Math.min((data.hardSolved / 10) * 100, 100), // Hard problems (normalized to 10)
            ],
            backgroundColor: 'rgba(30, 181, 182, 0.2)',
            borderColor: '#1eb5b6',
            borderWidth: 2,
            pointBackgroundColor: '#1eb5b6',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#1eb5b6',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            r: {
              angleLines: {
                color: '#444',
              },
              grid: {
                color: '#444',
              },
              pointLabels: {
                display: true,
                color: '#fffecb',
                font: {
                  size: 8,
                  family: 'DM Sans, sans-serif'
                }
              },
              ticks: {
                display: false,
              },
              suggestedMin: 0,
              suggestedMax: 100,
            },
          },
        }
      });

      return () => {
        chart.destroy();
      };
    });
  }, [data]);

  if (loading) {
    return (
      <div 
        className="relative w-full h-full rounded-4xl overflow-hidden" 
        style={{ 
          backgroundImage: 'url(/assets/folder.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-[#fffecb]">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div 
      className="relative w-full h-full rounded-4xl overflow-hidden" 
      style={{ 
        backgroundImage: 'url(/assets/folder.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header */}
      <div className="absolute top-1 left-12 z-10">
        <p className="font-bold text-[16px] text-[#fffecb]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          LeetCode
        </p>
      </div>

      {/* Streak Badge */}
      <div className="absolute top-7 right-4 z-10">
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-bold bg-gradient-to-r from-[#f09f09] to-[#d12128] bg-clip-text text-transparent">
            🔥 3 day streak
          </span>
        </div>
      </div>

      {/* Total Solved */}
      <div className="absolute top-[45px] left-4 z-10">
        <p className="font-bold text-[16px] text-[#fffecb] opacity-50 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Total Solved
        </p>
        <div className="flex items-baseline">
          <span className="font-bold text-[48px] text-[#fffecb] -mt-4" style={{ fontFamily: 'DM Sans, sans-serif' }} >
            <CountUp from={0} to={data.totalSolved} direction="up" duration={2} separator="," className="count-up-text"/>
          </span>
          <span className="font-bold text-[16px] text-[#fffecb]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            /{data.totalQuestions}
          </span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="absolute top-14 right-1 w-[140px] h-[140px]">
        <canvas ref={chartRef} width="140" height="140"></canvas>
      </div>

      {/* Difficulty Stats */}
      <div className="absolute bottom-4 left-4 z-10 space-y-0">
        <p className="text-[14px] font-bold text-[#1eb5b6]" style={{ fontFamily: 'Figtree, sans-serif' }}>
          Easy: <CountUp from={0} to={data.easySolved} direction="up" duration={1} separator="," className="count-up-text"/>

        </p>
        <p className="text-[14px] font-bold text-[#f4b307]" style={{ fontFamily: 'Figtree, sans-serif' }}>
          Medium: <CountUp from={0} to={data.mediumSolved} direction="up" duration={1} separator="," className="count-up-text"/>
        </p>
        <p className="text-[14px] font-bold text-[#822222]" style={{ fontFamily: 'Figtree, sans-serif' }}>
          Hard: <CountUp from={0} to={data.hardSolved} direction="up" duration={1} separator="," className="count-up-text"/>
        </p>
      </div>
    </div>
  );
}