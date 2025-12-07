"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { usePreferences } from '@/contexts/preferences-context';

const HotzyHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = usePreferences();

  const translations = {
    en: {
      eyebrow: "HOTZY 3D MUGS",
      title1: "Customize your mug.",
      title2: "Edit it in 3D.",
      description: "Design your perfect custom mug with our advanced 3D editor. Upload your image, watch it come to life with real-time 3D preview, and customize every detail before you buy.",
      ctaPrimary: "Customize Now",
      ctaSecondary: "View Gallery",
      feature1: "Real-time 3D Editor",
      feature2: "360° Preview"
    },
    fr: {
      eyebrow: "HOTZY MUGS 3D",
      title1: "Personnalisez votre mug.",
      title2: "Éditez-le en 3D.",
      description: "Concevez votre mug personnalisé parfait avec notre éditeur 3D avancé. Téléchargez votre image, regardez-la prendre vie avec un aperçu 3D en temps réel et personnalisez chaque détail avant d'acheter.",
      ctaPrimary: "Personnaliser maintenant",
      ctaSecondary: "Voir la galerie",
      feature1: "Éditeur 3D en temps réel",
      feature2: "Aperçu à 360°"
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Video autoplay failed:", err);
      });
    }
  }, []);

  return (
    <section className="relative bg-black min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT SIDE - Text Content */}
      <div className="relative z-10 flex items-center lg:w-1/2 w-full">
        <div className="w-full max-w-2xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6">
              {/* Small decorative mug icon */}
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 19h18v2H2v-2zm0-8h3v7H2v-7zm5 0h3v7H7v-7zm5 0h3v7h-3v-7zm5-8h3v15h-3V3zM2 3h3v6H2V3zm5 0h3v6H7V3z"/>
              </svg>
              <p className="text-eyebrow text-primary">{t.eyebrow}</p>
            </motion.div>

            <motion.h1
              className="font-heading font-black text-white text-5xl md:text-6xl lg:text-[72px] leading-none tracking-tighter mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              {t.title1}<br />
              <span className="text-primary">{t.title2}</span>
            </motion.h1>

            <motion.p
              className="mt-8 max-w-xl text-body-large text-light-gray leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}>
              {t.description}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}>
              <Link
                href="/customizer"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold py-4 px-8 rounded-lg text-base transition-all duration-300 transform hover:bg-[#9ACD32] hover:scale-[1.05] hover:shadow-[0_8px_24px_rgba(118,185,0,0.4)]">
                {t.ctaPrimary}
              </Link>
              <Link
                href="#gallery"
                className="inline-flex items-center justify-center bg-transparent border-2 border-primary text-white font-bold py-4 px-8 rounded-lg text-base transition-all duration-300 hover:bg-primary/10">
                {t.ctaSecondary}
              </Link>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-wrap gap-8 text-sm text-neutral-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                <span>{t.feature1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                <span>{t.feature2}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Video Background */}
      <div className="relative lg:w-1/2 w-full min-h-[50vh] lg:min-h-screen">
        {/* Video fills this container completely */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline>
          <source src="/video/Landing_Page_Video_Generation.mp4" type="video/mp4" />
        </video>
        
        {/* Optional subtle overlay for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/60" />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/4 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}>
        {/* Small stylized 3D mug */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Mug body */}
          <div className="absolute w-8 h-10 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-sm border border-primary/30 shadow-lg">
            {/* Mug rim highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 rounded-t-sm"></div>
            {/* Steam effect */}
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              animate={{ opacity: [0.3, 0.7, 0.3], y: [-2, -6, -2] }}
              transition={{ duration: 2, repeat: Infinity }}>
              <div className="w-1 h-3 bg-primary/40 rounded-full blur-sm"></div>
            </motion.div>
          </div>
          {/* Mug handle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-5 border-2 border-primary/40 rounded-r-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HotzyHero;