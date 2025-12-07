"use client";

import { motion } from 'framer-motion';
import { usePreferences } from '@/contexts/preferences-context';

const SpecificationsSection = () => {
  const { language } = usePreferences();

  const translations = {
    en: {
      eyebrow: "SPECIFICATIONS",
      title: "Technical Details",
      description: "Every detail carefully engineered for the perfect custom mug experience",
      specifications: [
        { label: "Material", value: "Premium Ceramic" },
        { label: "Capacity", value: "325ml / 11oz" },
        { label: "Height", value: "9.5cm / 3.7\"" },
        { label: "Diameter", value: "8cm / 3.1\"" },
        { label: "Weight", value: "312g" },
        { label: "Print Area", value: "2048×1024 px" },
        { label: "Care Instructions", value: "Easy Clean" },
        { label: "Dishwasher Safe", value: "Yes" },
        { label: "Microwave Safe", value: "Yes" },
        { label: "Handle", value: "Ergonomic C-shape" },
        { label: "Color", value: "White Base" },
        { label: "Finish", value: "Glossy" }
      ],
      cards: [
        {
          title: "Eco-Friendly",
          description: "Made from sustainable materials with environmentally conscious manufacturing",
          icon: "🌱"
        },
        {
          title: "FDA Approved",
          description: "Food-safe ceramic meets all international safety standards",
          icon: "✓"
        },
        {
          title: "Quality Tested",
          description: "Each mug undergoes rigorous quality control before shipping",
          icon: "⭐"
        }
      ]
    },
    fr: {
      eyebrow: "SPÉCIFICATIONS",
      title: "Détails techniques",
      description: "Chaque détail soigneusement conçu pour l'expérience de mug personnalisé parfaite",
      specifications: [
        { label: "Matériau", value: "Céramique premium" },
        { label: "Capacité", value: "325ml / 11oz" },
        { label: "Hauteur", value: "9.5cm / 3.7\"" },
        { label: "Diamètre", value: "8cm / 3.1\"" },
        { label: "Poids", value: "312g" },
        { label: "Zone d'impression", value: "2048×1024 px" },
        { label: "Instructions d'entretien", value: "Nettoyage facile" },
        { label: "Lave-vaisselle", value: "Oui" },
        { label: "Micro-ondes", value: "Oui" },
        { label: "Poignée", value: "Forme C ergonomique" },
        { label: "Couleur", value: "Base blanche" },
        { label: "Finition", value: "Brillante" }
      ],
      cards: [
        {
          title: "Écologique",
          description: "Fabriqué à partir de matériaux durables avec une fabrication respectueuse de l'environnement",
          icon: "🌱"
        },
        {
          title: "Approuvé FDA",
          description: "Céramique alimentaire conforme à toutes les normes de sécurité internationales",
          icon: "✓"
        },
        {
          title: "Testé qualité",
          description: "Chaque mug subit un contrôle qualité rigoureux avant expédition",
          icon: "⭐"
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <section id="specifications" className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-black py-32">
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

        {/* Specifications Grid */}
        <motion.div
          className="max-w-4xl mx-auto bg-card border border-border rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid sm:grid-cols-2 divide-x divide-y divide-border">
            {t.specifications.map((spec, index) => (
              <motion.div
                key={index}
                className="p-6 hover:bg-accent transition-colors group"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">
                    {spec.label}
                  </span>
                  <span className="text-white font-semibold group-hover:text-primary transition-colors">
                    {spec.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          {t.cards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="text-white font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecificationsSection;