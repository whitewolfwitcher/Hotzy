"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface MugImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function MugImage({ src, alt, className = '' }: MugImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Placeholder image URL (plain black mug)
  const placeholderSrc = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-pl-a40226e9-20251111014223.jpg";

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-800/60 ${className}`}>
      {/* Loading shimmer */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-700/20 via-neutral-600/30 to-neutral-700/20" />
      )}
      
      {/* Main image */}
      <Image
        src={hasError ? placeholderSrc : src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        priority={false}
        loading="lazy"
      />
      
      {/* Subtle overlay for visual consistency */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
    </div>
  );
}
