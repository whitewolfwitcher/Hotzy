"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

interface InteractiveMugProps {
  images: string[];
  color?: string;
  rotationSpeed?: number; // seconds per full rotation
}

const InteractiveMug = ({
  images,
  color = "#76B900",
  rotationSpeed = 8
}: InteractiveMugProps) => {
  return (
    <div
      id="interactiveMug"
      className="relative w-full h-full flex items-center justify-center overflow-hidden">

      {/* Sophisticated gradient background with multiple layers */}
      <div className="absolute inset-0">
        {/* Primary radial gradient - green spotlight from center */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(118, 185, 0, 0.25) 0%, rgba(118, 185, 0, 0.12) 30%, transparent 70%)'
          }} 
        />
        
        {/* Secondary gradient - darker atmospheric depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(26, 51, 0, 0.4) 0%, transparent 50%)'
          }} 
        />
        
        {/* Accent gradient - subtle green glow from bottom */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(118, 185, 0, 0.15) 0%, transparent 60%)'
          }} 
        />
      </div>

      {/* Animated pulsing glow ring */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ 
          backgroundColor: color,
          width: '70%',
          height: '70%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }} 
      />

      {/* Secondary smaller glow for depth */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{ 
          backgroundColor: color,
          width: '50%',
          height: '50%',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }} 
      />

      {/* Static mug image with hover effects */}
      <motion.div
        className="relative w-full h-full z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}>

        <motion.div
          className="relative w-full h-full"
          whileHover={{
            scale: 1.05,
            rotateY: 15,
            rotateX: 5
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}>

          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1762219026873.png?width=8000&height=8000&resize=contain"
            alt="Premium Hotzy Mug"
            fill
            className="object-contain drop-shadow-[0_0_50px_rgba(118,185,0,0.4)]"
            priority />

        </motion.div>
      </motion.div>
    </div>);

};

export default InteractiveMug;