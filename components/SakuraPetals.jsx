"use client";
import { useEffect, useRef } from "react";

export default function SakuraPetals() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }



    let mouseX = -1000;
    let mouseY = -1000;
    const mouseRadius = 150;

    // Cache bounds - only recalculate on resize
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
        
        // Optimize styles - set once
        Object.assign(this.element.style, {
          position: "absolute",
          transformOrigin: "center",
          pointerEvents: "none",
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          width: "30px",
          height: "30px",
        });
        
        // Cache transform string parts to reduce string concatenation
        this.lastTransform = "";
        this.lastOpacity = 1;
        
        container.appendChild(this.element);
      }

      reset(initial = false) {
        const { width, height } = getBounds();
        const startY = height * 0.3; // Start at 30% from top
        this.x = Math.random() * Math.max(100, width);
        this.y = initial
          ? startY + Math.random() * (height - startY)
          : startY - 100 - Math.random() * 300;
        this.size = Math.random() * 0.35 + 0.25;
        this.speedY = Math.random() * 0.9 + 0.6;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.5;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.02 + 0.015;
        this.opacity = Math.random() * 0.5 + 0.5;
      }

      update(delta, bounds) {
        const { width, height } = bounds;

        // Calculate mouse influence only if mouse is in reasonable range
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
          displaceX = Math.cos(angle) * force * 25;
          displaceY = Math.sin(angle) * force * 25;
        }

        this.y += this.speedY * delta;
        this.swing += this.swingSpeed * delta;
        this.x += (Math.sin(this.swing) * 1.2 + this.speedX + displaceX * 0.4) * delta;
        this.y += displaceY * 0.25 * delta;
        this.rotation += (this.rotationSpeed + Math.abs(displaceX) * 1.2) * delta;

        if (this.y > height + 200) this.reset();
        if (this.x > width + 200) this.x = -200;
        else if (this.x < -200) this.x = width + 200;

        // Round values to reduce sub-pixel rendering
        const x = Math.round(this.x * 10) / 10;
        const y = Math.round(this.y * 10) / 10;
        const rot = Math.round(this.rotation * 10) / 10;
        
        const transform = `translate3d(${x}px,${y}px,0)rotate(${rot}deg)scale(${this.size})`;
        
        // Only update DOM if values changed significantly
        if (transform !== this.lastTransform) {
          this.element.style.transform = transform;
          this.lastTransform = transform;
        }
        
        if (Math.abs(this.opacity - this.lastOpacity) > 0.01) {
          this.element.style.opacity = this.opacity;
          this.lastOpacity = this.opacity;
        }
      }

      remove() {
        this.element?.remove();
      }
    }

    const petals = [];
    const count = 180;
    for (let i = 0; i < count; i++) {
      const petal = new Petal();
      petal.y = Math.random() < 0.8 ? Math.random() * getBounds().height : -Math.random() * 200;
      petals.push(petal);
    }

    let lastTime = performance.now();
    let rafId;
    let frameCount = 0;

    const animate = (time) => {
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;
      frameCount++;
      
      // Cache bounds once per frame instead of per petal
      const bounds = getBounds();
      
      // Update petals in batches to reduce layout thrashing
      for (let i = 0; i < petals.length; i++) {
        petals[i].update(delta, bounds);
      }
      
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const handleMouseMove = (e) => {
      // Convert to local coordinates once
      mouseX = e.clientX - cachedBounds.left;
      mouseY = e.clientY - cachedBounds.top;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      cachedBounds = container.getBoundingClientRect();
      petals.forEach((p) => p.reset());
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
      className="absolute inset-0 -translate-y-[80%] z-20 pointer-events-none"
      style={{ overflow: "visible", contain: "none" }}
    />
  );
}