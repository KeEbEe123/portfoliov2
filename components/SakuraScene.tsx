"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import AsciiClouds from "@/components/AsciiClouds";
import SakuraPetals from "@/components/SakuraPetals";

function SakuraModel({ onLoad, onBranchAnimationUpdate }: { onLoad: () => void, onBranchAnimationUpdate?: (animations: any) => void }) {
  const group = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();
  const mousePos = useRef(new THREE.Vector2());
  const prevMousePos = useRef(new THREE.Vector2());
  const mouseVelocity = useRef(new THREE.Vector2());
  const branchRefs = useRef<{ [key: string]: THREE.Object3D }>({});
  const branchAnimations = useRef<{ [key: string]: { 
    targetRotX: number, 
    targetRotZ: number, 
    currentRotX: number, 
    currentRotZ: number,
    isAnimating: boolean,
    animationSpeed: number,
    swayAmplitude: number,
    swayPhase: number,
    swayDecay: number,
    lastTriggerTime: number,
    cooldownPeriod: number,
    originalRotX: number,
    originalRotZ: number,
    idleSwayPhase: number,
    idleSwaySpeed: number
  } }>({});
  
  const { scene, animations } = useGLTF('/models/sakura.glb', true, true, (loader) => {
    loader.manager.onLoad = () => {
      onLoad();
    };
  });
  
  const { actions, mixer } = useAnimations(animations, group);
  
  useEffect(() => {
    // Find and store branch objects (removed animation playback)
    if (scene) {
      scene.traverse((child) => {
        if (child.name.includes('Object_10') || child.name.includes('Object_11')) {
          branchRefs.current[child.name] = child;
          // Initialize branch animation state
          branchAnimations.current[child.name] = {
            targetRotX: child.rotation.x, // Start with current model rotation
            targetRotZ: child.rotation.z, // Start with current model rotation
            currentRotX: child.rotation.x, // Start with current model rotation
            currentRotZ: child.rotation.z, // Start with current model rotation
            isAnimating: false,
            animationSpeed: 0.1,
            swayAmplitude: 0,
            swayPhase: Math.random() * Math.PI * 2, // Random starting phase
            swayDecay: 0.98, // How quickly the sway dies down
            lastTriggerTime: 0,
            cooldownPeriod: 200, // Minimum time between triggers (ms)
            originalRotX: child.rotation.x, // Store original rotation for reference
            originalRotZ: child.rotation.z,  // Store original rotation for reference
            idleSwayPhase: Math.random() * Math.PI * 2, // Random starting phase for idle sway
            idleSwaySpeed: 0.008 + Math.random() * 0.004 // Vary speed between branches (0.008-0.012)
          };
          console.log('Found branch:', child.name);
        }
      });
    }
  }, [scene]);

  // Handle mouse interaction (removed mixer animation)
  useFrame((state) => {
    // Calculate mouse velocity
    prevMousePos.current.copy(mousePos.current);
    mousePos.current.copy(pointer);
    mouseVelocity.current.subVectors(mousePos.current, prevMousePos.current);
    const velocityMagnitude = mouseVelocity.current.length();
    
    const currentTime = state.clock.elapsedTime * 1000; // Convert to milliseconds
    
    // Check each branch for proximity to mouse ray
    Object.entries(branchRefs.current).forEach(([branchName, branch]) => {
      if (branch && branchAnimations.current[branchName]) {
        const branchAnim = branchAnimations.current[branchName];
        
        // Get branch world position and offset it upward toward the leaves
        const branchPos = new THREE.Vector3();
        branch.getWorldPosition(branchPos);
        branchPos.y += 1.5;
        
        // Project branch position to screen space
        const screenPos = branchPos.clone().project(camera);
        
        // Calculate distance from mouse to branch in screen space
        const distance = mousePos.current.distanceTo(new THREE.Vector2(screenPos.x, screenPos.y));
        
        // Check cooldown period to prevent jittery re-triggering
        const timeSinceLastTrigger = currentTime - branchAnim.lastTriggerTime;
        
        // If mouse is close to branch and has sufficient velocity, trigger rustle (with cooldown)
        if (distance < 0.3 && velocityMagnitude > 0.015 && timeSinceLastTrigger > branchAnim.cooldownPeriod) {
          // Calculate rustle strength based on velocity and proximity (increased displacement)
          const influence = Math.max(0, (0.3 - distance) / 0.3);
          const rustleStrength = Math.min(velocityMagnitude * influence * 1.2, 0.4);
          
          // Only trigger if the new rustle would be significantly stronger or if not currently animating
          if (!branchAnim.isAnimating || rustleStrength > branchAnim.swayAmplitude * 1.5) {
            // Set target rotation with more displacement in the direction of movement
            const displacementMultiplier = 1.5; // Reduced from 1.8 for smoother movement
            branchAnim.targetRotX = branchAnim.originalRotX + (mouseVelocity.current.y * rustleStrength * displacementMultiplier) + (Math.random() - 0.5) * 0.08; // Reduced random variation
            branchAnim.targetRotZ = branchAnim.originalRotZ + (mouseVelocity.current.x * rustleStrength * displacementMultiplier) + (Math.random() - 0.5) * 0.08; // Reduced random variation
            branchAnim.isAnimating = true;
            branchAnim.animationSpeed = 0.06; // Slightly faster than 0.04 but still smooth
            
            // Start swaying motion with amplitude based on rustle strength
            branchAnim.swayAmplitude = Math.max(branchAnim.swayAmplitude, rustleStrength * 1.0); // Balanced sway amplitude
            branchAnim.swayPhase = Math.random() * Math.PI * 2;
            branchAnim.lastTriggerTime = currentTime;
          }
        }
        
        // Animate branch toward target rotation and then add swaying
        if (branchAnim.isAnimating) {
          // Move toward target (initial rustle)
          branchAnim.currentRotX += (branchAnim.targetRotX - branchAnim.currentRotX) * branchAnim.animationSpeed;
          branchAnim.currentRotZ += (branchAnim.targetRotZ - branchAnim.currentRotZ) * branchAnim.animationSpeed;
          
          // Check if we've reached the target, then start returning to original position
          if (Math.abs(branchAnim.currentRotX - branchAnim.targetRotX) < 0.008 && 
              Math.abs(branchAnim.currentRotZ - branchAnim.targetRotZ) < 0.008) {
            // Start returning to original position but with swaying
            branchAnim.targetRotX = branchAnim.originalRotX;
            branchAnim.targetRotZ = branchAnim.originalRotZ;
            branchAnim.animationSpeed = 0.025; // Slower return for smooth transition
          }
        }
        
        // Always apply swaying motion if amplitude > 0, or apply idle sway when not animating
        if (branchAnim.swayAmplitude > 0.001) {
          // Active sway from interaction
          // Update sway phase (slower for smoother motion)
          branchAnim.swayPhase += 0.025;
          
          // Calculate sway offset with more natural frequencies
          const swayX = Math.sin(branchAnim.swayPhase) * branchAnim.swayAmplitude * 0.3;
          const swayZ = Math.cos(branchAnim.swayPhase * 0.7) * branchAnim.swayAmplitude * 0.4;
          
          // Update idle sway phase even during active animation for smooth transition
          branchAnim.idleSwayPhase += branchAnim.idleSwaySpeed;
          const idleSwayX = Math.sin(branchAnim.idleSwayPhase) * 0.015;
          const idleSwayZ = Math.cos(branchAnim.idleSwayPhase * 0.8) * 0.02;
          
          // Combine active sway with idle sway
          branch.rotation.x = branchAnim.currentRotX + swayX + idleSwayX;
          branch.rotation.z = branchAnim.currentRotZ + swayZ + idleSwayZ;
          
          // Balanced decay
          branchAnim.swayAmplitude *= 0.995;
          
          // Smooth stopping conditions
          if (branchAnim.swayAmplitude <= 0.005 || 
              (Math.abs(branchAnim.currentRotX - branchAnim.originalRotX) < 0.01 && 
               Math.abs(branchAnim.currentRotZ - branchAnim.originalRotZ) < 0.01 && 
               branchAnim.targetRotX === branchAnim.originalRotX && 
               branchAnim.targetRotZ === branchAnim.originalRotZ)) {
            // Smoothly transition to idle state
            branchAnim.isAnimating = false;
            branchAnim.swayAmplitude = 0;
            branchAnim.currentRotX = branchAnim.originalRotX;
            branchAnim.currentRotZ = branchAnim.originalRotZ;
          }
        } else {
          // Pure idle wind sway when not actively animating
          branchAnim.idleSwayPhase += branchAnim.idleSwaySpeed;
          
          // Very gentle idle sway
          const idleSwayX = Math.sin(branchAnim.idleSwayPhase) * 0.015;
          const idleSwayZ = Math.cos(branchAnim.idleSwayPhase * 0.8) * 0.02;
          
          if (branchAnim.isAnimating) {
            // During initial rustle phase - combine with idle sway
            branch.rotation.x = branchAnim.currentRotX + idleSwayX;
            branch.rotation.z = branchAnim.currentRotZ + idleSwayZ;
          } else {
            // Pure idle sway from original position
            branch.rotation.x = branchAnim.originalRotX + idleSwayX;
            branch.rotation.z = branchAnim.originalRotZ + idleSwayZ;
          }
        }
      }
    });
    
    // Pass branch animation data to parent component during animation
    if (onBranchAnimationUpdate) {
      const hasActiveAnimation = Object.values(branchAnimations.current).some(anim => 
        anim.isAnimating && anim.swayAmplitude > 0.02 // Lowered to match petal threshold
      );
      if (hasActiveAnimation) {
        onBranchAnimationUpdate(branchAnimations.current);
      }
    }
  });
  
  return (
    <group ref={group}>
      <primitive object={scene} scale={1.5} position={[-1.2, -3.3, 0]} />
    </group>
  );
}

interface SakuraSceneProps {
  onLoaded?: () => void;
}

export default function SakuraScene({ onLoaded }: SakuraSceneProps) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [branchAnimations, setBranchAnimations] = useState({});
  const [sceneCamera, setSceneCamera] = useState(null);

  useEffect(() => {
    console.log('SakuraScene mounted');
    
    // Fallback timeout in case model doesn't load
    const fallbackTimer = setTimeout(() => {
      console.log('Fallback timeout triggered');
      if (!modelLoaded) {
        setModelLoaded(true);
        onLoaded?.();
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [onLoaded, modelLoaded]);

  const handleModelLoad = () => {
    console.log('3D Model loaded!');
    setModelLoaded(true);
    onLoaded?.();
  };

  const handleBranchAnimationUpdate = (animations: any) => {
    setBranchAnimations(animations);
    // Debug log to see if animations are being received
    const activeAnimations = Object.entries(animations).filter(([name, anim]: [string, any]) => 
      anim.isAnimating || anim.swayAmplitude > 0.001
    );
    if (activeAnimations.length > 0) {
      console.log('Active branch animations:', activeAnimations.length);
    }
  };

  // Component to capture camera reference
  function CameraCapture() {
    const { camera } = useThree();
    useEffect(() => {
      setSceneCamera(camera);
    }, [camera]);
    return null;
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-t from-blue-200 to-indigo-400">
      {/* ASCII Clouds background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <AsciiClouds />
      </div>

      {/* Sakura tree + petals container */}
      <div className="relative flex items-end justify-center min-h-screen pb-0 z-10">
        <div className="relative w-full h-screen">
          {/* Sakura petals floating behind tree - now reactive to branch movement */}
          <div className="absolute inset-0 translate-y-[80%] z-0 pointer-events-none">
            <SakuraPetals branchAnimations={branchAnimations} camera={sceneCamera} />
          </div>

          {/* Interactive 3D Sakura tree */}
          <div className="relative z-10 w-full h-full">
            <Canvas 
              camera={{ position: [0, -2, 6], fov: 50 }} 
              style={{ background: 'transparent' }}
            >
              <CameraCapture />
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={3} />
              <pointLight position={[2, 3, 2]} intensity={1} color="white" />
              <SakuraModel onLoad={handleModelLoad} onBranchAnimationUpdate={handleBranchAnimationUpdate} />
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
