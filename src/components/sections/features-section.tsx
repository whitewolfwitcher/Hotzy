"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Palette, Zap, Shield, Thermometer, Heart, Droplet, Flame, Sparkles } from 'lucide-react';
import { usePreferences } from '@/contexts/preferences-context';

const FeaturesSection = () => {
  const router = useRouter();
  const { language } = usePreferences();

  const translations = {
    en: {
      eyebrow: "FEATURES",
      title: "Everything You Need",
      description: "Premium quality meets cutting-edge technology in every Hotzy mug",
      cta: "Start Designing",
      ctaDescription: "Every mug comes with our satisfaction guarantee",
      features: [
        {
          icon: Palette,
          title: "Custom Design",
          description: "Upload any image and see it perfectly mapped to your mug in real-time 3D"
        },
        {
          icon: Zap,
          title: "Instant Preview",
          description: "Real-time rendering with WebGL technology for immediate visualization"
        },
        {
          icon: Thermometer,
          title: "Heat Retention",
          description: "Double-wall ceramic keeps drinks hot for longer while staying cool to touch"
        },
        {
          icon: Shield,
          title: "Dishwasher Safe",
          description: "Premium ceramic material that's built to last through hundreds of washes"
        },
        {
          icon: Heart,
          title: "Premium Quality",
          description: "Professional sublimation printing ensures vivid, long-lasting colors"
        },
        {
          icon: Droplet,
          title: "11oz Capacity",
          description: "Perfect size for your morning coffee, tea, or any hot beverage"
        },
        {
          icon: Flame,
          title: "Microwave Safe",
          description: "Heat your beverages safely without damaging your custom design"
        },
        {
          icon: Sparkles,
          title: "Gift Ready",
          description: "Beautiful packaging included - perfect for gifting to loved ones"
        }
      ]
    },
    fr: {
      eyebrow: "CARACTÉRISTIQUES",
      title: "Tout ce dont vous avez besoin",
      description: "Qualité premium et technologie de pointe dans chaque mug Hotzy",
      cta: "Commencer à concevoir",
      ctaDescription: "Chaque mug est livré avec notre garantie de satisfaction",
      features: [
        {
          icon: Palette,
          title: "Design personnalisé",
          description: "Téléchargez n'importe quelle image et voyez-la parfaitement appliquée sur votre mug en 3D temps réel"
        },
        {
          icon: Zap,
          title: "Aperçu instantané",
          description: "Rendu en temps réel avec technologie WebGL pour visualisation immédiate"
        },
        {
          icon: Thermometer,
          title: "Rétention de chaleur",
          description: "Céramique à double paroi garde les boissons chaudes plus longtemps tout en restant froide au toucher"
        },
        {
          icon: Shield,
          title: "Va au lave-vaisselle",
          description: "Matériau céramique premium conçu pour durer des centaines de lavages"
        },
        {
          icon: Heart,
          title: "Qualité premium",
          description: "Impression par sublimation professionnelle garantit des couleurs vives et durables"
        },
        {
          icon: Droplet,
          title: "Capacité 325ml",
          description: "Taille parfaite pour votre café du matin, thé ou toute boisson chaude"
        },
        {
          icon: Flame,
          title: "Va au micro-ondes",
          description: "Réchauffez vos boissons en toute sécurité sans endommager votre design personnalisé"
        },
        {
          icon: Sparkles,
          title: "Prêt à offrir",
          description: "Emballage magnifique inclus - parfait pour offrir à vos proches"
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <section id="features" className="relative bg-black py-24">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
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

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {t.features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-all duration-300" />
              
              {/* Content */}
              <div className="relative">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-muted-foreground mb-6">
            {t.ctaDescription}
          </p>
          <button 
            onClick={() => router.push('/customizer')}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:bg-[#9ACD32] transition-all transform hover:scale-105"
          >
            {t.cta}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;