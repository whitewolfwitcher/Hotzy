"use client";

import React from 'react';
import Image from 'next/image';

const PlayIcon = () => (
  <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
    <path d="M23.1034 12.3379C24.4368 13.0991 24.4368 14.9009 23.1034 15.6621L2.24138 27.621C0.908044 28.3822 -0.758622 27.4813 0.758623 26.2588V1.74116C-0.758622 0.518656 0.908046 -0.382245 2.24138 0.37896L23.1034 12.3379Z" fill="white"/>
  </svg>
);

const DlssComparisonSection = () => {
  return (
    <section 
      className="relative flex flex-col lg:flex-row w-full min-h-[700px] bg-cover bg-center text-white"
      id="color-change"
      style={{ 
        backgroundImage: "url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/atmospheric-moody-scene-showing-a-thermo-92c4322c-20251030104405.jpg')" 
      }}
    >
      <div className="w-full lg:w-2/5 bg-black/70 flex items-center justify-center">
        <div className="max-w-xl px-6 md:px-16 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-primary mb-4">
            NVIDIA HotzyChrome 4
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Instant Transformation. Vibrant Colors. All the Power of Heat.
          </h2>
          <div className='space-y-4 text-muted-foreground'>
            <p>
              HotzyChrome is a revolutionary suite of color-changing technologies that harnesses heat to transform appearance, enhance visual experience, and create spectacular effects.
            </p>
            <p className='pb-4'>
              HotzyChrome 4, a decisive breakthrough, leverages the phenomenal power of 5th generation color-changing pigments to provide new multi-layer color change functionality, ultra-fast color transition, and an even richer chromatic palette. The combination of HotzyChrome and Hotzy ceramic gives you the best way to enjoy your beverages by transforming every coffee break into a captivating visual spectacle.
            </p>
          </div>
          <a href="#" className="font-bold text-primary hover:text-white transition-colors group flex items-center text-sm">
            Discover how heat transforms your mugs
            <span className="font-sans font-normal text-2xl ml-2 transition-transform group-hover:translate-x-1 inline-block leading-none">&gt;</span>
          </a>
        </div>
      </div>

      <div className="relative w-full lg:w-3/5 min-h-[500px] lg:min-h-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-white/30"></div>

        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 text-center text-white w-40">
          <p className="text-6xl font-black">68°F</p>
          <p className="text-xl font-bold mb-2">Cold</p>
          <span className="bg-black/80 px-3 py-1 text-xs font-semibold rounded-sm">Base Color</span>
        </div>

        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 text-center text-white w-40">
          <p className="text-6xl font-black">149°F</p>
          <p className="text-xl font-bold mb-2">Hot</p>
          <span className="bg-primary px-3 py-1 text-xs font-semibold text-black rounded-sm">Full Transformation</span>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center bg-transparent backdrop-blur-sm transition-transform hover:scale-105" aria-label="Play video">
            <PlayIcon />
          </button>
        </div>

        <div className="absolute bottom-8 right-8">
          <p className="text-xs text-white/50 w-64 text-right mb-4">
            Hotzy 5090, 450ml, 5th Gen Color-Changing Pigments, Full Transition, Multi-Layer Change Activated
          </p>
          <div className="flex justify-end">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/svgs/cyberpunk2077-logo-10.svg"
              alt="Hotzy Logo"
              width={180}
              height={58}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DlssComparisonSection;