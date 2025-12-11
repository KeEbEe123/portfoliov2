"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current || !leavesRef.current || !contentRef.current) return;

    const navItems = contentRef.current.querySelectorAll(".nav-item");

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

    const leaves: HTMLDivElement[] = [];
    const leafCount = 30;

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
        left: "0%",
        top: "50%",
        textShadow: "0 0 3px rgba(255,255,255,0.8)",
      });

      leavesRef.current.appendChild(leaf);
      leaves.push(leaf);

      gsap.set(leaf, {
        scale: 1,
        rotation: Math.random() * 360,
        xPercent: -50,
        yPercent: -50,
        x: Math.random() * 100 - 50,
        y: Math.random() * 40 - 20,
        opacity: 0,
      });
    }

    const tl = gsap.timeline({ delay: 0.5 });

    leaves.forEach((leaf, i) => {
      tl.to(
        leaf,
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.in",
        },
        i * 0.02
      )
        .to(
          leaf,
          {
            x: `+=${window.innerWidth}`,
            y: `+=${gsap.utils.random(-50, 50)}`,
            rotation: `+=${gsap.utils.random(360, 720)}`,
            duration: 1.5,
            ease: "power2.out",
          },
          i * 0.02 + 0.1
        )
        .to(
          leaf,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          i * 0.02 + 1.2
        );
    });

    tl.fromTo(
      navItems,
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      },
      0.5
    );

    return () => {
      leaves.forEach((leaf) => leaf.remove());
    };
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm">
      <style jsx>{`
        @font-face {
          font-family: 'Thunder';
          src: url('/Thunder-ExtraBoldLC.ttf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
      <div ref={leavesRef} className="absolute inset-0 pointer-events-none overflow-hidden" />
      <div ref={contentRef} className="relative flex items-center justify-between px-8 py-4">
        <div className="nav-item opacity-0">
          <img
            src="/assets/logo.svg"
            alt="Keertan Kuppili"
            className="w-[100px] h-auto object-contain"
          />
        </div>
        <div className="flex gap-8">
          <button className="nav-item opacity-0 text-[#ff34b8ff] hover:text-[#ff34b8cc] transition-colors text-6xl font-medium" style={{ fontFamily: 'Thunder, sans-serif' }}>
            Projects
          </button>
          <button className="nav-item opacity-0 text-[#ff34b8ff] hover:text-[#ff34b8cc] transition-colors text-6xl font-medium" style={{ fontFamily: 'Thunder, sans-serif' }}>
            Stats
          </button>
          <button className="nav-item opacity-0 text-[#ff34b8ff] hover:text-[#ff34b8cc] transition-colors text-6xl font-medium" style={{ fontFamily: 'Thunder, sans-serif' }}>
            About
          </button>
          <button className="nav-item opacity-0 text-[#ff34b8ff] hover:text-[#ff34b8cc] transition-colors text-6xl font-medium" style={{ fontFamily: 'Thunder, sans-serif' }}>
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
