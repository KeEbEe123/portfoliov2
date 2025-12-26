"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GitHubCalendar } from "react-github-calendar";
import SakuraScene from "@/components/SakuraScene";
import LeafRevealText from "@/components/LeafRevealText";
import LeetCodeStats from "@/components/LeetCodeStats";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export default function Home() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const statisticsRef = useRef<HTMLElement>(null);
  const [contributionCount, setContributionCount] = useState<string>("");
  const contributionDataRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!smoothWrapperRef.current || !smoothContentRef.current) return;

    const smoother = ScrollSmoother.create({
      wrapper: smoothWrapperRef.current,
      content: smoothContentRef.current,
      smooth: 1.5,
      effects: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  useEffect(() => {
    if (contributionDataRef.current) {
      const totalCount = contributionDataRef.current.reduce((sum: number, day: any) => sum + day.count, 0);
      setContributionCount(`${totalCount} contributions this year`);
    }
  }, [contributionDataRef.current]);

  return (
    <>
      {/* Loading Bar */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
          <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-pink-500 animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      )}

      <div ref={smoothWrapperRef} id="smooth-wrapper" className="fixed inset-0 overflow-hidden">
        <div ref={smoothContentRef} id="smooth-content">
          <main className="relative w-full">
            {/* First Section - Sakura Scene */}
            <section className="snap-section relative w-full h-screen">
              <SakuraScene onLoaded={() => {
                console.log('onLoaded callback triggered');
                setIsLoading(false);
              }} />
            </section>

          {/* Second Section - Statistics */}
          <section ref={statisticsRef} className="snap-section relative w-full min-h-screen bg-gray-900 flex flex-col items-start pt-5 pl-5">
            <LeafRevealText text="Statistics" />
            <div className="mt-4 w-full px-20 mr-10 flex justify-end">
              <div className="scale-120 origin-center">
                <GitHubCalendar 
                  username="KeEbEe123"
                  colorScheme="dark"
                  theme={{
                    dark: ['#1a1a1a', '#ff34b833', '#ff34b866', '#ff34b8cc', '#ff34b8ff'],
                  }}
                  transformData={(data) => {
                    contributionDataRef.current = data;
                    return data;
                  }}
                  showTotalCount={false}
                  showColorLegend={false}
                />
              </div>
            </div>
            <div className="mt-8 w-full px-10 flex justify-end mb-8">
              <LeetCodeStats />
            </div>
          </section>
        </main>
      </div>
    </div>
    </>
  );
}
