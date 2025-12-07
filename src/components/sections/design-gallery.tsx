"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import designs from '@/data/designs.json';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { usePreferences } from '@/contexts/preferences-context';

type FilterId = 'all' | 'anime' | 'floral' | 'abstract' | 'outdoors' | 'matte' | 'white';
type SortId = 'pop' | 'new';

const DesignGallery = () => {
  const router = useRouter();
  const { addItem } = useCart();
  const { currency, convertPrice, getText } = usePreferences();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [activeSort, setActiveSort] = useState<SortId>('pop');

  const filters = [
    { id: 'all' as FilterId, labelEn: 'All', labelFr: 'Tous' },
    { id: 'anime' as FilterId, labelEn: 'Anime / Chibi', labelFr: 'Anime / Chibi' },
    { id: 'floral' as FilterId, labelEn: 'Floral / Pattern', labelFr: 'Floral / Motif' },
    { id: 'abstract' as FilterId, labelEn: 'Abstract / Lines', labelFr: 'Abstrait / Lignes' },
    { id: 'outdoors' as FilterId, labelEn: 'Outdoors / Nature', labelFr: 'Extérieur / Nature' },
    { id: 'matte' as FilterId, labelEn: 'Matte Black', labelFr: 'Noir Mat' },
    { id: 'white' as FilterId, labelEn: 'Glossy White', labelFr: 'Blanc Brillant' },
  ];

  const sortOptions = [
    { id: 'pop' as SortId, labelEn: 'Most popular', labelFr: 'Plus populaire' },
    { id: 'new' as SortId, labelEn: 'Newest', labelFr: 'Plus récent' },
  ];

  const filteredDesigns = useMemo(() => {
    let filtered = [...designs];

    // Apply filters
    if (activeFilter !== 'all') {
      filtered = filtered.filter((design) => {
        switch (activeFilter) {
          case 'anime':
            return design.style === 'anime';
          case 'floral':
            return design.style === 'floral';
          case 'abstract':
            return design.style === 'abstract';
          case 'outdoors':
            return design.style === 'outdoors';
          case 'matte':
            return design.base_color === 'matte_black';
          case 'white':
            return design.base_color === 'gloss_white';
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (activeSort === 'new') {
      filtered.reverse();
    }

    return filtered;
  }, [activeFilter, activeSort]);

  const handleOrderNow = (design: typeof designs[0]) => {
    // Add to cart and redirect to checkout
    addItem({
      id: design.id,
      title: design.title,
      thumbnail: design.thumbnail,
      payload: design.payload_to_customizer,
      price: currency === 'CAD' ? 24.99 : parseFloat(convertPrice(24.99))
    });
    router.push('/checkout');
  };

  const handleAddToCart = (design: typeof designs[0]) => {
    // Just add to cart, stay on page
    addItem({
      id: design.id,
      title: design.title,
      thumbnail: design.thumbnail,
      payload: design.payload_to_customizer,
      price: currency === 'CAD' ? 24.99 : parseFloat(convertPrice(24.99))
    });
  };

  return (
    <section id="design-gallery" className="relative bg-gradient-to-b from-black via-[#1a1a1a] to-black py-32">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-eyebrow text-primary mb-4">
            {getText('EXPLORE DESIGNS', 'EXPLORER LES DESIGNS')}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {getText('Explore Designs', 'Explorer les Designs')}
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            {getText(
              'Pick a style and start customizing it in 3D.',
              'Choisissez un style et commencez à le personnaliser en 3D.'
            )}
          </p>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div
          className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-white border border-border'
                }`}
              >
                {getText(filter.labelEn, filter.labelFr)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {getText('Sort by:', 'Trier par:')}
            </span>
            <div className="flex gap-2">
              {sortOptions.map((sort) => (
                <button
                  key={sort.id}
                  onClick={() => setActiveSort(sort.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSort === sort.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:bg-accent hover:text-white border border-border'
                  }`}
                >
                  {getText(sort.labelEn, sort.labelFr)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.01 }}
            >
              {/* Image Container */}
              <div className="aspect-square relative bg-[#2a2a2a] overflow-hidden">
                <Image
                  src={design.thumbnail}
                  alt={`Mug preview of ${design.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-3">{design.title}</h3>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {design.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-accent text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(design)}
                    className="flex-1 py-2.5 rounded-lg font-semibold bg-accent text-white hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {getText('Add to Cart', 'Ajouter')}
                  </button>
                  <button
                    onClick={() => handleOrderNow(design)}
                    className="flex-1 py-2.5 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-[#9ACD32] transition-all"
                  >
                    {getText('Order Now', 'Commander')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDesigns.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground text-lg">
              {getText(
                'No designs found for this filter. Try selecting a different category.',
                'Aucun design trouvé pour ce filtre. Essayez de sélectionner une autre catégorie.'
              )}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DesignGallery;