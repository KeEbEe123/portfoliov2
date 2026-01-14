"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    // Letter animation setup for footer text
    const setupFooterAnimation = () => {
      const footerLetters = document.querySelectorAll('.footer-letter');
      
      if (footerLetters.length > 0) {
        // Set initial state - all letters laying flat
        gsap.set(footerLetters, { rotationX: 90 });
        
        // Animate letters standing up with stagger when footer comes into view
        gsap.to(footerLetters, {
          rotationX: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.01,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom-=100px",
            toggleActions: "play none none none"
          }
        });
      }
    };

    // Setup animation with delay
    setTimeout(() => {
      setupFooterAnimation();
    }, 100);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === footerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  const animateText = (text: string, className: string = "footer-letter") => {
    return text.split('').map((char, index) => (
      <span 
        key={`${className}-${index}`} 
        className={`inline-block ${className}`} 
        data-letter={char === ' ' ? 'space' : char}
        style={{ transformOrigin: 'bottom center' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <footer 
      ref={footerRef}
      className="relative w-full py-20"
      style={{ 
        background: 'linear-gradient(to bottom, #251101 0%, #1a0f00 100%)',
        marginTop: '-1px' // Seamless transition from projects section
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header with separators */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex-1 h-px" style={{ backgroundColor: '#FFFECB' }}></div>
          <h2 className="px-8 text-2xl font-dm-sans" style={{ color: '#FFFECB' }}>
            {animateText("Let's Connect")}
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: '#FFFECB' }}></div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 
              className="text-xl font-dm-sans mb-4"
              style={{ color: '#F7B538' }}
            >
              {animateText("Get In Touch")}
            </h3>
            <div className="space-y-3">
              <a 
                href="mailto:keertan.k@gmail.com"
                className="block text-lg hover:text-yellow-400 transition-colors duration-300"
                style={{ fontFamily: 'EditorialNew, serif', color: '#FFFECB' }}
              >
                {animateText("keertan.k@gmail.com")}
              </a>
              <a 
                href="https://www.instagram.com/_.keebee._/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg hover:text-yellow-400 transition-colors duration-300"
                style={{ fontFamily: 'EditorialNew, serif', color: '#FFFECB' }}
              >
                {animateText("Instagram")}
              </a>
              <a 
                href="https://github.com/KeEbEe123"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg hover:text-yellow-400 transition-colors duration-300"
                style={{ fontFamily: 'EditorialNew, serif', color: '#FFFECB' }}
              >
                {animateText("GitHub")}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 
              className="text-xl font-dm-sans mb-4"
              style={{ color: '#F7B538' }}
            >
              {animateText("Quick Links")}
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  const homeSection = document.getElementById('home');
                  if (homeSection) {
                    homeSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block text-lg hover:text-yellow-400 transition-colors duration-300 text-left"
                style={{ fontFamily: 'EditorialNew, serif', color: '#FFFECB' }}
              >
                {animateText("Home")}
              </button>
              <button 
                onClick={() => {
                  const aboutSection = document.getElementById('about-section');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block text-lg hover:text-yellow-400 transition-colors duration-300 text-left"
                style={{ fontFamily: 'EditorialNew, serif', color: '#FFFECB' }}
              >
                {animateText("About")}
              </button>
              <button 
                onClick={() => {
                  const projectsSection = document.getElementById('projects-section');
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block text-lg hover:text-yellow-400 transition-colors duration-300 text-left"
                style={{ fontFamily: 'EditorialNew, serif', color: '#FFFECB' }}
              >
                {animateText("Projects")}
              </button>
              <button 
                onClick={() => {
                  const dumpSection = document.getElementById('dump-section');
                  if (dumpSection) {
                    dumpSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block text-lg hover:text-yellow-400 transition-colors duration-300 text-left"
                style={{ fontFamily: 'EditorialNew, serif', color: '#FFFECB' }}
              >
                {animateText("Dump")}
              </button>
            </div>
          </div>

          {/* Personal Note */}
          <div className="space-y-6">
            <h3 
              className="text-xl font-dm-sans mb-4"
              style={{ color: '#F7B538' }}
            >
              {animateText("Currently")}
            </h3>
            <p 
              className="text-lg leading-relaxed"
              style={{ fontFamily: 'EditorialNew, serif', color: '#FFFECB' }}
            >
              {animateText("Building innovative solutions and exploring the intersection of AI and human-centered design.")}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <p 
              className="text-sm opacity-70"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFECB' }}
            >
              {animateText("© 2026 KeEbEe. All rights reserved.")}
            </p>

            {/* Logo */}
            <div 
              className="group cursor-pointer relative"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img 
                src="/assets/logo.svg" 
                alt="Logo" 
                className="w-16 h-16 relative z-10 opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
              <img 
                src="/assets/logobg.svg" 
                alt="Logo Background" 
                className="absolute w-16 h-16 top-0 left-0 group-hover:scale-110 transition-transform duration-400 -z-10 brightness-50"
              />
            </div>

            {/* Built with */}
            <p 
              className="text-sm opacity-70"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFECB' }}
            >
              {animateText("Built with Next.js & GSAP")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}