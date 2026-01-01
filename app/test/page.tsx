'use client';

import DigicamViewer from '@/components/DigicamViewer';

export default function Test() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6">
      {/* Bento Grid Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-screen">
        
        {/* Text Section */}
        <div className="md:col-span-1 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl md:text-5xl font-serif italic leading-tight mb-4">
              I'm a full-stack developer who enjoys building intelligent, real-time products and learning how complex systems work end to end.
            </h1>
          </div>
        </div>
        
        {/* Digicam Section */}
        <div className="md:col-span-1 flex items-center justify-center">
          <DigicamViewer 
            className="w-full h-96 md:h-full max-h-96"
            style={{ background: 'transparent' }}
          />
        </div>
        
        {/* Cassette Section - Placeholder */}
        <div className="md:col-span-1 flex items-center justify-center">
          <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-white text-center">Cassette Player<br/>Component Here</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}