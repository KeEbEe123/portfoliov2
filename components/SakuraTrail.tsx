/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useTrailTexture, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import './PixelTrail.css';

// Extend JSX namespace for SVG filter elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      feColorMatrix: React.SVGProps<SVGFEColorMatrixElement>;
      feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement>;
      feComposite: React.SVGProps<SVGFECompositeElement>;
    }
  }
}

const GooeyFilter = ({ id = 'goo-filter', strength = 10 }: { id?: string; strength?: number }) => (
  <svg className="goo-filter-container">
    <defs>
      <filter id={id}>
        <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
);

// Sakura Petal Shader
const PetalMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(),
    mouseTrail: null,
    petalTexture: null,
    gridSize: 100,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform sampler2D petalTexture;
    uniform float gridSize;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);
      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;
      float trail = texture2D(mouseTrail, gridUvCenter).r;

      // Use the petal texture with trail alpha as opacity
      vec4 petal = texture2D(petalTexture, fract(uv * gridSize));
      petal.a *= trail;

      gl_FragColor = petal;
    }
  `
);

function Scene({
  gridSize,
  trailSize,
  maxAge,
  interpolate,
  easingFunction,
  petalTexturePath,
}: {
  gridSize: number;
  trailSize: number;
  maxAge: number;
  interpolate: number;
  easingFunction: (x: number) => number;
  petalTexturePath: string;
}) {
  const size = useThree(s => s.size);
  const viewport = useThree(s => s.viewport);

  const petalTexture = useTexture(petalTexturePath);
  petalTexture.minFilter = THREE.LinearFilter;
  petalTexture.magFilter = THREE.LinearFilter;
  petalTexture.wrapS = petalTexture.wrapT = THREE.ClampToEdgeWrapping;

  const petalMaterial = useMemo(() => new PetalMaterial(), []);
  petalMaterial.uniforms.petalTexture.value = petalTexture;

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: trailSize,
    maxAge: maxAge,
    interpolate: interpolate || 0.1,
    ease: easingFunction || (x => x),
  });

  if (trail) {
    trail.minFilter = THREE.NearestFilter;
    trail.magFilter = THREE.NearestFilter;
  }

  const scale = Math.max(viewport.width, viewport.height) / 2;

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={onMove}>
      <planeGeometry args={[2, 2]} />
      <primitive
        object={petalMaterial}
        gridSize={gridSize}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        mouseTrail={trail}
      />
    </mesh>
  );
}

interface SakuraTrailProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  easingFunction?: (x: number) => number;
  canvasProps?: any;
  glProps?: any;
  gooeyFilter?: { id?: string; strength?: number };
  petalTexture?: string;
  className?: string;
}

export default function SakuraTrail({
  gridSize = 30,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  easingFunction = (x: number) => x,
  canvasProps = {},
  glProps = {
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance' as const,
  },
  gooeyFilter,
  petalTexture = '/petal.svg', // 🌸 your sakura image path here
  className = '',
}: SakuraTrailProps) {
  return (
    <>
      {gooeyFilter && <GooeyFilter id={gooeyFilter.id} strength={gooeyFilter.strength} />}
      <Canvas
        {...canvasProps}
        gl={glProps}
        className={`pixel-canvas ${className}`}
        style={gooeyFilter ? { filter: `url(#${gooeyFilter.id})` } : undefined}
      >
        <Scene
          gridSize={gridSize}
          trailSize={trailSize}
          maxAge={maxAge}
          interpolate={interpolate}
          easingFunction={easingFunction}
          petalTexturePath={petalTexture}
        />
      </Canvas>
    </>
  );
}
