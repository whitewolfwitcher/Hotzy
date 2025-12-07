"use client";

import { usePreferences } from '@/contexts/preferences-context';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function DiscoverCTA() {
  const { language } = usePreferences();

  const translations = {
    en: {
      title: "Ready to make yours?",
      cta: "Start Designing"
    },
    fr: {
      title: "Prêt à créer le vôtre ?",
      cta: "Commencer à concevoir"
    }
  };

  const t = translations[language];

  return (
    <section id="discover-cta" className="py-32 bg-gradient-to-b from-black via-dark-gray-1 to-black relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h1 font-bold text-white mb-12">{t.title}</h2>
          <Link
            href="/explore"
            className="inline-flex items-center gap-3 bg-transparent border-2 border-primary text-white px-10 py-5 rounded-lg font-bold text-button transition-all duration-300 hover:bg-primary hover:text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(118,185,0,0.5)] group"
          >
            <Sparkles size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
