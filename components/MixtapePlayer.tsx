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
     
      {/* Spotify Last Played */}
      <div className="absolute left-[20%] top-12 bottom-6">
        <SpotifyLastPlayed />
      </div>

      {/* Mixtape Label */}
      <div 
        className="absolute font-bold text-[55px] left-0 top-3/4 -translate-y-1/2 -rotate-90 origin-left pt-20"
        style={{ 
          fontFamily: 'Thunder-BlackHC, sans-serif',
          color: '#F7B538' 
        }}
      >
        Mixtape
      </div>
    </div>
  );
}