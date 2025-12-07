"use client";

import { motion } from 'framer-motion';
import { Sparkles, Check, Zap, Crown, Shield } from 'lucide-react';
import { PricingTable } from '@/components/autumn/pricing-table';
import NavigationHeader from '@/components/sections/navigation-header';
import Footer from '@/components/sections/footer';

const productDetails = [
  {
    id: "hotzy_basic",
    description: "Perfect for exploring mug customization",
    items: [
      {
        primaryText: "Basic mug viewer access",
      },
      {
        primaryText: "3 design previews per month",
        secondaryText: "Generate and view custom designs",
      },
      {
        primaryText: "Standard ceramic only",
      },
    ],
  },
  {
    id: "hotzy_pro",
    description: "For serious mug enthusiasts",
    recommendText: "Most Popular",
    price: {
      primaryText: "$29/month",
      secondaryText: "billed monthly",
    },
    items: [
      {
        primaryText: "Unlimited design previews",
        secondaryText: "Generate as many designs as you want",
      },
      {
        primaryText: "Premium materials access",
        secondaryText: "Ceramic, stainless steel, thermal",
      },
      {
        primaryText: "10 custom design saves",
        secondaryText: "Save your favorite designs",
      },
      {
        primaryText: "AI-powered design suggestions",
      },
      {
        primaryText: "Standard shipping included",
      },
    ],
  },
  {
    id: "hotzy_premium",
    description: "Ultimate customization experience",
    price: {
      primaryText: "$79/month",
      secondaryText: "billed monthly",
    },
    items: [
      {
        primaryText: "Everything in Pro, plus:",
      },
      {
        primaryText: "Unlimited design saves",
      },
      {
        primaryText: "Priority AI design generation",
      },
      {
        primaryText: "Exclusive materials & finishes",
      },
      {
        primaryText: "3D printing customization",
      },
      {
        primaryText: "Express shipping included",
      },
      {
        primaryText: "Design collaboration tools",
      },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      
      <section className="relative py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(118,185,0,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(118,185,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(118,185,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container relative z-10">
          {/* Hero Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">Premium Plans</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-primary via-[#9ACD32] to-primary bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            
            <p className="text-xl text-light-gray max-w-3xl mx-auto leading-relaxed">
              Unlock premium features, unlimited customization, and exclusive materials.
              Start with our free tier or upgrade for the ultimate mug experience.
            </p>
          </motion.div>

          {/* Pricing Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <PricingTable productDetails={productDetails} />
          </motion.div>

          {/* Features Comparison */}
          <motion.div
            className="mt-32 mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Why Upgrade?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "Unlimited Creativity",
                  description: "Generate and preview unlimited designs with AI-powered suggestions"
                },
                {
                  icon: Crown,
                  title: "Premium Materials",
                  description: "Access exclusive materials, finishes, and 3D printing options"
                },
                {
                  icon: Shield,
                  title: "Priority Support",
                  description: "Express shipping, collaboration tools, and dedicated assistance"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-8 hover:border-primary/50 transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-light-gray leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[
              "30-Day Money-Back Guarantee",
              "Cancel Anytime",
              "Secure Payments",
              "24/7 Support"
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2 p-4 bg-card border border-border rounded-xl"
              >
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-white font-medium">{badge}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}