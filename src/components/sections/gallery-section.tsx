"use client";

import { motion } from 'framer-motion';
import InfiniteMenu from '@/components/ui/infinite-menu';
import { usePreferences } from '@/contexts/preferences-context';

const galleryItems = [
  { 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-pr-527d1461-20251102031956.jpg",
    title: "Sunset Vibes",
    description: "Nature-inspired design with warm gradient colors perfect for your morning coffee ritual",
    link: "/customize"
  },
  { 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-pr-501f0abe-20251102031956.jpg",
    title: "Geometric Dreams",
    description: "Abstract geometric patterns with bold lines and modern aesthetics for the creative mind",
    link: "/customize"
  },
  { 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-pr-9a2243cb-20251102031957.jpg",
    title: "Coffee First",
    description: "Typography-focused design with bold statements for the coffee enthusiast",
    link: "/customize"
  },
  { 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-pr-36bd51fe-20251102031956.jpg",
    title: "Mountain Peak",
    description: "Majestic mountain landscapes bringing outdoor adventure to your desk",
    link: "/customize"
  },
  { 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-pr-b20acffb-20251102031956.jpg",
    title: "Retro Wave",
    description: "Synthwave aesthetics with vibrant neon colors from the 80s era",
    link: "/customize"
  },
  { 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-pr-c172b09f-20251102031955.jpg",
    title: "Minimalist",
    description: "Clean and simple design philosophy focusing on essential elements only",
    link: "/customize"
  },
  { 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-pr-0202d1a2-20251102031956.jpg",
    title: "Floral Bloom",
    description: "Delicate botanical illustrations celebrating the beauty of nature",
    link: "/customize"
  },
  { 
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/professional-product-photography-of-a-pr-ffd896b7-20251102031955.jpg",
    title: "Tech Grid",
    description: "Digital matrix patterns with futuristic technology-inspired design",
    link: "/customize"
  },
];

const GallerySection = () => {
  const { language } = usePreferences();

  const translations = {
    en: {
      eyebrow: "DESIGN GALLERY",
      title: "Pre-Made Masterpieces",
      description: "Explore our curated collection in 3D. Drag to rotate and discover professionally designed mugs.",
      instruction1: "🖱️ Drag to rotate",
      instruction2: "👆 Click center to customize",
      instruction3: `✨ ${galleryItems.length} premium designs`
    },
    fr: {
      eyebrow: "GALERIE DE DESIGNS",
      title: "Chefs-d'œuvre préfabriqués",
      description: "Explorez notre collection organisée en 3D. Faites glisser pour faire pivoter et découvrir des mugs conçus professionnellement.",
      instruction1: "🖱️ Glissez pour faire pivoter",
      instruction2: "👆 Cliquez au centre pour personnaliser",
      instruction3: `✨ ${galleryItems.length} designs premium`
    }
  };

  const t = translations[language];

  return (
    <section id="gallery" className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-black py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

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

        {/* 3D Infinite Gallery */}
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-border"
          style={{ height: '600px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <InfiniteMenu items={galleryItems} />
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-muted-foreground text-sm">
            <span className="inline-block mr-4">{t.instruction1}</span>
            <span className="inline-block mr-4">{t.instruction2}</span>
            <span className="inline-block">{t.instruction3}</span>
          </p>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
    </section>
  );
};

export default GallerySection;