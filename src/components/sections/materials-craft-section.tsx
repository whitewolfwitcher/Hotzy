"use client";

import { usePreferences } from '@/contexts/preferences-context';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function MaterialsCraftSection() {
  const { language } = usePreferences();

  const translations = {
    en: {
      title: "Materials & Craft",
      lede: "Built for daily ritual. Finished for a showtime reveal.",
      specs: [
        { label: "Body", value: "Premium ceramic (lead-free), smooth lip, balanced handle" },
        { label: "Finish", value: "Food-safe glaze + heat-reactive ThermoColor topcoat (outer)" },
        { label: "Print", value: "Wraparound, high-resolution underlayer for crisp reveals" },
        { label: "Firing", value: "Kiln-fired for adhesion and gloss consistency" },
        { label: "Care", value: "Hand-wash recommended; avoid abrasive pads" },
        { label: "Heat Range", value: "Reveal tuned for 45-60°C / 113-140°F" }
      ],
      badges: ["BPA-Free", "Food-Safe Inks", "Responsible Packaging"]
    },
    fr: {
      title: "Matériaux et artisanat",
      lede: "Construit pour le rituel quotidien. Fini pour des révélations spectaculaires.",
      specs: [
        { label: "Corps", value: "Céramique premium (sans plomb), bord lisse, poignée équilibrée" },
        { label: "Finition", value: "Glaçure alimentaire + revêtement ThermoColor réactif à la chaleur (extérieur)" },
        { label: "Impression", value: "Sous-couche haute résolution enveloppante pour des révélations nettes" },
        { label: "Cuisson", value: "Cuit au four pour adhérence et consistance brillante" },
        { label: "Entretien", value: "Lavage à la main recommandé ; éviter les tampons abrasifs" },
        { label: "Plage de chaleur", value: "Révélation calibrée pour 45-60°C / 113-140°F" }
      ],
      badges: ["Sans BPA", "Encres alimentaires", "Emballage responsable"]
    }
  };

  const t = translations[language];

  // Mug close-up mockup images (removed flower image)
  const closeUpImages = [
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/extreme-macro-close-up-photography-of-a--f4b6fd44-20251111010258.jpg",
    "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-close-up-detail-photography-afac77c9-20251111010258.jpg"
  ];

  return (
    <section id="materials-and-craft" className="py-24 bg-dark-gray-1">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-h2 font-bold text-white mb-6 text-center">{t.title}</h2>
          <p className="text-body-large text-light-gray mb-12 text-center max-w-3xl mx-auto">
            {t.lede}
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Specs Grid */}
            <div className="space-y-6">
              {t.specs.map((spec, index) => (
                <div key={index} className="bg-black/50 rounded-lg p-6 border border-dark-gray-3 hover:border-primary/30 transition-colors">
                  <div className="font-bold text-primary mb-2 text-eyebrow">{spec.label}</div>
                  <div className="text-body text-light-gray">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Gallery & Badges - MUG CLOSE-UP MOCKUPS */}
            <div className="space-y-6">
              {/* Mug Close-Up Gallery */}
              <div className="grid grid-cols-2 gap-4">
                {closeUpImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-black rounded-lg border border-dark-gray-3 overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    <Image
                      src={image}
                      alt={`Mug detail ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="bg-black/50 rounded-lg p-6 border border-dark-gray-3">
                <div className="flex flex-wrap gap-4">
                  {t.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/30"
                    >
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-semibold">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}