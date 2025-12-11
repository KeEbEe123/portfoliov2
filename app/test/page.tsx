'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useState } from 'react';

function SakuraModel({ onLoad }: { onLoad: () => void }) {
  const { scene } = useGLTF('/models/sakura.glb', true, true, (loader) => {
    loader.manager.onLoad = () => {
      onLoad();
    };
  });
  
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

export default function Test() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-screen relative">
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-pink-400 animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SakuraModel onLoad={() => setIsLoaded(true)} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}