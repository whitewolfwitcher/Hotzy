"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const premiumShowcases = [
  { 
    id: 1, 
    title: "500+ Premium Designs",
    subtitle: "Hand-crafted by professional designers",
    color: "#76B900",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1762052322036.png?width=8000&height=8000&resize=contain"
  },
  { 
    id: 2, 
    title: "Minimalist Collection",
    subtitle: "Clean, modern designs for every taste",
    color: "#4ECDC4",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1762052322036.png?width=8000&height=8000&resize=contain"
  },
  { 
    id: 3, 
    title: "Nature Series",
    subtitle: "Inspired by natural beauty",
    color: "#FF6B6B",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1762052322036.png?width=8000&height=8000&resize=contain"
  },
  { 
    id: 4, 
    title: "Abstract Art",
    subtitle: "Bold patterns and geometric designs",
    color: "#FFE66D",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1762052322036.png?width=8000&height=8000&resize=contain"
  },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentShowcase = premiumShowcases[currentIndex];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % premiumShowcases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + premiumShowcases.length) % premiumShowcases.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % premiumShowcases.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="relative bg-black min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
          <div className="text-white text-center lg:text-left py-16 lg:py-0">
            <h1 className="font-heading font-black text-white text-5xl md:text-6xl lg:text-[64px] leading-none tracking-tighter">
              Temperature Changer.<sup>*</sup>
            </h1>
            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-light-gray" style={{ lineHeight: 1.6 }}>
              The most advanced color-changing mug ever designed, the NVIDIA® Hotzy™ 5090 offers revolutionary capabilities for hot beverage enthusiasts. Equipped with 5th generation color-changing pigments and ultra-high-performance heat insulation, this mug instantly changes color on contact with hot liquids. With a 450ml capacity and heat retention technology based on GDDR7 ceramic, the Hotzy 5090 transforms every coffee break into a spectacular visual experience.
            </p>
            <div className="mt-8 space-y-2">
              <p className="text-2xl font-bold text-white">Starting at $89</p>
              <p className="text-base text-light-gray">Available January 30th.</p>
            </div>
            <div className="mt-8">
              <Link
                href="#"
                className="inline-block bg-primary text-primary-foreground font-bold py-[14px] px-8 rounded-[4px] text-base transition-all duration-300 transform hover:bg-[#9ACD32] hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(118,185,0,0.4)]"
              >
                View All Purchase Options
              </Link>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">*Changes Temperature.</p>
          </div>
          
          {/* Premium Designs Showcase Carousel */}
          <div className="relative hidden lg:block h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Dynamic glow effect based on current showcase color */}
              <div
                className="absolute w-full h-full transition-all duration-1000"
                style={{ 
                  background: `radial-gradient(ellipse at center, ${currentShowcase.color}40 0%, transparent 60%)`,
                  right: '-20%', 
                  top: '0%' 
                }}
              />
              
              {/* Image Carousel */}
              <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentShowcase.id}
                    initial={{ opacity: 0, scale: 0.8, x: 100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -100 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative"
                  >
                    <Image
                      src={currentShowcase.image}
                      alt={`${currentShowcase.title} - ${currentShowcase.subtitle}`}
                      width={1440}
                      height={810}
                      priority
                      className="object-contain w-full h-auto"
                      style={{ transform: 'scale(1.2) translateX(5%)' }}
                    />
                    
                    {/* Design info badge */}
                    <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-sm border border-border rounded-lg px-4 py-3">
                      <p className="text-xs text-muted-foreground mb-1">{currentShowcase.subtitle}</p>
                      <p className="text-lg font-bold text-white">{currentShowcase.title}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 backdrop-blur-sm border border-border rounded-full hover:bg-primary/20 hover:border-primary transition-all text-white"
                aria-label="Previous showcase"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 backdrop-blur-sm border border-border rounded-full hover:bg-primary/20 hover:border-primary transition-all text-white"
                aria-label="Next showcase"
              >
                <ChevronRight size={24} />
              </button>

              {/* Progress Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {premiumShowcases.map((showcase, index) => (
                  <button
                    key={showcase.id}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex 
                        ? 'w-8 h-2 bg-primary' 
                        : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to ${showcase.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fallback for mobile view */}
      <div className="lg:hidden absolute inset-0 opacity-20 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentShowcase.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-full"
          >
            <Image
              src={currentShowcase.image}
              alt="background"
              fill
              className="object-cover object-right"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;