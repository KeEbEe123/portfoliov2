"use client";
import { useEffect, useRef } from "react";
import * as THREE from 'three';

export default function SakuraPetals({ branchAnimations = {}, camera }) {
  const containerRef = useRef(null);
  const branchAnimationsRef = useRef(branchAnimations);
  
  // Update the ref when branchAnimations changes
  useEffect(() => {
    branchAnimationsRef.current = branchAnimations;
  }, [branchAnimations]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    // Debug log to see if branch animations are being received
    console.log('SakuraPetals received branchAnimations:', Object.keys(branchAnimations || {}).length);

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
      constructor(spawnX = null, spawnY = null) {
        this.reset(true, spawnX, spawnY);
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
          width: "25px",
          height: "25px",
        });
        
        // Cache transform string parts to reduce string concatenation
        this.lastTransform = "";
        this.lastOpacity = 1;
        this.lifespan = 0;
        this.maxLifespan = 8000 + Math.random() * 4000; // 8-12 seconds
        
        container.appendChild(this.element);
      }

      reset(initial = false, spawnX = null, spawnY = null) {
        const { width, height } = getBounds();
        
        if (spawnX !== null && spawnY !== null) {
          // Spawn from specific branch position
          this.x = spawnX + (Math.random() - 0.5) * 100; // Small random offset
          this.y = spawnY + (Math.random() - 0.5) * 50;
        } else {
          // Default spawn behavior (reduced for less static petals)
          const startY = height * 0.2;
          this.x = Math.random() * Math.max(100, width);
          this.y = initial
            ? startY + Math.random() * (height - startY)
            : startY - 100 - Math.random() * 200;
        }
        
        this.size = Math.random() * 0.3 + 0.2;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.025 + 0.02;
        this.opacity = Math.random() * 0.4 + 0.6;
        this.lifespan = 0;
      }

      update(delta, bounds) {
        const { width, height } = bounds;
        this.lifespan += delta * 16.67; // Convert to milliseconds

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
          displaceX = Math.cos(angle) * force * 20;
          displaceY = Math.sin(angle) * force * 20;
        }

        this.y += this.speedY * delta;
        this.swing += this.swingSpeed * delta;
        this.x += (Math.sin(this.swing) * 1.5 + this.speedX + displaceX * 0.3) * delta;
        this.y += displaceY * 0.2 * delta;
        this.rotation += (this.rotationSpeed + Math.abs(displaceX) * 1) * delta;

        // Fade out over time
        const fadeProgress = this.lifespan / this.maxLifespan;
        if (fadeProgress > 0.7) {
          this.opacity = Math.max(0, 1 - (fadeProgress - 0.7) / 0.3);
        }

        // Remove if too old or off screen
        if (this.lifespan > this.maxLifespan || this.y > height + 300) {
          return false; // Signal for removal
        }
        
        if (this.x > width + 300) this.x = -300;
        else if (this.x < -300) this.x = width + 300;

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

        return true; // Continue existing
      }

      remove() {
        this.element?.remove();
      }
    }

    const petals = [];
    
    // Reduced initial count since we'll spawn dynamically
    const initialCount = 60;
    for (let i = 0; i < initialCount; i++) {
      const petal = new Petal();
      petal.y = Math.random() < 0.6 ? Math.random() * getBounds().height : -Math.random() * 200;
      petals.push(petal);
    }

    let lastTime = performance.now();
    let rafId;
    let lastBranchCheck = 0;

    // Function to convert 3D world position to screen coordinates
    const worldToScreen = (worldPos, camera, bounds) => {
      if (!camera) return null;
      
      try {
        const screenPos = worldPos.clone().project(camera);
        const x = (screenPos.x * 0.5 + 0.5) * bounds.width;
        const y = (-screenPos.y * 0.5 + 0.5) * bounds.height;
        return { x, y };
      } catch (e) {
        return null;
      }
    };

    const animate = (time) => {
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;
      
      // Cache bounds once per frame instead of per petal
      const bounds = getBounds();
      
      // Check for branch animations and spawn petals (throttled)
      if (time - lastBranchCheck > 100) { // Check more frequently - reduced from 150ms to 100ms
        lastBranchCheck = time;
        
        if (branchAnimationsRef.current && Object.keys(branchAnimationsRef.current).length > 0) {
          let shouldSpawnPetal = false;
          let animationStrength = 0;
          
          Object.entries(branchAnimationsRef.current).forEach(([branchName, branchAnim]) => {
            // Spawn petals during initial movement and early swaying
            if (branchAnim && branchAnim.isAnimating && branchAnim.swayAmplitude > 0.02) { // Lowered from 0.03 to 0.02
              shouldSpawnPetal = true;
              animationStrength = Math.max(animationStrength, branchAnim.swayAmplitude)+5;
            }
          });
          
          if (shouldSpawnPetal) {
            // Spawn multiple petals based on animation strength
            const spawnCount = Math.min(Math.floor(animationStrength * 8) + 50, 4); // 1-4 petals per check
            const spawnChance = Math.min(animationStrength * 3 + 0.3, 0.9); // 30%-90% chance based on strength
            
            if (Math.random() < spawnChance) {
              console.log(`Spawning ${spawnCount} petals due to branch movement (strength: ${animationStrength.toFixed(3)})`);
              
              for (let i = 0; i < spawnCount; i++) {
                // Calculate screen position based on tree position
                const treeScreenX = bounds.width * 0.45;
                const treeScreenY = bounds.height * 0.55;
                
                // Add more variation for multiple petals
                const branchOffsetX = (Math.random() - 0.5) * 400; // Increased spread
                const branchOffsetY = (Math.random() - 0.5) * 250;
                
                const spawnX = treeScreenX + branchOffsetX;
                const spawnY = treeScreenY + branchOffsetY;
                
                const newPetal = new Petal(spawnX, spawnY);
                petals.push(newPetal);
              }
              
              // Limit total petals to prevent performance issues
              while (petals.length > 200) {
                const oldPetal = petals.shift();
                oldPetal?.remove();
              }
            }
          }
        }
      }
      
      // Update petals and remove expired ones
      for (let i = petals.length - 1; i >= 0; i--) {
        const shouldContinue = petals[i].update(delta, bounds);
        if (!shouldContinue) {
          petals[i].remove();
          petals.splice(i, 1);
        }
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
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      petals.forEach((p) => p.remove());
    };
  }, []); // Remove branchAnimations from dependencies

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -translate-y-[80%] z-20 pointer-events-none"
      style={{ overflow: "visible", contain: "none" }}
    />
  );
}