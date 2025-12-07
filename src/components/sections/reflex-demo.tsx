import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const PlayIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M8 5V19L19 12L8 5Z" />
  </svg>
);

const ReflexDemo = () => {
  return (
    <section className="bg-black w-full relative" id="retention">
      <div className="relative min-h-[700px] w-full">
        {/* Full-width video background */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/geforce-rtx-50-series-reflex-2-bm-xl770-d-11.jpg"
            alt="Demonstration of NVIDIA HeatRetain 2 with a split screen comparison"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
        </div>

        {/* Dark overlay on left side for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent lg:to-transparent z-[1]" />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col lg:flex-row min-h-[700px]">
          {/* Text content - positioned on left */}
          <div className="lg:w-1/3 w-full flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-20">
            <div className="max-w-md mx-auto lg:mx-0">
              <h2 className="text-white uppercase font-bold text-sm tracking-[0.08em] mb-4">
                NVIDIA HeatRetain 2
              </h2>
              <h3 className="text-white font-bold text-4xl leading-tight mb-6">
                Keep Your Beverages Hot Longer
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                HeatRetain technologies optimize heat insulation for ultimate heat retention, offering hotter beverages for longer, consistent temperature, and an enhanced drinking experience.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                HeatRetain 2 introduces Adaptive Heat Distribution (coming soon!), which maintains the ideal temperature based on the beverage poured.
              </p>
              <a
                href="#"
                className="text-primary font-bold flex items-center gap-2 hover:brightness-110 transition-all"
              >
                <span>Discover the HeatRetain Advantage</span>
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Comparison metrics and play button - positioned on right */}
          <div className="lg:w-2/3 w-full relative flex items-center justify-center">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-primary opacity-30" />

            <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center text-white space-y-2">
              <span className="text-5xl font-bold">108°F</span>
              <span className="text-sm uppercase tracking-wider">after 2h</span>
              <span className="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-sm">
                Standard Insulation
              </span>
            </div>

            <div className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center text-white space-y-2">
              <span className="text-5xl font-bold text-primary">154°F</span>
              <span className="text-sm uppercase tracking-wider">after 2h</span>
              <span className="bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-sm">
                HeatRetain 2 On
              </span>
            </div>
            
            <div className="flex items-center justify-center" aria-hidden="true">
              <div className="absolute h-full w-[2px] bg-primary top-0 left-1/2 -translate-x-1/2" />
              <button
                className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200"
                aria-label="Play video"
              >
                <PlayIcon className="text-black w-10 h-10 ml-1" />
              </button>
            </div>

            <div className="absolute bottom-8 right-8">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/the-finals-game-logo-2x-12.png"
                alt="Hotzy Logo"
                width={140}
                height={40}
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReflexDemo;