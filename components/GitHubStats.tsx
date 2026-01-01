"use client";

import { useEffect, useRef } from 'react';
import CountUp from './CountUp';
export default function GitHubStats() {
  // Dummy data for now
  const data = {
    totalContributions: 594,
    topLanguages: [
      { name: "TypeScript", icon: "/assets/TypeScript.svg" },
      { name: "JavaScript", icon: "/assets/JavaScript.svg" },
      { name: "HTML", icon: "/assets/HTML5.svg" }
    ]
  };

  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Import Chart.js dynamically
    import('chart.js/auto').then((Chart) => {
      const chart = new Chart.default(ctx, {
        type: 'radar',
        data: {
          labels: ['Commits', 'PRs', 'Issues', 'Reviews', 'Repos', 'Stars'],
          datasets: [{
            label: 'GitHub Activity',
            data: [85, 70, 60, 75, 90, 65],
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
                  size: 6,
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
  }, []);

  return (
    <div 
      className="relative w-full h-full rounded-[20px] overflow-hidden" 
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
          GitHub
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

      {/* Total Contributions */}
      <div className="absolute top-[45px] left-4 z-10">
        <p className="font-bold text-[16px] text-[#fffecb] opacity-50 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Total Contributions
        </p>
        <div className="flex items-baseline mb-6">
          <span className="font-bold text-[48px] text-[#fffecb] -mt-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <CountUp from={0} to={data.totalContributions} direction="up" duration={2} separator="," className="count-up-text"/>
          </span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="absolute top-14 right-1 w-[120px] h-[120px]">
        <canvas ref={chartRef} width="120" height="120"></canvas>
      </div>
      
      {/* Top Languages */}
      <div className="absolute bottom-4 left-4 z-10">
        <p className="font-bold text-[14px] text-[#fffecb] opacity-50 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Top Languages
        </p>
        <div className="flex items-center gap-3">
          {data.topLanguages.map((lang, index) => (
            <div key={index} className="w-8 h-8">
              <img 
                src={lang.icon} 
                alt={lang.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}