"use client";

import { useState, useEffect, useRef } from "react";
import AsciiClouds from "@/components/AsciiClouds";
import SakuraPetals from "@/components/SakuraPetals";

interface SakuraSceneProps {
  onLoaded?: () => void;
}

export default function SakuraScene({ onLoaded }: SakuraSceneProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('SakuraScene mounted');
    
    // Fallback timeout in case video events don't fire
    const fallbackTimer = setTimeout(() => {
      console.log('Fallback timeout triggered');
      if (!videoLoaded) {
        setVideoLoaded(true);
        onLoaded?.();
      }
    }, 2000);

    const videoElement = videoRef.current;
    
    if (videoElement) {
      const handleLoad = () => {
        console.log('Video loaded via event!');
        setVideoLoaded(true);
        onLoaded?.();
        clearTimeout(fallbackTimer);
      };

      videoElement.addEventListener('loadeddata', handleLoad);
      videoElement.addEventListener('canplaythrough', handleLoad);

      // If video is already loaded
      if (videoElement.readyState >= 3) {
        console.log('Video already loaded');
        handleLoad();
      }

      return () => {
        videoElement.removeEventListener('loadeddata', handleLoad);
        videoElement.removeEventListener('canplaythrough', handleLoad);
        clearTimeout(fallbackTimer);
      };
    }

    return () => clearTimeout(fallbackTimer);
  }, [onLoaded, videoLoaded]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-900">
      {/* Noise texture overlay */}

      {/* ASCII Clouds background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <AsciiClouds />
      </div>

      {/* Sakura tree + petals container */}
      <div className="relative flex items-end justify-center min-h-screen pb-0 z-10">
        <div className="relative">
          {/* Sakura petals floating behind tree */}
          <div className="absolute inset-0 translate-y-[80%] z-0 pointer-events-none">
            <SakuraPetals />
          </div>

          {/* Sakura tree video */}
          <video
            ref={videoRef}
            src="/assets/sakurav2.webm"
            autoPlay
            loop
            muted
            playsInline
            className="relative z-10 object-contain w-[85vw] h-auto translate-y-[2vh]"
          />
        </div>
      </div>
    </div>
  );
}
