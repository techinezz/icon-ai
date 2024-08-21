'use client';
import React, { useEffect, useRef } from 'react';
import Head from 'next/head';

const Page = () => {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let vantaEffect: any;

    const loadVanta = () => {
      if ((window as any).THREE && (window as any).VANTA && vantaRef.current) {
        vantaEffect = (window as any).VANTA.DOTS({
          el: vantaRef.current,
          THREE: (window as any).THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xe60915,
          color2: 0xff0d51,
          backgroundColor: 0x90909,
          size: 5.70,
          spacing: 69.00,
          showLines: false,
        });
      }
    };

    // Load three.js
    const threeScript = document.createElement('script');
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
    threeScript.onload = () => {
      // Load Vanta.js after three.js is loaded
      const vantaScript = document.createElement('script');
      vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.dots.min.js";
      vantaScript.onload = loadVanta;
      document.body.appendChild(vantaScript);
    };
    document.body.appendChild(threeScript);

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Icon AI</title>
      </Head>
      <div ref={vantaRef} className="relative w-full h-screen overflow-hidden">
        {/* Centered Navbar with Custom Gap and Fading Line */}
        <nav className="absolute top-0 left-0 right-0 flex justify-center items-center py-4 px-6 z-20">
          <div className="flex items-center" style={{ gap: '40rem' }}>
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Icon AI</div>
            <button className="relative px-4 py-2 bg-transparent border-2 border-gray-500 text-white text-sm rounded-full transition duration-300 overflow-hidden hover:border-gradient-to-r hover:from-red-500 hover:to-orange-600">
              Log In
            </button>
          </div>
        </nav>
        <div className="absolute" style={{ top: '4.3rem', left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent 30%, red 50%, transparent 70%)', zIndex: 10 }}></div>

        {/* Main Content with Custom Bottom Position */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10" style={{ bottom: '40rem' }}>
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 mb-4">
            Icon AI
          </h1>
          <p className="text-lg md:text-2xl text-white mb-8">
            The most powerful AI
          </p>
          <button className="relative px-8 py-4 bg-transparent border-2 border-gray-500 text-white text-lg rounded-full transition duration-300 overflow-hidden hover:border-gradient-to-r hover:from-red-500 hover:to-orange-600">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;









