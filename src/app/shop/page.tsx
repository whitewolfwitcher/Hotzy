"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Sparkles, Check, Globe, DollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/contexts/cart-context';
import { usePreferences } from '@/contexts/preferences-context';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  nameFr: string;
  price: number;
  description: string;
  descriptionEn: string;
  descriptionFr: string;
  image: string;
  features: string[];
  featuresEn: string[];
  featuresFr: string[];
  badge?: string;
  badgeEn?: string;
  badgeFr?: string;
}

const products: Product[] = [
{
  id: "standard-black",
  nameEn: "Classic Mug",
  nameFr: "Tasse Classique",
  name: "Classic Mug",
  price: 8.99,
  descriptionEn: "Transforms from black to white with heat",
  descriptionFr: "Se transforme du noir au blanc avec la chaleur",
  description: "Transforms from black to white with heat",
  image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/premium-black-ceramic-coffee-mug-on-dark-5bf5203d-20251102222418.jpg",
  featuresEn: ["High-quality ceramic", "Heat-activated color change", "Dishwasher safe", "11oz capacity"],
  featuresFr: ["Céramique de haute qualité", "Changement de couleur activé par la chaleur", "Lavable au lave-vaisselle", "Capacité de 11oz"],
  features: ["High-quality ceramic", "Heat-activated color change", "Dishwasher safe", "11oz capacity"],
  badgeEn: "Best Seller",
  badgeFr: "Meilleure Vente",
  badge: "Best Seller"
},
{
  id: "navy-blue",
  nameEn: "Blue Mug",
  nameFr: "Tasse Bleue",
  name: "Blue Mug",
  price: 8.99,
  descriptionEn: "Transforms from navy blue to white with heat",
  descriptionFr: "Se transforme du bleu marine au blanc avec la chaleur",
  description: "Transforms from navy blue to white with heat",
  image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/premium-black-ceramic-coffee-mug-on-dark-5bf5203d-20251102222418.jpg",
  featuresEn: ["High-quality ceramic", "Heat-activated color change", "Dishwasher safe", "11oz capacity"],
  featuresFr: ["Céramique de haute qualité", "Changement de couleur activé par la chaleur", "Lavable au lave-vaisselle", "Capacité de 11oz"],
  features: ["High-quality ceramic", "Heat-activated color change", "Dishwasher safe", "11oz capacity"]
},
{
  id: "red",
  nameEn: "Red Mug",
  nameFr: "Tasse Rouge",
  name: "Red Mug",
  price: 8.99,
  descriptionEn: "Transforms from red to white with heat",
  descriptionFr: "Se transforme du rouge au blanc avec la chaleur",
  description: "Transforms from red to white with heat",
  image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/premium-black-ceramic-coffee-mug-on-dark-5bf5203d-20251102222418.jpg",
  featuresEn: ["High-quality ceramic", "Heat-activated color change", "Dishwasher safe", "11oz capacity"],
  featuresFr: ["Céramique de haute qualité", "Changement de couleur activé par la chaleur", "Lavable au lave-vaisselle", "Capacité de 11oz"],
  features: ["High-quality ceramic", "Heat-activated color change", "Dishwasher safe", "11oz capacity"]
},
{
  id: "custom-photo",
  nameEn: "Custom Photo Mug",
  nameFr: "Tasse Photo Personnalisée",
  name: "Custom Photo Mug",
  price: 18.99,
  descriptionEn: "Upload your favorite memories",
  descriptionFr: "Téléchargez vos souvenirs préférés",
  description: "Upload your favorite memories",
  image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/white-ceramic-coffee-mug-with-custom-pho-80ef61e0-20251102222418.jpg",
  featuresEn: ["HD photo print", "Fade resistant", "Same-day processing", "11oz capacity"],
  featuresFr: ["Impression photo HD", "Résistant à la décoloration", "Traitement le jour même", "Capacité de 11oz"],
  features: ["HD photo print", "Fade resistant", "Same-day processing", "11oz capacity"]
}];


export default function ShopPage() {
  const [cart, setCart] = useState<string[]>([]);
  const { currency, setCurrency, language, setLanguage, convertPrice, getText } = usePreferences();
  const router = useRouter();
  const { addItem } = useCart();

  const handleCustomize = (product: Product) => {
    router.push('/customizer');
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      title: getText(product.nameEn, product.nameFr),
      thumbnail: product.image,
      payload: {
        productType: product.id,
        color: product.id
      },
      price: currency === 'CAD' ? product.price : parseFloat(convertPrice(product.price))
    });
    toast.success(getText("Added to cart!", "Ajouté au panier!"));
  };

  const handleOrderNow = (product: Product) => {
    handleAddToCart(product);
    router.push('/checkout');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    router.push('/checkout');
  };

  return (
    <div className="relative">
      {/* HOTZY Logo - Top Left - Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <div className="container py-8">
          <Link
            href="/"
            className="inline-block text-2xl font-black text-white hover:text-primary transition-colors pointer-events-auto">
            HOTZY
          </Link>
        </div>
      </div>

      {/* Currency and Language Toggles */}
      <div className="fixed top-0 right-0 z-[100] pointer-events-none">
        <div className="container py-8">
          <div className="flex justify-end gap-3 pointer-events-auto">
            <motion.button
              onClick={() => setCurrency(currency === 'CAD' ? 'USD' : 'CAD')}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-white">{currency}</span>
            </motion.button>

            <motion.button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-white">{language.toUpperCase()}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-black py-20 border-b border-border">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(118,185,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(118,185,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          <div className="container relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>

              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}>

                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary uppercase tracking-wider">
                  {getText("Premium Collection", "Collection Premium")}
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
                {getText("Shop Custom", "Boutique Personnalisée")}
                <span className="block bg-gradient-to-r from-primary via-[#9ACD32] to-primary bg-clip-text text-transparent">
                  Hotzy Mugs
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {getText(
                  "Discover our collection of premium mugs with cutting-edge technology and stunning designs",
                  "Découvrez notre collection de tasses premium avec une technologie de pointe et des designs époustouflants"
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) =>
              <motion.div
                key={product.id}
                className="group relative bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}>

                  {/* Badge */}
                  {product.badge &&
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                      {getText(product.badgeEn || product.badge, product.badgeFr || product.badge)}
                    </div>
                }

                  {/* Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-[#2A2A2A] to-black overflow-hidden">
                    <Image
                    src={product.image}
                    alt={getText(product.nameEn, product.nameFr)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500" />

                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    {/* Name and Price */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors !w-[114px] !h-14">
                        {getText(product.nameEn, product.nameFr)}
                      </h3>
                      <span className="text-2xl font-bold text-primary !w-[63px] !h-full">
                        {currency === 'CAD' ? '$' : '$'}{convertPrice(product.price)} {currency}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {getText(product.descriptionEn, product.descriptionFr)}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {(language === 'en' ? product.featuresEn : product.featuresFr).map((feature, idx) =>
                    <div key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                    )}
                    </div>

                    {/* Conditional Buttons based on product type */}
                    {product.id === 'custom-photo' ?
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomize(product);
                    }}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-[#9ACD32] transition-all flex items-center justify-center gap-2 hover:scale-105">

                        <Sparkles className="w-5 h-5" />
                        {getText("Customize Now", "Personnaliser Maintenant")}
                      </button> :

                  <div className="space-y-2">
                        <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderNow(product);
                      }}
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-[#9ACD32] transition-all flex items-center justify-center gap-2 hover:scale-105">

                          <Sparkles className="w-5 h-5" />
                          {getText("Order Now", "Commander Maintenant")}
                        </button>
                        <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-full px-6 py-3 bg-transparent border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2">

                          <ShoppingCart className="w-5 h-5" />
                          {getText("Add to Cart", "Ajouter au Panier")}
                        </button>
                      </div>
                  }
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-border">
          <div className="container">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {getText("Need Help Choosing?", "Besoin d'Aide Pour Choisir?")}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {getText(
                  "Try our interactive customizer to design your perfect mug in 3D",
                  "Essayez notre personnalisateur interactif pour concevoir votre tasse parfaite en 3D"
                )}
              </p>
              <Link
                href="/customizer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-[#9ACD32] transition-all hover:scale-105">

                <Sparkles className="w-5 h-5" />
                {getText("Open Customizer", "Ouvrir le Personnalisateur")}
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}