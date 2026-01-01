'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

function LimitedOrbitControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const originalPosition = useRef(new THREE.Vector3(0, 0, 6)); // Zoomed back from 5 to 6
  const originalTarget = useRef(new THREE.Vector3(0, 0, 0));
  const snapBackTimer = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (controlsRef.current) {
      // Set limits
      controlsRef.current.enableZoom = false; // Disable zoom entirely
      controlsRef.current.minPolarAngle = Math.PI * 0.3; // 54 degrees from top
      controlsRef.current.maxPolarAngle = Math.PI * 0.7; // 126 degrees from top
      controlsRef.current.minAzimuthAngle = -Math.PI * 0.3; // -54 degrees
      controlsRef.current.maxAzimuthAngle = Math.PI * 0.3; // 54 degrees
      
      // Enable damping for smoother movement
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.05;
      
      // Store original position and target
      originalPosition.current.copy(camera.position);
      originalTarget.current.copy(controlsRef.current.target);
    }
  }, [camera]);
  
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });
  
  const handleStart = () => {
    // Clear any existing snap back timer when user starts interacting
    if (snapBackTimer.current) {
      clearTimeout(snapBackTimer.current);
      snapBackTimer.current = null;
    }
  };
  
  const handleEnd = () => {
    // Start smooth snap back animation immediately when user stops interacting
    if (controlsRef.current) {
      // Smoothly animate back to original position
      const startPos = camera.position.clone();
      const startTarget = controlsRef.current.target.clone();
      const duration = 1000; // 1 second
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Interpolate position and target
        camera.position.lerpVectors(startPos, originalPosition.current, easeOut);
        controlsRef.current.target.lerpVectors(startTarget, originalTarget.current, easeOut);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  };
  
  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      onStart={handleStart}
      onEnd={handleEnd}
    />
  );
}

function DigicamModel({ onLoad, onNextClick, onPrevClick, currentTextureIndex }: { 
  onLoad: () => void;
  onNextClick: () => void;
  onPrevClick: () => void;
  currentTextureIndex: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { raycaster, camera, gl } = useThree();
  const nextButtonRef = useRef<THREE.Object3D | null>(null);
  const prevButtonRef = useRef<THREE.Object3D | null>(null);
  const pictureRef = useRef<THREE.Mesh | null>(null);
  const textureLoader = useRef(new THREE.TextureLoader());
  const textures = useRef<THREE.Texture[]>([]);
  const vhsMaterial = useRef<THREE.ShaderMaterial | null>(null);
  
  // Animation state for bending
  const bendAnimation = useRef({
    isAnimating: false,
    targetRotation: 0,
    currentRotation: 0,
    animationSpeed: 0.15, // Faster animation
    returnSpeed: 0.12 // Much faster return
  });
  
  // VHS shader for retro effect
  const vhsVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  const vhsFragmentShader = `
    uniform sampler2D uTexture;
    uniform float uTime;
    varying vec2 vUv;
    
    // Random function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    // Noise function
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      // Flip texture 180 degrees by inverting both U and V coordinates
      vec2 uv = vec2(1.0 - vUv.x, 1.0 - vUv.y);
      
      // Add slight horizontal distortion (VHS tracking issues)
      float distortion = sin(uv.y * 50.0 + uTime * 2.0) * 0.002;
      uv.x += distortion;
      
      // Sample the texture
      vec4 color = texture2D(uTexture, uv);
      
      // Add scanlines
      float scanline = sin(uv.y * 800.0) * 0.04;
      color.rgb -= scanline;
      
      // Add VHS color bleeding/chromatic aberration
      float aberration = 0.003;
      color.r = texture2D(uTexture, uv + vec2(aberration, 0.0)).r;
      color.b = texture2D(uTexture, uv - vec2(aberration, 0.0)).b;
      
      // Add noise
      float noiseValue = noise(uv * 100.0 + uTime * 5.0) * 0.1;
      color.rgb += noiseValue;
      
      // Add slight color desaturation and vintage tint
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(color.rgb, vec3(gray), 0.2);
      color.rgb *= vec3(1.1, 0.95, 0.8); // Warm vintage tint
      
      // Add vignette effect
      vec2 center = uv - 0.5;
      float vignette = 1.0 - dot(center, center) * 0.8;
      color.rgb *= vignette;
      
      // Reduce overall brightness slightly for that old TV look
      color.rgb *= 0.9;
      
      gl_FragColor = color;
    }
  `;
  
  const { scene } = useGLTF('/models/digicam.glb', true, true, (loader) => {
    loader.manager.onLoad = () => {
      onLoad();
    };
  });
  
  useEffect(() => {
    // Load all textures
    const loadTextures = async () => {
      try {
        const texturePromises = [
          textureLoader.current.loadAsync('/textures/img1.jpg'),
          textureLoader.current.loadAsync('/textures/img2.jpg'),
          textureLoader.current.loadAsync('/textures/img3.jpg'),
          textureLoader.current.loadAsync('/textures/img4.jpg'),
          textureLoader.current.loadAsync('/textures/img5.jpg'),
          textureLoader.current.loadAsync('/textures/img6.jpg'),
          textureLoader.current.loadAsync('/textures/img7.JPG'), // Note: uppercase JPG
        ];
        
        const loadedTextures = await Promise.all(texturePromises);
        textures.current = loadedTextures;
        console.log('Loaded', loadedTextures.length, 'textures');
        
        // Set initial texture (img1) when textures are loaded
        if (vhsMaterial.current && loadedTextures.length > 0) {
          vhsMaterial.current.uniforms.uTexture.value = loadedTextures[0];
          vhsMaterial.current.needsUpdate = true;
        }
      } catch (error) {
        console.error('Error loading textures:', error);
      }
    };
    
    loadTextures();
    
    // Find and store references to interactive objects
    if (scene) {
      scene.traverse((child) => {
        console.log('Found object:', child.name);
        
        if (child.name === 'next_button') {
          nextButtonRef.current = child;
          console.log('Found next button');
        } else if (child.name === 'prev_button') {
          prevButtonRef.current = child;
          console.log('Found prev button');
        } else if (child.name === 'picture' && child instanceof THREE.Mesh) {
          pictureRef.current = child;
          
          // Create VHS shader material
          vhsMaterial.current = new THREE.ShaderMaterial({
            vertexShader: vhsVertexShader,
            fragmentShader: vhsFragmentShader,
            uniforms: {
              uTexture: { value: null },
              uTime: { value: 0 }
            }
          });
          
          // Replace the original material with our VHS shader
          child.material = vhsMaterial.current;
          
          console.log('Found picture plane and applied VHS material');
        }
      });
    }
  }, [scene]);
  
  // Update picture texture when currentTextureIndex changes
  useEffect(() => {
    if (pictureRef.current && textures.current.length > 0 && vhsMaterial.current) {
      const texture = textures.current[currentTextureIndex % textures.current.length];
      
      // Update the shader uniform with the new texture (no need to rotate here, handled in shader)
      vhsMaterial.current.uniforms.uTexture.value = texture;
      vhsMaterial.current.needsUpdate = true;
    }
  }, [currentTextureIndex]);
  
  // Handle click interactions and animations
  useFrame((state) => {
    // Update VHS shader time uniform for animated effects
    if (vhsMaterial.current) {
      vhsMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    
    // Handle bending animation
    if (bendAnimation.current.isAnimating) {
      const diff = bendAnimation.current.targetRotation - bendAnimation.current.currentRotation;
      
      if (Math.abs(diff) > 0.001) {
        // Moving towards target
        const speed = bendAnimation.current.targetRotation === 0 ? 
          bendAnimation.current.returnSpeed : bendAnimation.current.animationSpeed;
        bendAnimation.current.currentRotation += diff * speed;
        
        // Apply rotation to the entire model (rotate around Y-axis for vertical axis rotation)
        if (group.current) {
          group.current.rotation.y = bendAnimation.current.currentRotation;
        }
      } else {
        // Animation complete
        bendAnimation.current.isAnimating = false;
        bendAnimation.current.currentRotation = bendAnimation.current.targetRotation;
      }
    }
  });
  
  // Handle mouse clicks
  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    
    // Get the canvas element from the event target
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    
    // Update raycaster with correct mouse coordinates relative to this canvas
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections with buttons
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      
      // Check if clicked object is part of next_button
      let isNextButton = false;
      let isPrevButton = false;
      
      clickedObject.traverseAncestors((ancestor) => {
        if (ancestor.name === 'next_button') {
          isNextButton = true;
        } else if (ancestor.name === 'prev_button') {
          isPrevButton = true;
        }
      });
      
      if (clickedObject.name === 'next_button') isNextButton = true;
      if (clickedObject.name === 'prev_button') isPrevButton = true;
      
      if (isNextButton) {
        console.log('Next button clicked!');
        onNextClick();
        
        // Trigger bend animation - right side flicks back (positive Y rotation)
        bendAnimation.current.isAnimating = true;
        bendAnimation.current.targetRotation = 0.25; // Right side flicks back
        
        // After a shorter delay, return to idle
        setTimeout(() => {
          bendAnimation.current.targetRotation = 0;
        }, 200);
        
      } else if (isPrevButton) {
        console.log('Prev button clicked!');
        onPrevClick();
        
        // Trigger bend animation - left side flicks back (negative Y rotation)
        bendAnimation.current.isAnimating = true;
        bendAnimation.current.targetRotation = -0.25; // Left side flicks back
        
        // After a shorter delay, return to idle
        setTimeout(() => {
          bendAnimation.current.targetRotation = 0;
        }, 200);
      }
    }
  };
  
  useEffect(() => {
    // Use the Three.js canvas from the gl context instead of searching globally
    const canvas = gl.domElement;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
      return () => canvas.removeEventListener('click', handleClick);
    }
  }, [scene, gl.domElement]);
  
  return (
    <group ref={group}>
      <primitive object={scene} scale={0.1} position={[-1, -1, 0]} />
    </group>
  );
}

interface DigicamViewerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function DigicamViewer({ className = "", style = {} }: DigicamViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTextureIndex, setCurrentTextureIndex] = useState(0);

  const handleNextClick = () => {
    setCurrentTextureIndex(prev => (prev + 1) % 7); // Cycle through 0-6
  };

  const handlePrevClick = () => {
    setCurrentTextureIndex(prev => (prev - 1 + 7) % 7); // Cycle backwards through 0-6
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-pink-400 animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} className="rounded-lg">
        <ambientLight intensity={1.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.9} />
        <directionalLight position={[-5, 5, 5]} intensity={1.8} />
        <directionalLight position={[0, 0, 10]} intensity={0.05} /> {/* Head-on light facing camera */}
        <pointLight position={[2, 3, 2]} intensity={4.6} color="white" />
        <pointLight position={[-2, 3, 2]} intensity={1.8} color="#ffeecc" />
        <DigicamModel 
          onLoad={() => setIsLoaded(true)} 
          onNextClick={handleNextClick}
          onPrevClick={handlePrevClick}
          currentTextureIndex={currentTextureIndex}
        />
        <LimitedOrbitControls />
      </Canvas>
    </div>
  );
}