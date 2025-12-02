import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import HelpButton from './HelpButton';

const HomePage = () => {
  return (
    <div className="w-full relative">
      <div id="home" className="w-full h-screen relative">
        <div className="w-full h-full absolute top-0 left-0">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading...</div>}>
            <Spline scene="https://prod.spline.design/BmsfnP5JmVVjvKD2/scene.splinecode" />
          </Suspense>
        </div>
        
        <div className="relative z-10 text-white p-8 md:p-16 flex flex-col h-full justify-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Upchar Saathi</h1>
            <p className="text-xl md:text-2xl mb-8">Your personal healthcare companion</p>
            <div className="flex gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full text-white font-medium shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]">
                Get Started
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-900 px-6 py-3 rounded-full text-white font-medium shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]">
                Learn More
              </button>
            </div>
          </div>
        </div>
        <HelpButton />
      </div>
      <section id="doctors" className="w-full h-screen bg-gray-100 p-8">
        <h2 className="text-3xl font-bold mb-4">Doctors</h2>
        <p>Information about doctors...</p>
      </section>
      <section id="symptom-checker" className="w-full h-screen bg-gray-200 p-8">
        <h2 className="text-3xl font-bold mb-4">Symptom Checker</h2>
        <p>Information about symptom checker...</p>
      </section>
      <section id="first-aid" className="w-full h-screen bg-gray-300 p-8">
        <h2 className="text-3xl font-bold mb-4">First Aid</h2>
        <p>Information about first aid...</p>
      </section>
    </div>
  );
};

export default HomePage;