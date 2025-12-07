"use client";

import { motion } from 'framer-motion';
import { Check, Shield, Truck, CreditCard } from 'lucide-react';
import { usePreferences } from '@/contexts/preferences-context';

const CheckoutSection = () => {
  const { currency, convertPrice, getText } = usePreferences();

  const pricingTiers = [
    {
      name: getText("Standard", "Standard"),
      priceCAD: 24.99,
      descriptionEn: "Perfect for personal use",
      descriptionFr: "Parfait pour un usage personnel",
      featuresEn: [
        "High-quality ceramic mug",
        "Sublimation printing",
        "Dishwasher safe",
        "Standard shipping",
        "30-day guarantee"
      ],
      featuresFr: [
        "Tasse en céramique de haute qualité",
        "Impression par sublimation",
        "Lavable au lave-vaisselle",
        "Livraison standard",
        "Garantie de 30 jours"
      ],
      popular: false
    },
    {
      name: getText("Premium", "Premium"),
      priceCAD: 34.99,
      descriptionEn: "Our most popular choice",
      descriptionFr: "Notre choix le plus populaire",
      featuresEn: [
        "Premium ceramic material",
        "HD sublimation printing",
        "Dishwasher & microwave safe",
        "AR preview included",
        "Express shipping",
        "60-day guarantee"
      ],
      featuresFr: [
        "Matériau céramique premium",
        "Impression par sublimation HD",
        "Lave-vaisselle et micro-ondes",
        "Aperçu AR inclus",
        "Livraison express",
        "Garantie de 60 jours"
      ],
      popular: true
    },
    {
      name: getText("Deluxe", "Deluxe"),
      priceCAD: 44.99,
      descriptionEn: "For the ultimate experience",
      descriptionFr: "Pour l'expérience ultime",
      featuresEn: [
        "Ultra-premium porcelain",
        "Professional-grade printing",
        "All safety certifications",
        "Priority AR support",
        "Free overnight shipping",
        "90-day guarantee",
        "Gift packaging included"
      ],
      featuresFr: [
        "Porcelaine ultra-premium",
        "Impression de qualité professionnelle",
        "Toutes les certifications de sécurité",
        "Support AR prioritaire",
        "Livraison gratuite le lendemain",
        "Garantie de 90 jours",
        "Emballage cadeau inclus"
      ],
      popular: false
    }
  ];

  return (
    <section id="checkout" className="relative bg-gradient-to-b from-black via-[#1a1a1a] to-black py-32">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-eyebrow text-primary mb-4">
            {getText('PRICING', 'TARIFICATION')}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {getText('Choose Your Perfect Mug', 'Choisissez Votre Tasse Parfaite')}
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            {getText(
              'Select the quality tier that matches your needs. All mugs come with our satisfaction guarantee.',
              'Sélectionnez le niveau de qualité qui correspond à vos besoins. Toutes les tasses sont livrées avec notre garantie de satisfaction.'
            )}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              className={`relative bg-card border rounded-2xl p-8 ${
                tier.popular
                  ? 'border-primary shadow-xl shadow-primary/20 scale-105'
                  : 'border-border hover:border-primary/50'
              } transition-all duration-300`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  {getText('Most Popular', 'Plus Populaire')}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {getText(tier.descriptionEn, tier.descriptionFr)}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">
                    ${convertPrice(tier.priceCAD)}
                  </span>
                  <span className="text-muted-foreground">
                    {currency}/{getText('mug', 'tasse')}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.featuresEn.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {getText(tier.featuresEn[i], tier.featuresFr[i])}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  tier.popular
                    ? 'bg-primary text-primary-foreground hover:bg-[#9ACD32]'
                    : 'bg-accent text-white hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {getText(`Select ${tier.name}`, `Sélectionner ${tier.name}`)}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            {
              icon: Shield,
              titleEn: "Secure Checkout",
              titleFr: "Paiement Sécurisé",
              descriptionEn: "SSL encrypted payments",
              descriptionFr: "Paiements cryptés SSL"
            },
            {
              icon: CreditCard,
              titleEn: "Stripe Powered",
              titleFr: "Propulsé par Stripe",
              descriptionEn: "All major cards accepted",
              descriptionFr: "Toutes les cartes acceptées"
            },
            {
              icon: Truck,
              titleEn: "Fast Shipping",
              titleFr: "Livraison Rapide",
              descriptionEn: "2-5 business days",
              descriptionFr: "2-5 jours ouvrables"
            },
            {
              icon: Check,
              titleEn: "Money-Back",
              titleFr: "Remboursement",
              descriptionEn: "30-day guarantee",
              descriptionFr: "Garantie de 30 jours"
            }
          ].map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
            >
              <badge.icon className="w-8 h-8 text-primary mb-3" />
              <h4 className="text-white font-semibold mb-1">
                {getText(badge.titleEn, badge.titleFr)}
              </h4>
              <p className="text-sm text-muted-foreground">
                {getText(badge.descriptionEn, badge.descriptionFr)}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground mb-4">
            {getText('Accepted Payment Methods', 'Méthodes de Paiement Acceptées')}
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
              <div
                key={method}
                className="px-4 py-2 bg-card border border-border rounded-lg text-white text-sm font-medium"
              >
                {method}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CheckoutSection;