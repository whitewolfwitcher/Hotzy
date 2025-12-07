"use client";

import { usePreferences } from '@/contexts/preferences-context';
import { useState } from 'react';
import { ArrowRight, Upload, ShoppingCart, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DesignGalleryCustomizer() {
  const { language } = usePreferences();
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);

  const translations = {
    en: {
      title: "Ready-to-Reveal Designs",
      lede: "Pick a preset, customize in real time, and order your Hotzy",
      designs: [
      { name: "Sunrise Burst", theme: "Warm gradient reveal", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-wh-9943a187-20251111010255.jpg" },
      { name: "Night Sky", theme: "Cosmic constellation", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-fc98d9d6-20251111010256.jpg" },
      { name: "Geometric", theme: "Bold pattern wrap", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-84eaa3cf-20251111010254.jpg" },
      { name: "Floral Frame", theme: "Botanical elegance", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-acd0d01a-20251111010253.jpg" }],

      cta: {
        customize: "Customize this design",
        upload: "Upload your own art",
        order: "Order now"
      },
      note: "All designs are print-ready for Hotzy"
    },
    fr: {
      title: "Designs prêts à révéler",
      lede: "Choisissez un préréglage, personnalisez en temps réel et commandez votre mug ThermoColor - le tout au même endroit.",
      designs: [
      { name: "Éclat du lever du soleil", theme: "Révélation de dégradé chaud", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-wh-9943a187-20251111010255.jpg" },
      { name: "Ciel nocturne", theme: "Constellation cosmique", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-fc98d9d6-20251111010256.jpg" },
      { name: "Géométrique", theme: "Motif enveloppant audacieux", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-84eaa3cf-20251111010254.jpg" },
      { name: "Cadre floral", theme: "Élégance botanique", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-whit-acd0d01a-20251111010253.jpg" }],

      cta: {
        customize: "Personnaliser ce design",
        upload: "Télécharger votre propre art",
        order: "Commander maintenant"
      },
      note: "Tous les designs sont prêts à imprimer pour la sublimation ThermoColor."
    }
  };

  const t = translations[language];

  return (
    <section id="design-gallery-customizer" className="py-24 bg-dark-gray-1">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-h2 font-bold text-white mb-6 text-center">{t.title}</h2>
          <p className="text-body-large text-light-gray mb-12 text-center max-w-3xl mx-auto !whitespace-pre-line">
            {t.lede}
          </p>

          {/* Design Gallery */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {t.designs.map((design, index) =>
            <div
              key={index}
              onClick={() => setSelectedDesign(index)}
              className={`group cursor-pointer bg-black rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              selectedDesign === index ?
              'border-primary shadow-[0_0_30px_rgba(118,185,0,0.3)]' :
              'border-dark-gray-3 hover:border-primary/50'}`
              }>

                <div className="aspect-square bg-white relative overflow-hidden">
                  <Image
                  src={design.image}
                  alt={design.name}
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />

                </div>
                <div className="p-4">
                  <h3 className="text-h4 font-semibold text-white mb-2">{design.name}</h3>
                  <p className="text-body-small text-light-gray">{design.theme}</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/customizer"
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-black px-8 py-4 rounded-lg font-bold text-button hover:bg-primary/90 transition-all duration-300 hover:scale-105">

              <Package size={20} />
              {t.cta.customize}
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/shop"
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-dark-gray-2 text-white border-2 border-dark-gray-3 px-8 py-4 rounded-lg font-bold text-button hover:border-primary/50 transition-all duration-300">

              <ShoppingCart size={20} />
              {t.cta.order}
            </Link>
          </div>

          <p className="text-caption text-muted-foreground text-center mt-8 italic !whitespace-pre-line">{t.note}</p>
        </div>
      </div>
    </section>);

}