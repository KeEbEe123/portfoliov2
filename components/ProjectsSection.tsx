"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecryptedText from './DecryptedText';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  name: string;
  description: string;
  images: string[];
}

const projects: Project[] = [
  {
    id: 1,
    name: "Voice AI",
    description: "This project is an AI-assisted chord transposition platform aimed at helping beginner singers find keys that suit their vocal range. Using React and TensorFlow, the application integrates machine learning models through custom APIs to dynamically shift song keys in real time. Supporting over 100 songs, the system simplifies music practice by eliminating manual transposition and showcases the practical application of ML in creative tools with a clean, user-friendly interface",
    images: [
      "/projects/voiceai-1.png",
      "/projects/voiceai-2.jpeg",
      "/projects/voiceai-3.jpeg",
    ]
  },
  {
    id: 2,
    name: "THERE",
    description: "A real-time collaborative coding platform with AI-powered suggestions and live debugging capabilities.",
    images: [
      "/projects/there-1.png",
      "/projects/there-2.png"
    ]
  },
  {
    id: 3,
    name: "HIRE-AI",
    description: "HireAI is an end-to-end AI hiring copilot built with Next.js, Supabase, and large language models to streamline recruitment workflows. It enables natural-language candidate search, automated resume parsing, explainable candidate ranking, interview question generation, and personalized outreach. Designed for scale, the system can process and analyze data from 1,000+ candidates simultaneously, delivering real-time insights and analytics that help recruiters make faster, more informed hiring decisions.",
    images: [
      "/projects/hireAI-1.png",
      "/projects/hireAI-2.png",
      "/projects/hireAI-3.png",
      "/projects/hireAI-4.png"
    ]
  },
  {
    id: 4,
    name: "Suraksha",
    description: "A powerful data visualization and analytics dashboard for processing large-scale datasets.",
    images: [
      "/projects/suraksha-1.png",
      "/projects/suraksha-2.png",
      "/projects/suraksha-3.png",
      "/projects/suraksha-4.png"
    ]
  }
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lastVelocity = useRef(0);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const projects = container.querySelectorAll('.project-card');
    
    // Calculate total scroll distance
    const scrollWidth = container.scrollWidth - window.innerWidth;

    // Create horizontal scroll animation
    const scrollTween = gsap.to(container, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Calculate velocity based on scroll progress change
          const currentProgress = self.progress;
          const velocity = (currentProgress - lastVelocity.current) * 100;
          lastVelocity.current = currentProgress;

          // Get viewport center
          const viewportCenter = window.innerWidth / 2;

          // Apply rotation, scale, and opacity to each project card
          projects.forEach((card) => {
            const cardElement = card as HTMLElement;
            const cardRect = cardElement.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            
            // Calculate distance from viewport center (normalized)
            const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
            const maxDistance = window.innerWidth / 2;
            const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
            
            // Calculate scale and opacity based on distance from center
            const scale = 1 - (normalizedDistance * 0.3); // Scale from 1 to 0.7
            const opacity = 1 - (normalizedDistance * 0.5); // Opacity from 1 to 0.5
            
            // Calculate rotation based on velocity
            const rotateAmount = gsap.utils.clamp(-20, 20, velocity * 50);
            
            gsap.to(cardElement, {
              rotateY: rotateAmount,
              scale: scale,
              opacity: opacity,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        }
      }
    });

    // Reset rotation when leaving the section
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${scrollWidth}`,
      onLeave: () => {
        projects.forEach((card) => {
          gsap.to(card, { rotateY: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" });
        });
      },
      onEnterBack: () => {
        // Reset when scrolling back into section
      }
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #470024 0%, #251101 10%, #251101 100%)'
      }}
    >
      {/* Header */}
      <div className="absolute top-20 left-0 right-0 z-10 flex items-center justify-center px-64">
        <div className="flex-1 h-px" style={{ backgroundColor: '#FFFECB' }}></div>
        <h2 
          className="px-8 text-3xl font-dm-sans"
          style={{ 
            color: '#FFFECB',
            fontFamily: 'PPPlayground-Thin' 
          }}
        >
          Projects
        </h2>
        <div className="flex-1 h-px" style={{ backgroundColor: '#FFFECB' }}></div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={containerRef}
        className="absolute top-0 left-0 h-full flex items-center gap-16 px-32"
        style={{ paddingTop: '200px' }}
      >
        {projects.map((project) => (
          <div 
            key={project.id}
            className="project-card shrink-0 relative flex items-center"
            style={{ 
              width: '90vw',
              height: '60vh',
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Left side - Description */}
            <div 
              className="absolute left-0 top-0 -translate-y-1/2 z-10"
              style={{ width: '55%' }}
            >
              <p 
                className="text-xl leading-relaxed"
                style={{ 
                  fontFamily: 'EditorialNew, serif',
                  color: '#FFFECB'
                }}
              >
                {project.description}
                
              </p>
            </div>

            {/* Project Name - Overlapping the box */}
            <div 
              className="absolute left-20 bottom-0 z-20"
              style={{ width: '100%' }}
            >
              <h3 
                className="text-[160px] leading-none"
                style={{ color: '#FFFECB' }}
              >
                <span style={{ fontFamily: 'PPPlayground-Thin' }}>
                <DecryptedText speed={200} text={project.name.charAt(0)} animateOn="view" sequential={true}/>
                  
                </span>
                <span style={{ fontFamily: 'Thunder-BlackLC, sans-serif' }}>
                <DecryptedText speed={200} text={project.name.slice(1)} animateOn="view" sequential={true}/>

                </span>
              </h3>
            </div>

            {/* Project Image/Screenshot Box - 60% width from right */}
            <div 
              className="absolute right-0 h-full rounded-2xl overflow-hidden group"
              style={{ 
                width: '60%',
                backgroundColor: '#1a1a1a',
                border: '2px solid rgba(255, 254, 203, 0.2)'
              }}
            >
              <Carousel 
                className="w-full h-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
              >
                <CarouselContent className="h-full -ml-0">
                  {project.images.map((image, index) => (
                    <CarouselItem key={index} className="h-full pl-0">
                      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-6">
                        <img
                          src={image}
                          alt={`${project.name} screenshot ${index + 1}`}
                          className="w-full h-full object-contain rounded-lg"
                          style={{ 
                            maxHeight: '100%', 
                            maxWidth: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {/* Navigation Arrows - Only show on hover */}
                <CarouselPrevious 
                  className="left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-3xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 opacity-0 group-hover:opacity-100"
                  style={{ color: '#FFFECB', width: '40px', height: '40px' }}
                />
                <CarouselNext 
                  className="right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-3xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 opacity-0 group-hover:opacity-100"
                  style={{ color: '#FFFECB', width: '40px', height: '40px' }}
                />
              </Carousel>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
