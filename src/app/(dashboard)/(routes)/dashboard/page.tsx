'use client';
import Navbar from "@/components/navbar";
import { useState } from 'react';

const dashboardPage = () => {
  // Set 'Message' as the default active tab
  const [activeTab, setActiveTab] = useState('Message');

  const tabs = ['Message', 'Code', 'Image', 'Video', 'Music'];

  const renderImage = (src: string, alt: string) => (
    <div className="flex justify-center items-center">
      <div className="relative">
        <img 
          src={src} 
          alt={alt}
          className="rounded-lg shadow-lg border border-transparent"
          style={{
            backgroundClip: 'padding-box',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        />
        <div className="absolute inset-0 rounded-lg border border-white opacity-20 pointer-events-none"></div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Message':
        return renderImage('/img1.png', 'Message');
      case 'Code':
        return renderImage('/img2.png', 'Code');
      case 'Image':
        return renderImage('/img3.png', 'Image');
      case 'Video':
        return renderImage('/img4.png', 'Video');
      case 'Music':
        return renderImage('/img5.png', 'Music');
      default:
        return null;
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-20">
        <h1 className="text-4xl font-bold text-center mt-10 text-white">Power up your Projects</h1>
        <p className="text-xl text-center mt-4 text-gray-300">
          Do it all with Icon AI
        </p>

        {/* Secondary Navbar */}
        <div className="flex justify-center mt-8">
          <div className="flex justify-center space-x-3 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-full w-auto max-w-lg">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg px-4 py-1 rounded-full ${activeTab === tab ? 'font-bold text-red-500 bg-white bg-opacity-5' : 'text-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="mt-8 text-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default dashboardPage;
