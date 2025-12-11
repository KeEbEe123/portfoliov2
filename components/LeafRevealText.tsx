"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LeafRevealTextProps {
  text: string;
}

export default function LeafRevealText({ text }: LeafRevealTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!leavesRef.current || !textRef.current || !containerRef.current) return;

    const chars = textRef.current.querySelectorAll(".char");
    const textWidth = textRef.current.getBoundingClientRect().width;
    
    // Calculate travel distance based on text width
    const travelDistance = textWidth + 400;

    const asciiPetal = `                                                                                                               
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
               ###%%%                                                                               
              *===-------------==*#                                                                 
              +=----------------::::-=+*                                                            
              +---------------:::::::-----=+                                                        
              +=---------------:::::::::::---=++                                                    
              +==---------------::::::::::::::-===+                                                 
              +==----------------:::::::::::::::::-**                                               
              +==-:::::------------:::::::::::::::::::-#                                            
              +==-:::::::-----------::::::::::::::::::::--=+                                        
              +==-::::::::::----------:::::::::::::::::::::::--=                                    
              +=--:::::::::::::---------:::::::::::::::::::::::--=                                  
              +---:::::::::::::::---------:::::::::::::::::::::::-++                                
              +---::::::::::::::::::--------::::::::::::::::::::::--#                               
              +---:::::::::::::::::::::-------:::::::::::::::::::::-==+                             
              +==-:::::::::::::::::::::::-------:::::::::::::::::::::-=*                            
               +=-:::::::::::::::::::::::::-------::::::::::::::::::::--=                           
                +::::::::::::::::::::::::::::------:::::::::::::::::::::--=                         
                +--:::::::::::::::::::::::::::------:::::::::::::::::::::-=#                        
                 **-::::::::::::::::::::::::::::----::::::::::::::::::::::-++                       
                   =--::::::::::::::::::::::::::::::::::::::::::::::::::::::-                       
                   ++--:::::::::::::::::::::::::::::::::::::::::::::::::::::-**                     
                     ==--::::::::::::::::::::::::::::::::::::::::::::::::::::--                     
                       =----::::::::::::::::::::::::::::::::::::::::::::::::::-%                    
                         +=---::::::::::::::::::::::::::::::::::::::::::::::::-++                   
                           *+=--:::::::::::::::::::::::::::::::::::::::::::::::-=*                  
                              **=--:::::::::::::::::::::::::::::::::::::::::::::-+                  
                                *+==--------::::::::::::::::::::::::::::::::::::-+*                 
                                  +====------------:::::::::::::::::::::::::::::-==*                
                                     ++====----------------::::::::::::::::::::::-=+                
                                         ++=--------------------::::::::::::::::::-+*               
                                             ++=-------------------:::::::::::::::-==+              
                                                 *+=-----------------:::::::::::::::-=+             
                                                     %++=--------------::::::::::::::-==            
                                                       *++++=--------------::::::::::::=**          
                                                           *+====------------:::::::::::--          
                                                                *===--=---------:::::::::-**        
                                                                     *+==---------:::::::--=#       
                                                                           *++=---------::--++      
                                                                                  ##+===---===      
                                                                                      ******#       
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    `;

    // Create multiple petals
    const leaves: HTMLDivElement[] = [];
    const leafCount = 80;

    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement("div");
      leaf.textContent = asciiPetal;

      Object.assign(leaf.style, {
        position: "absolute",
        whiteSpace: "pre",
        color: "#ff34b8ff",
        fontSize: "1px",
        lineHeight: "0.8",
        fontFamily: "monospace",
        pointerEvents: "none",
        left: "-75%",
        top: "50%",
        textShadow: "0 0 3px rgba(255,255,255,0.8)",
      });

      leavesRef.current.appendChild(leaf);
      leaves.push(leaf);

      // Set initial GSAP properties
      gsap.set(leaf, {
        scale: 1,
        rotation: Math.random() * 360,
        xPercent: -50,
        yPercent: -50,
        x: Math.random() * 200 - 100,
        y: Math.random() * 80 - 40,
        opacity: 0,
      });
    }

    // Create master timeline with scroll trigger
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        once: true,
      },
    });

    // Animate leaves blowing away from left to right with opacity fade in/out
    leaves.forEach((leaf, i) => {
      const xDistance = gsap.utils.random(travelDistance * 0.8, travelDistance * 1.2);
      const yDistance = gsap.utils.random(-150, 150);
      const rotationAmount = gsap.utils.random(360, 720);

      masterTimeline
        .to(leaf, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.in",
        }, i * 0.03)
        .to(
          leaf,
          {
            x: `+=${xDistance}`,
            y: `+=${yDistance}`,
            rotation: `+=${rotationAmount}`,
            duration: 2,
            ease: "power2.out",
          },
          i * 0.03 + 0.1
        )
        .to(
          leaf,
          {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          i * 0.03 + 1.5
        );
    });

    // Reveal text as leaves blow away
    masterTimeline.fromTo(
      chars,
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      },
      0.5
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
      leaves.forEach((leaf) => leaf.remove());
    };
  }, [text]);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center">
      <style jsx>{`
        @font-face {
          font-family: 'PPPlayground';
          src: url('/PPPlayground-Thin.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
      <div
        ref={leavesRef}
        className="absolute inset-0 pointer-events-none z-10"
      />
      <div ref={textRef} className="text-[100px] font-bold text-[#ff34b8ff] relative z-0" style={{ fontFamily: 'PPPlayground, sans-serif' }}>
        {text.split("").map((char, i) => (
          <span key={i} className="char inline-block opacity-0">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}
