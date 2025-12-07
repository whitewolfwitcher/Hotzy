"use client";

import { usePreferences } from '@/contexts/preferences-context';
import { useState } from 'react';
import Image from 'next/image';

export default function ThermoColorSection() {
  const { language } = usePreferences();
  const [activeStep, setActiveStep] = useState(0);

  const translations = {
    en: {
      title: "How Color-Changing Works",
      lede: "A heat-reactive coat hides your print when cool, then turns transparent as the mug warms - revealing the art beneath.",
      body: [
      "Micro-capsules in the outer coat respond around **45-60°C (113-140°F)**.",
      "When hot liquid is added, the dye phase changes and **becomes transparent**, showing the print layer.",
      "As the mug cools, the topcoat **fades back** - ready for the next reveal.",
      "Tuned for daily beverages; rated for hundreds of normal heat cycles with proper care."],

      steps: [
      { label: "Cold", caption: "Opaque topcoat hides artwork" },
      { label: "Warm", caption: "Reveal begins" },
      { label: "Hot", caption: "Artwork fully visible" }],

      note: ""
    },
    fr: {
      title: "Comment fonctionne le changement de couleur",
      lede: "Un revêtement réactif à la chaleur cache votre impression lorsqu'elle est froide, puis devient transparent lorsque le mug se réchauffe - révélant l'art en dessous.",
      body: [
      "Les micro-capsules dans le revêtement extérieur réagissent autour de **45-60°C (113-140°F)**.",
      "Lorsque du liquide chaud est ajouté, la phase de colorant change et **devient transparente**, montrant la couche d'impression.",
      "Lorsque le mug refroidit, le revêtement supérieur **s'estompe** - prêt pour la prochaine révélation.",
      "Calibré pour les boissons quotidiennes ; évalué pour des centaines de cycles de chaleur normaux avec un entretien approprié."],

      steps: [
      { label: "Froid", caption: "Revêtement opaque cache l'œuvre" },
      { label: "Tiède", caption: "La révélation commence" },
      { label: "Chaud", caption: "Œuvre entièrement visible" }],

      note: "Copie éducative uniquement ; éviter les réclamations industrielles/médicales."
    }
  };

  const t = translations[language];

  // Mug mockup images for each state - BLACK mug for cold state
  const mugStates = [
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/premium-black-ceramic-coffee-mug-on-dark-5bf5203d-20251102222418.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-wh-c56af34f-20251111010258.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-wh-9943a187-20251111010255.jpg"];


  return (
    <section id="color-changing-how-it-works" className="py-24 bg-black">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-h2 font-bold text-white mb-6 text-center">{t.title}</h2>
          <p className="text-body-large text-light-gray mb-12 text-center max-w-3xl mx-auto">
            {t.lede}
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <ul className="space-y-6">
                {t.body.map((item, index) =>
                <li key={index} className="text-body text-light-gray">
                    <span dangerouslySetInnerHTML={{
                    __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
                  }} className="!whitespace-pre-line" />
                  </li>
                )}
              </ul>
              <p className="text-caption text-muted-foreground mt-8 italic !whitespace-pre-line">{t.note}</p>
            </div>

            {/* Stepper Visual with MUG MOCKUPS */}
            <div className="bg-dark-gray-1 rounded-lg p-8 border border-dark-gray-3">
              <div className="flex justify-between mb-8">
                {t.steps.map((step, index) =>
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`flex-1 text-center pb-4 border-b-2 transition-all duration-300 ${
                  activeStep === index ?
                  'border-primary text-white' :
                  'border-dark-gray-3 text-muted-foreground hover:text-light-gray'}`
                  }>

                    <div className="font-bold text-button">{step.label}</div>
                  </button>
                )}
              </div>

              {/* Mug Mockup Display */}
              <div className="aspect-square bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                {mugStates.map((mugImage, index) =>
                <div
                  key={index}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: activeStep === index ? 1 : 0 }}>

                    <Image
                    src={mugImage}
                    alt={`Color-changing mug in ${t.steps[index].label} state`}
                    fill
                    className="object-contain p-4" />

                  </div>
                )}
              </div>

              <p className="text-center mt-6 text-body text-light-gray">
                {t.steps[activeStep].caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}