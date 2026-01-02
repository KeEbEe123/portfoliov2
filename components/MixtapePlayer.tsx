"use client";

import { useState, useEffect } from "react";
import SpotifyLastPlayed from "./SpotifyLastPlayed";

export default function MixtapePlayer() {
  const [spectrumData, setSpectrumData] = useState(null);

  // You can load Lottie spectrum data here if available
  useEffect(() => {
    // Placeholder for spectrum animation data loading
    // setSpectrumData(yourLottieData);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Background Video */}
      <video
        src="/assets/mixtape.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-contain"
      />

      {/* Spectrum Animation Area */}
      <div className="absolute left-[25%] top-[50%] 2xl:left-[30%] 2xl:top-[60%] z-10 pointer-events-none select-none w-60 h-44">
        {spectrumData ? (
          // Placeholder for Lottie animation
          <div className="w-full h-full bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
            <div className="text-white/60 text-sm">Spectrum Animation</div>
          </div>
        ) : (
          // Fallback spectrum visualizationi
          <div className="w-[80%] h-[80%] flex items-end justify-center gap-1 px-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-red-400/60 rounded-t-sm animate-pulse"
                style={{
                  width: '8px',
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Spotify Last Played */}
      <div className="absolute left-[20%] top-12 bottom-6">
        <SpotifyLastPlayed />
      </div>

      {/* Mixtape Label */}
      <div 
        className="absolute font-bold text-[55px] left-0 top-3/4 -translate-y-1/2 -rotate-90 origin-left pt-20"
        style={{ 
          fontFamily: 'Thunder-BlackHC, sans-serif',
          color: '#D12128' 
        }}
      >
        Mixtape
      </div>
    </div>
  );
}