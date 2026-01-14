"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecryptedText from "./DecryptedText";

gsap.registerPlugin(ScrollTrigger);

// Configuration for work dump images and descriptions
const WORK_ITEMS = [
  {
    image: "/dump/dump-1.png",
    description: "Certificate of Appreciation - 2K25 Innovation Challenge",
  },
  {
    image: "/dump/dump-2.png",
    description: "Champion - Sword of the Sea",
  },
  {
    image: "/dump/dump-3.png",
    description: "Samurai Poster Design",
  },
  {
    image: "/dump/dump-4.png",
    description: "Samurai Poster Design",
  },
  {
    image: "/dump/dump-5.png",
    description: "Samurai Poster Design",
  },
];

export default function WorkDump() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const scrollPositionRef = useRef(0);
  const scrollSpeedRef = useRef(1.5); // Current speed
  const targetSpeedRef = useRef(1.5); // Target speed (0 when paused, 1.5 when active)

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!backgroundRef.current || !sectionRef.current) return;

    // Parallax effect for background text
    gsap.to(backgroundRef.current, {
      y: 200,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Auto-scroll carousel effect with easing
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Update target speed based on pause state
    targetSpeedRef.current = isPaused ? 0 : 1.5;

    const scroll = () => {
      if (scrollContainer) {
        // Smoothly interpolate current speed towards target speed
        const easingFactor = 0.05; // Lower = smoother/slower transition
        scrollSpeedRef.current += (targetSpeedRef.current - scrollSpeedRef.current) * easingFactor;
        
        // Update scroll position based on current speed
        scrollPositionRef.current += scrollSpeedRef.current;
        
        // Get the width of one set of images
        const firstChild = scrollContainer.firstElementChild as HTMLElement;
        if (firstChild) {
          const scrollWidth = firstChild.offsetWidth;
          
          // Reset position when we've scrolled past the first set
          if (scrollPositionRef.current >= scrollWidth) {
            scrollPositionRef.current = 0;
          }
          
          scrollContainer.style.transform = `translateX(-${scrollPositionRef.current}px)`;
        }
      }
      
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = (index: number) => {
    console.log("Mouse entered item:", index);
    setHoveredIndex(index);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    console.log("Mouse moving:", e.clientX, e.clientY);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    console.log("Mouse left");
    setHoveredIndex(null);
    setIsPaused(false);
  };

  const TooltipPortal = () => {
    if (!mounted || hoveredIndex === null) return null;

    return createPortal(
      <div
        className="fixed pointer-events-none"
        style={{
          left: `${tooltipPosition.x + 15}px`,
          top: `${tooltipPosition.y + 15}px`,
          zIndex: 999999,
        }}
      >
        <div
          className="px-4 py-2 border-2 border-white rounded shadow-lg"
          style={{
            backgroundColor: "black",
            fontFamily: "DM Sans, sans-serif",
            color: "white",
            fontSize: "14px",
            whiteSpace: "nowrap",
          }}
        >
          <DecryptedText
            key={hoveredIndex}
            text={WORK_ITEMS[hoveredIndex].description}
            speed={20}
            maxIterations={15}
            sequential={true}
            animateOn="view"
            className="text-white"
          />
        </div>
      </div>,
      document.body
    );
  };

  return (
    <section
      id="dump-section"
      ref={sectionRef}
      className="snap-section relative w-full py-32 overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #251101 0%, #470024 15%, #470024 85%, #251101 100%)'
      }}
    >
      {/* Background Text with Parallax */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: 0.5,
          color: "#FFFECB",
          fontSize: "200px",
          fontFamily: 'PPPlayground-Thin',
          fontWeight: "bold",
          zIndex: 20,
        }}
      >
        Work Dump
      </div>

      {/* Image Carousel */}
      <div className="relative z-10 w-full overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-0 items-stretch"
          style={{ willChange: "transform" }}
        >
          {/* First set of images */}
          <div className="flex gap-0 items-stretch flex-shrink-0">
            {WORK_ITEMS.map((item, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 overflow-hidden rounded-2xl relative cursor-pointer"
                style={{ height: "500px" }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={item.image}
                  alt={item.description}
                  className="h-full w-auto object-cover hover:scale-105 transition-transform duration-300 pointer-events-none"
                />
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex gap-0 items-stretch flex-shrink-0">
            {WORK_ITEMS.map((item, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 overflow-hidden rounded-2xl relative cursor-pointer"
                style={{ height: "500px" }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={item.image}
                  alt={item.description}
                  className="h-full w-auto object-cover hover:scale-105 transition-transform duration-300 pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip rendered via portal to document.body */}
      <TooltipPortal />
    </section>
  );
}
