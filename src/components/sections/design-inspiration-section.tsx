"use client";

import { usePreferences } from '@/contexts/preferences-context';
import Link from 'next/link';
import { ArrowRight, Palette, Layers, Grid3x3 } from 'lucide-react';
import Image from 'next/image';

export default function DesignInspirationSection() {
  const { language } = usePreferences();

  const translations = {
    en: {
      title: "Design & Inspiration",
      lede: "Plan your reveal moment - then make it yours in 3D.",
      cards: [
        {
          icon: <Palette size={32} />,
          title: "High-Contrast Reveals",
          text: "Hide bold art under a dark topcoat for a dramatic before/after.",
          cta: "Try high-contrast",
          href: "/en/customize?preset=contrast",
          mugImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-fc98d9d6-20251111010256.jpg"
        },
        {
          icon: <Layers size={32} />,
          title: "Gradient Stories",
          text: "Blend gradients and typography so words and shapes emerge with heat.",
          cta: "Load gradient preset",
          href: "/en/customize?preset=gradient",
          mugImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-acd0d01a-20251111010253.jpg"
        },
        {
          icon: <Grid3x3 size={32} />,
          title: "Pattern Wraps",
          text: "Seamless wraps create an all-around reveal as the coat fades.",
          cta: "Open pattern kit",
          href: "/en/customize?preset=pattern",
          mugImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-84eaa3cf-20251111010254.jpg"
        }
      ]
    },
    fr: {
      title: "Design et inspiration",
      lede: "Planifiez votre moment de révélation - puis faites-le vôtre en 3D.",
      cards: [
        {
          icon: <Palette size={32} />,
          title: "Révélations à contraste élevé",
          text: "Cachez des œuvres audacieuses sous un revêtement foncé pour un avant/après dramatique.",
          cta: "Essayer le contraste élevé",
          href: "/en/customize?preset=contrast",
          mugImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-fc98d9d6-20251111010256.jpg"
        },
        {
          icon: <Layers size={32} />,
          title: "Histoires de dégradés",
          text: "Mélangez dégradés et typographie pour que les mots et les formes émergent avec la chaleur.",
          cta: "Charger le préréglage dégradé",
          href: "/en/customize?preset=gradient",
          mugImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-acd0d01a-20251111010253.jpg"
        },
        {
          icon: <Grid3x3 size={32} />,
          title: "Motifs enveloppants",
          text: "Les enveloppes transparentes créent une révélation tout autour à mesure que le revêtement s'estompe.",
          cta: "Ouvrir le kit de motifs",
          href: "/en/customize?preset=pattern",
          mugImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-84eaa3cf-20251111010254.jpg"
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <section id="design-and-inspiration" className="py-24 bg-black">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-h2 font-bold text-white mb-6 text-center">{t.title}</h2>
          <p className="text-body-large text-light-gray mb-12 text-center max-w-3xl mx-auto">
            {t.lede}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {t.cards.map((card, index) => (
              <div
                key={index}
                className="group bg-dark-gray-1 rounded-lg overflow-hidden border border-dark-gray-3 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(118,185,0,0.2)]"
              >
                {/* Mug Mockup Preview */}
                <div className="aspect-square bg-white relative overflow-hidden">
                  <Image
                    src={card.mugImage}
                    alt={card.title}
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Card Content */}
                <div className="p-6">
                  <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-h4 font-semibold text-white mb-3">{card.title}</h3>
                  <p className="text-body text-light-gray mb-6">{card.text}</p>
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all duration-300"
                  >
                    {card.cta}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}