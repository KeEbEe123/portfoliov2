"use client";
import { useEffect, useRef } from "react";

export default function SakuraSnowfall() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    let mouseX = -1000;
    let mouseY = -1000;
    const mouseRadius = 100;

    // Cache bounds
    let cachedBounds = container.getBoundingClientRect();
    const getBounds = () => ({
      width: cachedBounds.width,
      height: cachedBounds.height,
    });

    class Petal {
      constructor() {
        this.reset(true);
        this.element = document.createElement("img");
        this.element.className = "petal";
        this.element.src = "/assets/petal.svg";
        this.element.alt = "";
        
        // Optimize styles
        Object.assign(this.element.style, {
          position: "absolute",
          transformOrigin: "center",
          pointerEvents: "none",
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          width: "20px",
          height: "20px",
        });
        
        this.lastTransform = "";
        this.lastOpacity = 1;
        
        container.appendChild(this.element);
      }

      reset(initial = false) {
        const { width, height } = getBounds();
        
        // Spawn from top of section
        this.x = Math.random() * width;
        this.y = initial 
          ? Math.random() * height 
          : -50 - Math.random() * 100;
        
        this.size = Math.random() * 0.4 + 0.3;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 3;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.03 + 0.02;
        this.opacity = Math.random() * 0.5 + 0.4;
      }

      update(delta, bounds) {
        const { width, height } = bounds;

        // Calculate mouse influence
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distSq = dx * dx + dy * dy;
        const mouseRadiusSq = mouseRadius * mouseRadius;

        let displaceX = 0;
        let displaceY = 0;

        if (distSq < mouseRadiusSq && distSq > 0) {
          const distance = Math.sqrt(distSq);
          const force = (mouseRadius - distance) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          displaceX = Math.cos(angle) * force * 15;
          displaceY = Math.sin(angle) * force * 15;
        }

        // Update position
        this.y += this.speedY * delta;
        this.swing += this.swingSpeed * delta;
        this.x += (Math.sin(this.swing) * 2 + this.speedX + displaceX * 0.3) * delta;
        this.y += displaceY * 0.2 * delta;
        this.rotation += (this.rotationSpeed + Math.abs(displaceX) * 0.5) * delta;

        // Reset if off screen
        if (this.y > height + 100) {
          this.reset();
          return true;
        }
        
        // Wrap horizontally
        if (this.x > width + 100) this.x = -100;
        else if (this.x < -100) this.x = width + 100;

        // Update DOM
        const x = Math.round(this.x * 10) / 10;
        const y = Math.round(this.y * 10) / 10;
        const rot = Math.round(this.rotation * 10) / 10;
        
        const transform = `translate3d(${x}px,${y}px,0)rotate(${rot}deg)scale(${this.size})`;
        
        if (transform !== this.lastTransform) {
          this.element.style.transform = transform;
          this.lastTransform = transform;
        }
        
        if (Math.abs(this.opacity - this.lastOpacity) > 0.01) {
          this.element.style.opacity = this.opacity;
          this.lastOpacity = this.opacity;
        }

        return true;
      }

      remove() {
        this.element?.remove();
      }
    }

    const petals = [];
    
    // Create initial petals
    const petalCount = 80;
    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    let lastTime = performance.now();
    let rafId;

    const animate = (time) => {
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;
      
      const bounds = getBounds();
      
      // Update all petals
      petals.forEach(petal => petal.update(delta, bounds));
      
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const handleMouseMove = (e) => {
      // Get the section bounds for proper coordinate conversion
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      cachedBounds = container.getBoundingClientRect();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      petals.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ overflow: "hidden" }}
    />
  );
}