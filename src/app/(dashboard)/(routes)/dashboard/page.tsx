'use client';
import Navbar from "@/components/navbar";
import { useState } from 'react';

const dashboardPage = () => {
  // Set 'Message' as the default active tab
  const [activeTab, setActiveTab] = useState('Message');

  const tabs = ['Message', 'Code', 'Image', 'Video', 'Music'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Message':
        return (
          <div className="flex justify-center items-center">
            <img 
              src="/img1.jpg" 
              alt="Message"
              className="border border-transparent rounded-lg shadow-lg"
            />
          </div>
        );
      case 'Code':
        return (
          <div className="flex justify-center items-center">
            <img 
              src="/img2.jpg" 
              alt="Code" 
              className="border border-transparent rounded-lg shadow-lg"
            />
          </div>
        );
      case 'Image':
        return (
          <div className="flex justify-center items-center">
            <img 
              src="/img3.jpg" 
              alt="Image"
              className="border border-transparent rounded-lg shadow-lg" 
            />
          </div>
        );
      case 'Video':
        return (
          <div className="flex justify-center items-center">
            <img 
              src="/img4.jpg" 
              alt="Video" 
              className="border border-transparent rounded-lg shadow-lg"
            />
          </div>
        );
      case 'Music':
        return (
          <div className="flex justify-center items-center">
            <img 
              src="/img1.jpg" 
              alt="Music"
              className="border border-transparent rounded-lg shadow-lg"
            />
          </div>
        );
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
