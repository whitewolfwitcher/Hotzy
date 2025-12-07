"use client";

import { usePreferences } from '@/contexts/preferences-context';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function DiscoverHero() {
  const { language } = usePreferences();

  const translations = {
    en: {
      title: "Discover Hotzy",
      subtitle: "Science you can sip, craft you can feel, design you can make yours.",
      cta: "Customize a Mug"
    },
    fr: {
      title: "Découvrez Hotzy",
      subtitle: "La science que vous pouvez savourer, l'artisanat que vous pouvez sentir, le design que vous pouvez personnaliser.",
      cta: "Personnaliser un mug"
    }
  };

  const t = translations[language];

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Video placeholder - In production, replace with actual video */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="relative w-full max-w-2xl aspect-square">
          {/* Animated mug silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-transparent animate-spin-slow" style={{ animationDuration: '20s' }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center px-6 py-24">
        <h1 className="text-hero-h1 font-black text-white mb-6 tracking-tight">
          {t.title}
        </h1>
        <p className="text-body-large text-light-gray max-w-3xl mx-auto mb-12">
          {t.subtitle}
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-button transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(118,185,0,0.4)]"
        >
          <Sparkles size={20} />
          {t.cta}
        </Link>
      </div>
    </section>
  );
}