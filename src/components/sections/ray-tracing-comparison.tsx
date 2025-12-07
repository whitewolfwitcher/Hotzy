"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

const ImageComparisonSlider = ({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
}: {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleInteractionStart = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      if ('clientX' in e) {
        handleMove(e.clientX);
      } else {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleInteractionEnd = () => {
      isDragging.current = false;
    };

    const handleInteractionMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging.current) {
        e.preventDefault();
        if ('clientX' in e) {
          handleMove(e.clientX);
        } else {
          handleMove(e.touches[0].clientX);
        }
      }
    };

    container.addEventListener('mousedown', handleInteractionStart as EventListener);
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('mousemove', handleInteractionMove as EventListener);
    
    container.addEventListener('touchstart', handleInteractionStart as EventListener, { passive: true });
    document.addEventListener('touchend', handleInteractionEnd);
    document.addEventListener('touchmove', handleInteractionMove as EventListener, { passive: false });

    return () => {
      container.removeEventListener('mousedown', handleInteractionStart as EventListener);
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('mousemove', handleInteractionMove as EventListener);
      
      container.removeEventListener('touchstart', handleInteractionStart as EventListener);
      document.removeEventListener('touchend', handleInteractionEnd);
      document.removeEventListener('touchmove', handleInteractionMove as EventListener);
    };
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[2048px] mx-auto aspect-[16/9] overflow-hidden select-none cursor-ew-resize group rounded"
    >
      <Image
        src={beforeImage}
        alt={beforeLabel}
        width={2048}
        height={1152}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        priority
        draggable={false}
      />
      <div
        className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image
          src={afterImage}
          alt={afterLabel}
          width={2048}
          height={1152}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          priority
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-2 border-white bg-black/50 flex items-center justify-center backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 25L10 20L15 15" stroke="#76B900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M25 15L30 20L25 25" stroke="#76B900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="20" y1="10" x2="20" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 bg-black/70 text-white font-bold tracking-widest text-lg px-4 py-2 pointer-events-none rounded-sm">
        {beforeLabel}
      </div>
      <div className="absolute bottom-5 right-5 bg-black/70 text-white font-bold tracking-widest text-lg px-4 py-2 pointer-events-none rounded-sm">
        {afterLabel}
      </div>
    </div>
  );
};

const RayTracingComparison = () => {
  return (
    <section className="bg-black py-24" id="thermal">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-eyebrow text-white mb-4">
            Advanced Heat Imaging with Color Change
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            A Revolutionary Transformation
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            NVIDIA Blackwell architecture provides you with an unprecedented visual experience with advanced support for color-changing technology. With Hotzy™ 50 series, equipped with fifth-generation color-changing pigments, along with innovative color transition technologies accelerated by advanced ceramic insulation, you get spectacular visual effects with every use.
          </p>
        </div>

        <ImageComparisonSlider
            beforeImage="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/geforce-ray-tracing-half-life-2-rtx-off-2048-10.jpg"
            afterImage="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/geforce-ray-tracing-half-life-2-rtx-on-2048-9.jpg"
            beforeLabel="Room Temperature"
            afterLabel="Hot Liquid"
        />
      </div>
    </section>
  );
};

export default RayTracingComparison;