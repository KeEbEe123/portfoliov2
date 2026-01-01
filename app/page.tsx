"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SakuraScene from "@/components/SakuraScene";
import SakuraSnowfall from "@/components/SakuraSnowfall";
import DigicamViewer from "@/components/DigicamViewer";
import MixtapePlayer from "@/components/MixtapePlayer";
import CompactLeetCodeStats from "@/components/CompactLeetCodeStats";
import GitHubStats from "@/components/GitHubStats";
import ArtworkDisplay from "@/components/ArtworkDisplay";
import {GitHubCalendar} from 'react-github-calendar';
import ProjectsSection from "@/components/ProjectsSection";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export default function Home() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!smoothWrapperRef.current || !smoothContentRef.current) return;

    const smoother = ScrollSmoother.create({
      wrapper: smoothWrapperRef.current,
      content: smoothContentRef.current,
      smooth: 1.5,
      effects: true,
    });

    // Top bar scroll animation
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
      
      if (topBarRef.current) {
        if (scrollDirection === 'down' && currentScrollY > 100) {
          // Hide top bar when scrolling down
          gsap.to(topBarRef.current, {
            y: -100,
            duration: 0.3,
            ease: "power2.out"
          });
        } else if (scrollDirection === 'up' || currentScrollY <= 100) {
          // Show top bar when scrolling up or near top
          gsap.to(topBarRef.current, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Letter animation setup - use MutationObserver to ensure letters are rendered
    const setupLetterAnimation = () => {
      const letters = document.querySelectorAll('.letter');
      
      console.log('setupLetterAnimation called, found', letters.length, 'letters');
      
      if (letters.length > 0) {
        console.log('Setting up letter animation for', letters.length, 'letters');
        
        // Set initial state - all letters laying flat
        gsap.set(letters, { rotationX: 90 });
        
        // Create scroll-triggered animation for each letter
        letters.forEach((letter, index) => {
          gsap.to(letter, {
            rotationX: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: letter,
              start: "bottom bottom+=200px",
              end: "top center",
              scrub: 1,
              toggleActions: "play none none reverse"
            }
          });
        });
        
        return true; // Animation setup successful
      }
      return false; // Letters not ready yet
    };

    // Try immediate setup
    if (!setupLetterAnimation()) {
      // If letters aren't ready, use MutationObserver
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            if (setupLetterAnimation()) {
              observer.disconnect(); // Stop observing once animation is set up
            }
          }
        });
      });

      // Observe the animated text container
      const textContainer = document.getElementById('animated-text');
      if (textContainer) {
        observer.observe(textContainer, {
          childList: true,
          subtree: true
        });
      } else {
        // Fallback: observe the entire section
        const section = document.querySelector('section[style*="280000"]');
        if (section) {
          observer.observe(section, {
            childList: true,
            subtree: true
          });
        }
      }

      // Fallback timeout with multiple retries
      let retryCount = 0;
      const maxRetries = 5;
      
      const retrySetup = () => {
        if (setupLetterAnimation()) {
          observer.disconnect();
          console.log('Letter animation setup successful on retry', retryCount);
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.log('Retrying letter animation setup, attempt', retryCount);
          setTimeout(retrySetup, 200 * retryCount); // Increasing delay
        } else {
          console.log('Failed to setup letter animation after', maxRetries, 'retries');
          observer.disconnect();
        }
      };
      
      setTimeout(retrySetup, 500);
      setTimeout(retrySetup, 500);  }

    // Grid cells slide-in animation
    const setupGridAnimation = () => {
      const gridCells = document.querySelectorAll('.grid-cell');
      
      if (gridCells.length > 0) {
        console.log('Setting up grid slide animation for', gridCells.length, 'cells');
        
        // Set initial positions - hide cells off-screen
        gridCells.forEach((cell) => {
          const direction = cell.getAttribute('data-direction');
          
          switch (direction) {
            case 'left':
              gsap.set(cell, { x: -300 });
              break;
            case 'right':
              gsap.set(cell, { x: 300 });
              break;
            case 'top':
              gsap.set(cell, { y: -300 });
              break;
            case 'bottom':
              gsap.set(cell, { y: 300 });
              break;
          }
        });
        
        // Animate cells sliding in with stagger
        gsap.to(gridCells, {
          x: 0,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".grid-container",
            start: "top bottom-=150px",
            end: "bottom center",
            toggleActions: "play none none reverse"
          }
        });
        
        return true;
      }
      return false;
    };

    // Setup grid animation with delay
    setTimeout(() => {
      setupGridAnimation();
    }, 200);

    // About Me section letter animation (non-scroll dependent)
    const setupAboutLetterAnimation = () => {
      const aboutLetters = document.querySelectorAll('.about-letter');
      
      if (aboutLetters.length > 0) {
        console.log('Setting up about letter animation for', aboutLetters.length, 'letters');
        
        // Set initial state - all letters laying flat
        gsap.set(aboutLetters, { rotationX: 90 });
        
        // Animate letters standing up with stagger when section comes into view
        gsap.to(aboutLetters, {
          rotationX: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: ".grid-container",
            start: "top bottom-=200px",
            toggleActions: "play none none none" // Play once, don't reverse
          }
        });
        
        return true;
      }
      return false;
    };

    // Setup about letter animation with delay
    setTimeout(() => {
      setupAboutLetterAnimation();
    }, 300);

    return () => {
      smoother.kill();
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

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

      {/* Transparent Top Bar with Logo */}
      <div 
        ref={topBarRef}
        className="fixed top-0 left-0 right-0 z-50 h-20 backdrop-blur-sm border-b border-white/10"
      >
        <div className="flex items-center h-full px-6">
          <div 
            className="group cursor-pointer relative"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img 
              src="/assets/logo.svg" 
              alt="Logo" 
              className="w-26 h-26 relative z-10"
            />
            <img 
              src="/assets/logobg.svg" 
              alt="Logo Background" 
              className="absolute w-26 h-26 top-1 group-hover:left-0 group-hover:top-0 transition-all duration-400 -z-10 brightness-10
              "
            />
          </div>
        </div>
      </div>

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

            {/* Second Section - Text */}
            <section className="snap-section relative w-full min-h-[300vh] flex flex-col items-start justify-start pt-32" style={{ backgroundColor: '#280000' }}>
              {/* Sakura Snowfall Effect */}
              <SakuraSnowfall />
              
              <div className="w-full flex justify-center">
                <div className="text-center relative z-20">
                <h1 
                  id="animated-text"
                  className="leading-none"
                  style={{ 
                    fontFamily: 'Thunder-BlackLC, sans-serif',
                    fontSize: '240px',
                    color: '#FFFECB'
                  }}
                >
                  <span className="block">
                    {"TURNING IDEAS".split('').map((char, index) => (
                      <span 
                        key={`line1-${index}`} 
                        className="inline-block letter" 
                        data-letter={char === ' ' ? 'space' : char}
                        style={{ transformOrigin: 'bottom center' }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </span>
                  <span className="block">
                    {"INTO FAST, SMART,".split('').map((char, index) => (
                      <span 
                        key={`line2-${index}`} 
                        className="inline-block letter" 
                        data-letter={char === ' ' ? 'space' : char}
                        style={{ transformOrigin: 'bottom center' }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </span>
                  <span className="block">
                    {"REAL-WORLD".split('').map((char, index) => (
                      <span 
                        key={`line3-${index}`} 
                        className="inline-block letter" 
                        data-letter={char === ' ' ? 'space' : char}
                        style={{ transformOrigin: 'bottom center' }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </span>
                  <span className="block">
                    {"SOFTWARE".split('').map((char, index) => (
                      <span 
                        key={`line4-${index}`} 
                        className="inline-block letter" 
                        data-letter={char === ' ' ? 'space' : char}
                        style={{ transformOrigin: 'bottom center' }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </span>
                </h1>
              </div>
              </div>

              {/* About Me Section within same container */}
              <div className="w-full relative z-20 mt-8">
                {/* Header with separators */}
                <div className="flex items-center justify-center mb-16 px-64">
                <div className="flex-1 h-px" style={{ backgroundColor: '#FFFECB' }}></div>
                <h2 className="px-8 text-3xl font-dm-sans" style={{ color: '#FFFECB' }}>
                  {"About Me".split('').map((char, index) => (
                    <span 
                      key={`header-${index}`} 
                      className="inline-block about-letter" 
                      data-letter={char === ' ' ? 'space' : char}
                      style={{ transformOrigin: 'bottom center' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h2>
                <div className="flex-1 h-px" style={{ backgroundColor: '#FFFECB' }}></div>
              </div>

              {/* Asymmetric Grid Layout */}
              <div className="max-w-6xl mx-auto px-8">
                <div className="grid grid-cols-5 grid-rows-2 gap-4 h-[80vh] grid-container">
                  
                  {/* Top Left - Paragraph (wider - 3 columns) */}
                  <div className="col-span-3 flex items-center justify-center grid-cell" data-direction="left">
                    <p 
                      className="text-3xl leading-relaxed"
                      style={{ fontFamily: 'EditorialNew, serif', color: '#FFFECB' }}
                    >
                      {"I'm passionate about creating digital experiences that bridge the gap between complex technology and human needs. My work spans full-stack development, AI integration, and real-time systems, always with a focus on building products that are both intelligent and intuitive.".split('').map((char, index) => (
                        <span 
                          key={`para-${index}`} 
                          className="inline-block about-letter" 
                          data-letter={char === ' ' ? 'space' : char}
                          style={{ transformOrigin: 'bottom center' }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </p>
                  </div>

                  {/* Top Right - Digicam Component (2 columns) */}
                  <div className="col-span-2 rounded-lg overflow-hidden flex items-center justify-center grid-cell" data-direction="right">
                    <div className="transform scale-[1.4] origin-center w-full h-full flex items-center justify-center">
                      <DigicamViewer 
                        className="w-[71.4%] h-[71.4%]"
                        style={{ background: 'transparent' }}
                      />
                    </div>
                  </div>

                  {/* Bottom Left - Mixtape Player (2 columns) */}
                  <div className="col-span-2 rounded-lg overflow-hidden flex items-center justify-center grid-cell" data-direction="bottom">
                    <div className="transform scale-[1.1] origin-center w-full h-full flex items-center justify-center">
                      <MixtapePlayer />
                    </div>
                  </div>

                  {/* Bottom Right - Stats and Artwork Grid (3 columns) */}
                  <div className="col-span-3 rounded-lg flex flex-col gap-3 min-h-[400px] grid-cell" data-direction="top">
                    {/* Top row - Stats and Artwork */}
                    <div className="flex gap-3 h-[200px] flex-shrink-0">
                      {/* LeetCode Stats */}
                      <div className="w-[260px] flex-shrink-0">
                        <CompactLeetCodeStats />
                      </div>
                      
                      {/* GitHub Stats */}
                      <div className="w-[260px] flex-shrink-0">
                        <GitHubStats />
                      </div>
                      
                      {/* Artwork Display */}
                      <div className="flex-1 min-w-[220px]">
                        <ArtworkDisplay />
                      </div>
                    </div>
                    
                    {/* Spacer to push calendar down */}
                    
                    {/* GitHub Calendar below the cards */}
                    <div className="min-w-[900px] scale-90 -ml-10 -mt-4">
                        <div className="overflow-x-auto min-w-[600px]">
                          <GitHubCalendar 
                            username="KeEbEe123" 
                            colorScheme="dark"
                            theme={{
                              light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
                            }}
                            style={{
                              color: '#FFFECB'
                            }}
                          />
                        </div>
                    </div>
                  </div>

                </div>
              </div>
              </div>
            </section>

            {/* Third Section - Projects */}
            <ProjectsSection />
        </main>
      </div>
    </div>
    </>
  );
}
