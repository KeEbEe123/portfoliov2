"use client";

import { useEffect, useRef, useState } from "react";

export default function AsciiClouds() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 150, height: 60 });

  useEffect(() => {
    // Calculate grid dimensions based on viewport
    const updateDimensions = () => {
      // With font-size 12px, letter-spacing 2px, and monospace font
      const charWidth = 9; // character width + letter spacing
      const charHeight = 12; // line height
      const width = Math.floor(window.innerWidth / charWidth);
      const height = Math.floor(window.innerHeight / charHeight);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = dimensions.width;
    const height = dimensions.height;

    // Cloud density characters from sparse to dense
    const chars = [' ', ' ', ' ', ' ', '.', '·', ':', '~', '=', '*', '#', '@'];

    // Initialize noise grid
    let grid: number[][] = [];
    for (let y = 0; y < height; y++) {
      grid[y] = [];
      for (let x = 0; x < width; x++) {
        grid[y][x] = 0;
      }
    }

    let offset = 0;

    // Three cloud layers at different heights (scaled to viewport)
    const cloudLayers = [
      { centerY: Math.floor(height * 0.2), height: Math.floor(height * 0.2), scale: 0.1 },   // Top layer
      { centerY: Math.floor(height * 0.5), height: Math.floor(height * 0.25), scale: 0.08 }, // Middle layer
      { centerY: Math.floor(height * 0.825), height: Math.floor(height * 0.225), scale: 0.09 }   // Bottom layer
    ];

    // Perlin-like noise function with layer support
    function noise(x: number, y: number) {
      let totalValue = 0;

      // Check each cloud layer
      for (const layer of cloudLayers) {
        const distFromLayerCenter = Math.abs(y - layer.centerY);

        // Only calculate if within layer range
        if (distFromLayerCenter < layer.height) {
          const scale = layer.scale;
          const nx = x * scale;
          const ny = y * scale;

          // Multiple octaves of sine waves for cloud-like pattern
          let value = 0;
          value += Math.sin(nx * 1.2 + ny * 0.8) * 0.5;
          value += Math.sin(nx * 2.5 - ny * 1.5) * 0.3;
          value += Math.sin(nx * 4.0 + ny * 3.0) * 0.15;
          value += Math.sin(nx * 0.7 + ny * 2.0) * 0.25;

          // Add vertical falloff within layer
          const falloff = 1 - Math.pow(distFromLayerCenter / layer.height, 1.8);

          value = (value + 1) / 2; // Normalize to 0-1
          value *= falloff;

          totalValue = Math.max(totalValue, value);
        }
      }

      return totalValue;
    }

    function update() {
      offset += 0.2;

      // Shift grid left
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width - 1; x++) {
          grid[y][x] = grid[y][x + 1];
        }
      }

      // Generate new column on the right
      for (let y = 0; y < height; y++) {
        let noiseVal = noise(width + offset, y);
        // Apply threshold to create distinct clouds instead of continuous fog
        noiseVal = noiseVal > 0.35 ? noiseVal : 0;
        grid[y][width - 1] = noiseVal;
      }

      // Render grid
      let output = '';
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const val = grid[y][x];
          const charIndex = Math.floor(val * (chars.length - 1));
          output += chars[charIndex];
        }
        output += '\n';
      }

      if (canvas) {
        canvas.textContent = output;
      }
    }

    // Initialize grid with noise
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let val = noise(x, y);
        grid[y][x] = val > 0.35 ? val : 0;
      }
    }

    // Animation loop
    const interval = setInterval(update, 80);

    return () => clearInterval(interval);
  }, [dimensions]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full font-mono text-[12px] leading-none whitespace-pre text-gray-400 tracking-[2px]"
      style={{
        textShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
      }}
    />
  );
}
