"use client";

import { usePreferences } from '@/contexts/preferences-context';
import { useState } from 'react';
import { ArrowRight, ShoppingCart, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { featuredCustomizerDesignTemplates } from '@/lib/design-templates';

export default function DesignGalleryCustomizer() {
  const { language } = usePreferences();
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  const translations = {
    en: {
      title: "Ready-to-Reveal Designs",
      lede: "Pick a preset, customize in real time, and order your Hotzy",
      cta: {
        customize: "Customize this design",
        order: "Order now",
      },
      note: "All designs are print-ready for Hotzy",
    },
    fr: {
      title: "Designs prets a reveler",
      lede: "Choisissez un prereglage, personnalisez en temps reel et commandez votre mug ThermoColor, le tout au meme endroit.",
      cta: {
        customize: "Personnaliser ce design",
        order: "Commander maintenant",
      },
      note: "Tous les designs sont prets a imprimer pour la sublimation ThermoColor.",
    },
  };

  const t = translations[language];
  const featuredDesigns = featuredCustomizerDesignTemplates.slice(0, 4);

  return (
    <section id="design-gallery-customizer" className="py-24 bg-dark-gray-1">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-h2 font-bold text-white mb-6 text-center">{t.title}</h2>
          <p className="text-body-large text-light-gray mb-12 text-center max-w-3xl mx-auto !whitespace-pre-line">
            {t.lede}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredDesigns.map((design) => (
              <div
                key={design.id}
                onClick={() => setSelectedDesign(design.id)}
                className={`group cursor-pointer bg-black rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  selectedDesign === design.id
                    ? 'border-primary shadow-[0_0_30px_rgba(118,185,0,0.3)]'
                    : 'border-dark-gray-3 hover:border-primary/50'
                }`}
              >
                <div className="aspect-square bg-white relative overflow-hidden">
                  <Image
                    src={design.thumbnail}
                    alt={language === 'fr' ? design.nameFr : design.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-h4 font-semibold text-white mb-2">
                    {language === 'fr' ? design.nameFr : design.name}
                  </h3>
                  <p className="text-body-small text-light-gray">
                    {language === 'fr'
                      ? design.descriptionFr ?? design.description
                      : design.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/customizer"
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-black px-8 py-4 rounded-lg font-bold text-button hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            >
              <Package size={20} />
              {t.cta.customize}
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/shop"
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-dark-gray-2 text-white border-2 border-dark-gray-3 px-8 py-4 rounded-lg font-bold text-button hover:border-primary/50 transition-all duration-300"
            >
              <ShoppingCart size={20} />
              {t.cta.order}
            </Link>
          </div>

          <p className="text-caption text-muted-foreground text-center mt-8 italic !whitespace-pre-line">
            {t.note}
          </p>
        </div>
      </div>
    </section>
  );
}
