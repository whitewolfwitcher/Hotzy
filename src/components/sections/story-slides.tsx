"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { usePreferences } from '@/contexts/preferences-context';

const StorySlides = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const { language } = usePreferences();

  const translations = {
    en: {
      eyebrow: "HOW IT WORKS",
      title: "From Design to Delivery",
      description: "Two simple steps to get your perfect custom mug",
      slides: [
        {
          id: 2,
          title: "Secure Checkout",
          subtitle: "Fast & Safe",
          description: "Complete your order with confidence through Stripe's secure payment processing.",
          features: ["Encrypted payments", "Global shipping", "30-day guarantee"],
          color: "#76B900",
          image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/elegant-secure-checkout-interface-design-b00041a1-20251031005621.jpg"
        }
      ]
    },
    fr: {
      eyebrow: "COMMENT ÇA MARCHE",
      title: "De la conception à la livraison",
      description: "Deux étapes simples pour obtenir votre mug personnalisé parfait",
      slides: [
        {
          id: 2,
          title: "Paiement sécurisé",
          subtitle: "Rapide et sûr",
          description: "Finalisez votre commande en toute confiance grâce au traitement de paiement sécurisé de Stripe.",
          features: ["Paiements cryptés", "Expédition mondiale", "Garantie de 30 jours"],
          color: "#76B900",
          image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/elegant-secure-checkout-interface-design-b00041a1-20251031005621.jpg"
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <section id="story" ref={containerRef} className="relative bg-black py-32 overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: useTransform(
            scrollYProgress,
            [0, 0.33, 0.66, 1],
            [
              "radial-gradient(circle at 0% 0%, #FF6B6B33 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, #4ECDC433 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #76B90033 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, #FF6B6B33 0%, transparent 50%)"
            ]
          )
        }}
      />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-eyebrow text-primary mb-4">{t.eyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.title}
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            {t.description}
          </p>
        </motion.div>

        {/* Slides */}
        <div className="space-y-32">
          {t.slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className="relative"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content Side */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-black"
                        style={{ backgroundColor: slide.color }}
                      >
                        {slide.id}
                      </div>
                      <span className="text-eyebrow" style={{ color: slide.color }}>
                        {slide.subtitle}
                      </span>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                      {slide.title}
                    </h3>

                    <p className="text-body-large text-muted-foreground mb-8">
                      {slide.description}
                    </p>

                    <ul className="space-y-4">
                      {slide.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${slide.color}33` }}
                          >
                            <svg className="w-4 h-4" style={{ color: slide.color }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-white">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Visual Side */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <motion.div
                    className="relative aspect-square rounded-2xl overflow-hidden border border-border"
                    style={{
                      background: `linear-gradient(135deg, ${slide.color}22 0%, #1a1a1a 100%)`
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Corner brackets */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/50" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/50" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/50" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StorySlides;