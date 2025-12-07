"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Palette, Sparkles, Zap, Check } from 'lucide-react';
import InteractiveMug from '@/components/ui/interactive-mug';
import Image from 'next/image';
import { toast } from 'sonner';
import { usePreferences } from '@/contexts/preferences-context';

const MugStudio = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#76B900');
  const [selectedDesign, setSelectedDesign] = useState<'black' | 'white'>('black');
  const { currency, convertPrice, getText } = usePreferences();
  
  // Single premium mug model used for all angles
  const singleMugModel = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/premium-black-ceramic-coffee-mug-with-vi-62294a56-20251102032641.jpg";
  
  const demo3DImages = [
    singleMugModel,
    singleMugModel,
    singleMugModel,
    singleMugModel,
    singleMugModel,
    singleMugModel,
    singleMugModel,
    singleMugModel
  ];

  const colors = [
    { name: 'Acid Green', value: '#76B900' },
    { name: 'Electric Blue', value: '#00B8D4' },
    { name: 'Neon Pink', value: '#FF006E' },
    { name: 'Cyber Purple', value: '#8B5CF6' },
    { name: 'Solar Orange', value: '#FF6B35' },
  ];

  // Helper function to resize image to 800x800
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = document.createElement('img');
        
        img.onload = () => {
          // Create canvas with 800x800 dimensions
          const canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 800;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Calculate scaling to fit image within 800x800 while maintaining aspect ratio
          const scale = Math.min(800 / img.width, 800 / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          
          // Center the image on canvas
          const x = (800 - scaledWidth) / 2;
          const y = (800 - scaledHeight) / 2;
          
          // Fill background with white
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 800, 800);
          
          // Draw resized image
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          
          // Convert canvas to data URL
          resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        setUploadedImage(resizedImage);
        toast.success("Design preview generated (800x800)!");
      } catch (error) {
        console.error('Error resizing image:', error);
        toast.error("Failed to process image");
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const resizedImage = await resizeImage(file);
        setUploadedImage(resizedImage);
        toast.success("Design preview generated (800x800)!");
      } catch (error) {
        console.error('Error resizing image:', error);
        toast.error("Failed to process image");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    toast.success("Color applied!");
  };

  const imagesToShow = uploadedImage ? [uploadedImage, ...demo3DImages.slice(0, 7)] : demo3DImages;

  return (
    <section id="customizer" className="relative bg-black py-32 overflow-hidden">
      {/* Futuristic background image */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/futuristic-premium-mug-customization-stu-0dfd247e-20251102033429.jpg"
          alt="Mug Studio Background"
          fill
          className="object-cover"
        />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(118,185,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(118,185,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {getText('AI-Powered Studio', 'Studio IA')}
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            {getText('Customize Your', 'Personnalisez Votre')}
            <span className="block bg-gradient-to-r from-primary via-[#9ACD32] to-primary bg-clip-text text-transparent">
              {getText('Perfect Mug', 'Tasse Parfaite')}
            </span>
          </h2>
          
          <p className="text-xl text-light-gray max-w-3xl mx-auto leading-relaxed">
            {getText(
              'Experience next-generation 3D customization with real-time preview, AI-enhanced design tools, and instant visualization.',
              'Découvrez la personnalisation 3D de nouvelle génération avec aperçu en temps réel, outils de conception améliorés par l\'IA et visualisation instantanée.'
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
          {/* Left - 3D Mug Preview */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Main preview card */}
              <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#0d0d0d] to-black border border-primary/20 rounded-3xl p-12 aspect-square shadow-2xl">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-primary rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary rounded-br-3xl" />

                {/* Mug preview */}
                <div className="w-full h-full">
                  <InteractiveMug 
                    images={imagesToShow}
                    color={selectedColor}
                    rotationSpeed={10}
                  />
                </div>

                {/* Status indicator */}
                {uploadedImage && (
                  <motion.div
                    className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-xl border border-primary/50 rounded-full"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.6 }}
                  >
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">
                      {getText('Custom Design Active', 'Design Personnalisé Actif')}
                    </span>
                  </motion.div>
                )}

                {/* Rotation indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-primary/30 rounded-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="text-xs font-semibold text-white">
                    {getText('360° Real-Time Preview', 'Aperçu en Temps Réel 360°')}
                  </span>
                </div>
              </div>

              {/* Floating stats */}
              <motion.div
                className="absolute -bottom-6 left-8 right-8 grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/30 rounded-xl p-4 text-center backdrop-blur-xl">
                  <div className="text-2xl font-black text-primary">8K</div>
                  <div className="text-xs text-light-gray">{getText('Resolution', 'Résolution')}</div>
                </div>
                <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/30 rounded-xl p-4 text-center backdrop-blur-xl">
                  <div className="text-2xl font-black text-primary">24h</div>
                  <div className="text-xs text-light-gray">{getText('Production', 'Production')}</div>
                </div>
                <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/30 rounded-xl p-4 text-center backdrop-blur-xl">
                  <div className="text-2xl font-black text-primary">{getText('Free', 'Gratuit')}</div>
                  <div className="text-xs text-light-gray">{getText('Shipping', 'Livraison')}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Customization Controls */}
          <motion.div
            className="lg:col-span-5 space-y-6 lg:mt-0 mt-12"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Design Selector */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {getText('Design Style', 'Style de Design')}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setSelectedDesign('black')}
                  className={`relative aspect-square rounded-xl border-2 transition-all overflow-hidden group ${
                    selectedDesign === 'black'
                      ? 'border-primary scale-105 shadow-lg shadow-primary/20'
                      : 'border-primary/20 hover:border-primary/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-[#1A1A1A] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {getText('Dark', 'Sombre')}
                    </span>
                  </div>
                  {selectedDesign === 'black' && (
                    <motion.div
                      className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <Check className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setSelectedDesign('white')}
                  className={`relative aspect-square rounded-xl border-2 transition-all overflow-hidden group ${
                    selectedDesign === 'white'
                      ? 'border-primary scale-105 shadow-lg shadow-primary/20'
                      : 'border-primary/20 hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center transition-all duration-300"
                    whileHover={{ 
                      background: 'linear-gradient(to bottom right, #FFFFFF, #F5F5F5)'
                    }}
                  >
                    <motion.span 
                      className="font-bold text-lg text-white transition-colors duration-300"
                      whileHover={{ color: '#000000' }}
                    >
                      {getText('Light', 'Clair')}
                    </motion.span>
                  </motion.div>
                  {selectedDesign === 'white' && (
                    <motion.div
                      className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <Check className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {getText('Upload Design', 'Télécharger Design')}
                </h3>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-primary/30 bg-black/40 hover:border-primary/60 hover:bg-black/60'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-primary to-[#9ACD32] rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring" }}
                    >
                      <Upload className="w-8 h-8 text-black" />
                    </motion.div>
                    <div>
                      <p className="text-white font-semibold mb-1">
                        {getText('Drop your image here', 'Déposez votre image ici')}
                      </p>
                      <p className="text-sm text-light-gray">
                        {getText('or click to browse', 'ou cliquez pour parcourir')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {getText(
                          'JPG, PNG, SVG • Max 10MB • Resized to 800x800',
                          'JPG, PNG, SVG • Max 10MB • Redimensionné à 800x800'
                        )}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Color Selector */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {getText('Glow Color', 'Couleur de Lueur')}
                </h3>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <motion.button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`relative aspect-square rounded-xl border-2 transition-all ${
                      selectedColor === color.value
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-transparent hover:border-white/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              className="w-full bg-gradient-to-r from-primary via-[#9ACD32] to-primary text-black font-black text-lg py-5 rounded-xl hover:shadow-[0_0_30px_rgba(118,185,0,0.5)] transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              {getText('Add to Cart', 'Ajouter au Panier')} - ${convertPrice(18.99)} {currency}
              <Sparkles className="w-5 h-5" />
            </motion.button>

            {/* Features List */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6 shadow-xl space-y-3">
              {[
                { en: 'Real-time 3D preview', fr: 'Aperçu 3D en temps réel' },
                { en: 'AI-enhanced rendering', fr: 'Rendu amélioré par IA' },
                { en: 'Dishwasher safe printing', fr: 'Impression lavable au lave-vaisselle' },
                { en: 'Premium ceramic quality', fr: 'Qualité céramique premium' },
                { en: 'Lifetime warranty', fr: 'Garantie à vie' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.en}
                  className="flex items-center gap-3 text-light-gray"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">{getText(feature.en, feature.fr)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MugStudio;