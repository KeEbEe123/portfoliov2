"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

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
  const cardRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!cardRef.current || loading) return;

    const card = cardRef.current;
    const frontFace = card.querySelector('.front-face') as HTMLElement;
    const backFace = card.querySelector('.back-face') as HTMLElement;

    // Set initial state - start with back side showing (180deg)
    gsap.set(card, {
      rotationY: 180,
      opacity: 0,
    });

    // Create scroll trigger animation
    ScrollTrigger.create({
      trigger: card,
      start: "top 80%",
      onEnter: () => {
        // Create a timeline for the animation sequence
        const tl = gsap.timeline();
        
        // First fade in the back side (logo)
        tl.to(card, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        // Hold for 1 second
        .to(card, {
          duration: 1,
        })
        // Then flip to front side (stats)
        .to(card, {
          rotationY: 0,
          duration: 0.8,
          ease: "power3.out",
          onStart: () => {
            // Fade out back, fade in front during flip
            gsap.to(backFace, { opacity: 0, duration: 0.4 });
            gsap.to(frontFace, { opacity: 1, duration: 0.4, delay: 0.4 });
          },
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === card) {
          trigger.kill();
        }
      });
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="w-[430px] h-[580px] bg-[#282c2e] rounded-[20px] flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-16 h-16 animate-pulse"
        >
          <path fill="#B3B1B0" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"></path>
          <path fill="#E7A41F" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"></path>
          <path fill="#070706" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"></path>
        </svg>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const recentAccepted = data.recentSubmissions
    .filter((sub) => sub.statusDisplay === "Accepted")
    .slice(0, 2);

  const formatTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  return (
    <div 
      ref={cardRef}
      className="relative w-[430px] h-[580px]"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* Front of card */}
      <div 
        className="front-face absolute inset-0 bg-[#282c2e] rounded-[20px] p-[15px] opacity-0"
        style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
      >
        {/* Total Solved Header */}
        <p className="font-bold text-[32px] text-white mb-2 font-figtree">
          Total Solved
        </p>

        {/* Large Number */}
        <p className="font-bold leading-none mb-6 font-figtree">
          <span className="text-white text-[200px]">{data.totalSolved}</span>
          <span className="text-white text-[32px]">/{data.totalQuestions}</span>
        </p>

        {/* Difficulty Progress Bars */}
        <div className="flex items-center gap-3 mb-8">
          {/* Easy Progress Bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-[12px] text-[#1eb5b6]">Easy</p>
              <p className="font-bold text-[12px] text-[#1eb5b6]">{data.easySolved}</p>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1eb5b6] transition-all duration-1000"
                style={{ width: `${(data.easySolved / data.totalEasy) * 100}%` }}
              />
            </div>
          </div>

          {/* Medium Progress Bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-[12px] text-[#f4b307]">Medium</p>
              <p className="font-bold text-[12px] text-[#f4b307]">{data.mediumSolved}</p>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#f4b307] transition-all duration-1000"
                style={{ width: `${(data.mediumSolved / data.totalMedium) * 100}%` }}
              />
            </div>
          </div>

          {/* Hard Progress Bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-[12px] text-[#dd393a]">Hard</p>
              <p className="font-bold text-[12px] text-[#dd393a]">{data.hardSolved}</p>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#dd393a] transition-all duration-1000"
                style={{ width: `${(data.hardSolved / data.totalHard) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recently Solved Section */}
        <p className="font-bold text-[32px] text-white underline decoration-solid mb-6 font-figtree">
          Recently Solved
        </p>

        {/* Recent Submissions */}
        <div className="space-y-4">
          {recentAccepted.map((submission, idx) => (
            <div key={idx}>
              <p className="font-bold text-[24px] text-white leading-tight font-figtree">
                {submission.title}
              </p>
              <p className="font-normal text-[16px] text-white mt-1 font-figtree">
                {submission.lang.toUpperCase()} | {formatTime(submission.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Back of card */}
      <div 
        className="back-face absolute inset-0 bg-[#282c2e] rounded-[20px] flex items-center justify-center opacity-100"
        style={{ 
          backfaceVisibility: "hidden", 
          transform: "rotateY(180deg)",
          transformStyle: "preserve-3d"
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-16 h-16"
        >
          <path fill="#B3B1B0" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"></path>
          <path fill="#E7A41F" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"></path>
          <path fill="#070706" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"></path>
        </svg>
      </div>
    </div>
  );
}
