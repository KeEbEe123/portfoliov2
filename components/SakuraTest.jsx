"use client";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";

// === Custom Shader ===
const leafVertexShader = `
uniform vec2 mouse;
uniform float time;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 newPosition = position;

  float dist = distance(uv, mouse);
  float strength = smoothstep(0.5, 0.0, dist);

  newPosition.x += sin(time * 3.0 + position.y * 5.0) * 0.05 * strength;
  newPosition.y += cos(time * 4.0 + position.x * 4.0) * 0.02 * strength;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const leafFragmentShader = `
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(1.0, 0.8, 0.9, 1.0); // Sakura pink (placeholder)
}
`;

function SakuraTree({ url }) {
  const { scene } = useGLTF(url);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Apply shader material to leaf meshes
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material.name.includes("Leaf")) {
        child.material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            mouse: { value: mouse.current },
          },
          vertexShader: leafVertexShader,
          fragmentShader: leafFragmentShader,
        });
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    scene.traverse((child) => {
      if (child.isMesh && child.material.uniforms) {
        child.material.uniforms.time.value = t;
        child.material.uniforms.mouse.value = new THREE.Vector2(
          mouse.current.x * 0.5 + 0.5,
          mouse.current.y * 0.5 + 0.5
        );
      }
    });
  });

  return <primitive object={scene} />;
}

export default function SakuraTest() {
  return (
    <Canvas camera={{ position: [0, 2, 5] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 5, 3]} intensity={1.2} />
      <SakuraTree url="/models/test.glb" />
      <OrbitControls />
    </Canvas>
  );
}
