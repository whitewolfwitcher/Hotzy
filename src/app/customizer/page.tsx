"use client";

import dynamic from 'next/dynamic';
import NavigationHeader from '@/components/sections/navigation-header';
import Footer from '@/components/sections/footer';
import { Upload, Grid3x3, Check, Sparkles, Zap, Package, Truck, Shield, Move, ArrowLeft, ArrowRight, RotateCw, Image as ImageIcon, X, Copy, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/cart-context';
import { useRouter } from 'next/navigation';
import { usePreferences } from '@/contexts/preferences-context';
import { CAD_TO_USD, PRICE_CAD } from '@/lib/pricing';

// Dynamically import the 3D viewer to avoid SSR issues
const MugViewer = dynamic(() => import('@/components/3d/mug-viewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading 3D Viewer...</p>
      </div>
    </div>
  ),
});

// Dynamically import CircularGallery to avoid SSR issues
const CircularGallery = dynamic(() => import('@/components/3d/CircularGallery'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Gallery...</p>
      </div>
    </div>
  ),
});

// Design Templates
const DESIGN_TEMPLATES = [
  {
    id: 'geometric',
    name: 'Geometric Pattern',
    nameFr: 'Motif Géométrique',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/minimalist-geometric-pattern-design-with-bc266fca-20251110004625.jpg',
    category: 'minimalist'
  },
  {
    id: 'watercolor',
    name: 'Abstract Watercolor',
    nameFr: 'Aquarelle Abstraite',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/abstract-artistic-watercolor-pattern-wit-7a44e702-20251110002742.jpg',
    category: 'artistic'
  },
  {
    id: 'botanical',
    name: 'Botanical Nature',
    nameFr: 'Nature Botanique',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/botanical-nature-illustration-with-delic-3550a964-20251110002742.jpg',
    category: 'nature'
  },
  {
    id: 'motivation',
    name: 'Stay Positive',
    nameFr: 'Restez Positif',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/motivational-typography-design-with-stay-15f1157b-20251110002742.jpg',
    category: 'quotes'
  },
  {
    id: 'retro',
    name: 'Retro Groovy',
    nameFr: 'Rétro Groovy',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/retro-groovy-geometric-pattern-with-bold-f85a21d2-20251110004626.jpg',
    category: 'artistic'
  },
  {
    id: 'kawaii',
    name: 'Kawaii Coffee',
    nameFr: 'Café Kawaii',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/cute-kawaii-pattern-with-small-coffee-be-365025da-20251109175917.jpg',
    category: 'minimalist'
  },
  {
    id: 'mountain',
    name: 'Mountain Landscape',
    nameFr: 'Paysage Montagne',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/mountain-landscape-silhouette-design-min-44e956c8-20251109175917.jpg',
    category: 'nature'
  },
  {
    id: 'anime',
    name: 'Anime Kawaii',
    nameFr: 'Anime Kawaii',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/cute-anime-style-pattern-design-with-kaw-08360faa-20251110010149.jpg',
    category: 'artistic'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    nameFr: 'Cyberpunk Néon',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/cyberpunk-neon-pattern-design-with-elect-2567b26d-20251110010149.jpg',
    category: 'artistic'
  },
  {
    id: 'typography-dream',
    name: 'Dream Typography',
    nameFr: 'Typographie Dream',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/minimalist-black-and-white-typography-de-673eaa0e-20251110010404.jpg',
    category: 'quotes'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Space',
    nameFr: 'Espace Cosmique',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/cosmic-space-pattern-design-with-swirlin-6cf1076a-20251110010407.jpg',
    category: 'artistic'
  },
  {
    id: 'japanese-wave',
    name: 'Japanese Wave',
    nameFr: 'Vague Japonaise',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/elegant-japanese-wave-pattern-design-ins-c3870911-20251110010405.jpg',
    category: 'minimalist'
  },
  {
    id: 'gothic',
    name: 'Gothic Victorian',
    nameFr: 'Gothique Victorien',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/gothic-dark-pattern-with-ornate-victoria-a1fff3ca-20251110010407.jpg',
    category: 'artistic'
  },
  {
    id: 'tropical',
    name: 'Tropical Paradise',
    nameFr: 'Paradis Tropical',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/tropical-paradise-pattern-with-monstera--99a93a9e-20251110010407.jpg',
    category: 'nature'
  },
  {
    id: 'memphis',
    name: 'Memphis 80s',
    nameFr: 'Memphis 80s',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/memphis-design-pattern-with-bold-geometr-e926e9cc-20251110010408.jpg',
    category: 'artistic'
  },
  {
    id: 'coffee-beans-minimal',
    name: 'Coffee Beans Minimal',
    nameFr: 'Grains de Café Minimal',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/minimalist-repeating-pattern-design-with-485fb06e-20251110010613.jpg',
    category: 'minimalist'
  },
  {
    id: 'coffee-watercolor',
    name: 'Coffee Watercolor',
    nameFr: 'Café Aquarelle',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/artistic-watercolor-illustration-pattern-7772371b-20251110010614.jpg',
    category: 'artistic'
  },
  {
    id: 'coffee-vintage',
    name: 'Vintage Coffee',
    nameFr: 'Café Vintage',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/vintage-retro-coffee-beans-pattern-desig-a45729cb-20251110010613.jpg',
    category: 'artistic'
  },
  {
    id: 'coffee-geometric',
    name: 'Geometric Coffee',
    nameFr: 'Café Géométrique',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/modern-abstract-geometric-pattern-design-7b2ca45e-20251110010613.jpg',
    category: 'minimalist'
  },
  {
    id: 'chibi-ninja',
    name: 'Chibi Ninja',
    nameFr: 'Ninja Chibi',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/chibi-ninja-character-pattern-design-for-e5b1af83-20251111020142.jpg',
    category: 'artistic'
  },
  {
    id: 'botanical-haven',
    name: 'Botanical Haven',
    nameFr: 'Havre Botanique',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/botanical-pattern-design-for-mug-printin-518aede2-20251111020142.jpg',
    category: 'nature'
  },
  {
    id: 'street-art-burst',
    name: 'Street Art Burst',
    nameFr: 'Explosion Street Art',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/street-art-graffiti-pattern-design-for-m-6daddf0e-20251111020142.jpg',
    category: 'artistic'
  },
  {
    id: 'tropical-paradise-explore',
    name: 'Tropical Paradise',
    nameFr: 'Paradis Tropical',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/tropical-paradise-pattern-design-for-mug-6d3c0cc3-20251111020142.jpg',
    category: 'nature'
  },
  {
    id: 'neural-illusion',
    name: 'Neural Illusion',
    nameFr: 'Illusion Neuronale',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/neural-network-pattern-design-for-mug-pr-600ccaf7-20251111020142.jpg',
    category: 'artistic'
  },
  {
    id: 'zen-wave',
    name: 'Zen Wave',
    nameFr: 'Vague Zen',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/zen-wave-japanese-pattern-design-for-mug-2de3ea0e-20251111020141.jpg',
    category: 'minimalist'
  },
  {
    id: 'sunrise-mist',
    name: 'Sunrise Mist',
    nameFr: 'Brume du Lever du Soleil',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/sunrise-mist-gradient-pattern-design-for-dbc2aa7a-20251111020142.jpg',
    category: 'artistic'
  }
];

export default function CustomizerPage() {
  const [sectionImages, setSectionImages] = useState<{
    section1: string | null;
    section2: string | null;
    section3: string | null;
  }>({
    section1: null,
    section2: null,
    section3: null,
  });
  
  // Track which images are uploaded vs template
  const [imageTypes, setImageTypes] = useState<{
    section1: 'uploaded' | 'template' | null;
    section2: 'uploaded' | 'template' | null;
    section3: 'uploaded' | 'template' | null;
  }>({
    section1: null,
    section2: null,
    section3: null,
  });
  
  const [activeSection, setActiveSection] = useState<'section1' | 'section2' | 'section3'>('section1');
  const [isDragging, setIsDragging] = useState(false);
  const [applyTemplateToAll, setApplyTemplateToAll] = useState(false);
  const [cupType, setCupType] = useState<'hotzy' | 'standard'>('hotzy');
  const [testOrderId, setTestOrderId] = useState('');
  const [wrapUploadStatus, setWrapUploadStatus] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderNowStatus, setOrderNowStatus] = useState<string | null>(null);
  
  // Image position controls
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageRotation, setImageRotation] = useState(0);
  
  // Track if we're on desktop (for auto-expand sections)
  const [isDesktop, setIsDesktop] = useState(false);
  
  // NEW: Mobile section collapse states
  const [expandedSections, setExpandedSections] = useState({
    upload: true,
    position: false,
    templates: false,
    pricing: false,
    details: false,
  });

  // Check if we're on desktop on mount and window resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const { addItem } = useCart();
  const router = useRouter();
  const { currency, getText } = usePreferences();

  // Calculate number of uploaded images (not templates)
  const uploadedImageCount = Object.values(imageTypes).filter(type => type === 'uploaded').length;

  const basePriceCad = PRICE_CAD[cupType];
  const displayPriceAmount = currency === 'USD' ? basePriceCad * CAD_TO_USD : basePriceCad;
  const displayPrice = `$${new Intl.NumberFormat('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(displayPriceAmount)} ${currency}`;

  // Get current active section image
  const currentSectionImage = sectionImages[activeSection];
  const currentSectionType = imageTypes[activeSection];

  // Helper function to resize image to 800x800
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 800;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          const scale = Math.min(800 / img.width, 800 / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          
          const x = (800 - scaledWidth) / 2;
          const y = (800 - scaledHeight) / 2;
          
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 800, 800);
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          
          resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.crossOrigin = "anonymous";
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Generate mug mockup thumbnail with the custom design
  const generateMugThumbnail = (designImages: typeof sectionImages): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('/placeholder-mug.png');
        return;
      }

      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);

      // Draw mug body (simplified black mug shape)
      ctx.fillStyle = '#1a1a1a';
      
      // Mug body - rounded rectangle
      const mugX = 100;
      const mugY = 80;
      const mugWidth = 200;
      const mugHeight = 240;
      const radius = 20;
      
      ctx.beginPath();
      ctx.moveTo(mugX + radius, mugY);
      ctx.lineTo(mugX + mugWidth - radius, mugY);
      ctx.quadraticCurveTo(mugX + mugWidth, mugY, mugX + mugWidth, mugY + radius);
      ctx.lineTo(mugX + mugWidth, mugY + mugHeight - radius);
      ctx.quadraticCurveTo(mugX + mugWidth, mugY + mugHeight, mugX + mugWidth - radius, mugY + mugHeight);
      ctx.lineTo(mugX + radius, mugY + mugHeight);
      ctx.quadraticCurveTo(mugX, mugY + mugHeight, mugX, mugY + mugHeight - radius);
      ctx.lineTo(mugX, mugY + radius);
      ctx.quadraticCurveTo(mugX, mugY, mugX + radius, mugY);
      ctx.closePath();
      ctx.fill();

      // Draw handle
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.arc(320, 180, 40, -Math.PI / 2, Math.PI / 2, false);
      ctx.stroke();

      if (designImages) {
        // Load and draw the custom design
        const img = new Image();
        img.onload = () => {
          // Draw design on mug with perspective effect
          const designX = mugX + 30;
          const designY = mugY + 60;
          const designWidth = mugWidth - 60;
          const designHeight = 120;
          
          ctx.save();
          
          // Clip to mug area
          ctx.beginPath();
          ctx.rect(mugX + 20, mugY + 40, mugWidth - 40, mugHeight - 80);
          ctx.clip();
          
          // Draw the design
          ctx.drawImage(img, designX, designY, designWidth, designHeight);
          
          ctx.restore();
          
          // Add subtle highlights for realism
          const gradient = ctx.createLinearGradient(mugX, mugY, mugX + mugWidth, mugY);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(mugX + radius, mugY);
          ctx.lineTo(mugX + mugWidth - radius, mugY);
          ctx.quadraticCurveTo(mugX + mugWidth, mugY, mugX + mugWidth, mugY + radius);
          ctx.lineTo(mugX + mugWidth, mugY + mugHeight - radius);
          ctx.quadraticCurveTo(mugX + mugWidth, mugY + mugHeight, mugX + mugWidth - radius, mugY + mugHeight);
          ctx.lineTo(mugX + radius, mugY + mugHeight);
          ctx.quadraticCurveTo(mugX, mugY + mugHeight, mugX, mugY + mugHeight - radius);
          ctx.lineTo(mugX, mugY + radius);
          ctx.quadraticCurveTo(mugX, mugY, mugX + radius, mugY);
          ctx.closePath();
          ctx.fill();
          
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
          resolve(canvas.toDataURL('image/png'));
        };
        img.crossOrigin = "anonymous";
        img.src = designImages[activeSection] || '';
      } else {
        // Just return the plain mug
        resolve(canvas.toDataURL('image/png'));
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        applyDesignToSections(resizedImage, 'uploaded');
      } catch (error) {
        console.error('Error resizing image:', error);
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
        applyDesignToSections(resizedImage, 'uploaded');
      } catch (error) {
        console.error('Error resizing image:', error);
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

  const applyDesignToSections = (
    designImage: string,
    imageType: 'uploaded' | 'template'
  ) => {
    if (applyTemplateToAll) {
      setSectionImages({
        section1: designImage,
        section2: designImage,
        section3: designImage,
      });
      setImageTypes({
        section1: imageType,
        section2: imageType,
        section3: imageType,
      });
    } else {
      setSectionImages(prev => ({
        ...prev,
        [activeSection]: designImage
      }));
      setImageTypes(prev => ({
        ...prev,
        [activeSection]: imageType
      }));
    }
  };

  const handleTemplateSelect = (templateImage: string) => {
    applyDesignToSections(templateImage, 'template');
    // Reset position controls when selecting a template
    setImagePosition({ x: 0, y: 0 });
    setImageRotation(0);
  };

  const handleRemoveImage = (section: 'section1' | 'section2' | 'section3') => {
    setSectionImages(prev => ({
      ...prev,
      [section]: null
    }));
    setImageTypes(prev => ({
      ...prev,
      [section]: null
    }));
  };

  // NEW: Duplicate current image to all sections
  const handleDuplicateToAll = () => {
    if (!currentSectionImage) return;
    
    setSectionImages({
      section1: currentSectionImage,
      section2: currentSectionImage,
      section3: currentSectionImage,
    });
    setImageTypes({
      section1: currentSectionType,
      section2: currentSectionType,
      section3: currentSectionType,
    });
  };

  const resetPositionControls = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageRotation(0);
  };

  // New button-based position controls
  const moveImage = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 0.05;
    setImagePosition(prev => {
      switch (direction) {
        case 'up':
          return { ...prev, y: Math.max(prev.y - step, -0.5) };
        case 'down':
          return { ...prev, y: Math.min(prev.y + step, 0.5) };
        case 'left':
          return { ...prev, x: Math.min(prev.x + step, 0.5) };
        case 'right':
          return { ...prev, x: Math.max(prev.x - step, -0.5) };
        default:
          return prev;
      }
    });
  };

  const handleAddToCart = async () => {
    // Generate mug mockup thumbnail
    const mugThumbnail = await generateMugThumbnail(sectionImages);
    
    addItem({
      id: `custom-mug-${Date.now()}`,
      title: uploadedImageCount > 0 ? getText('Custom Design Mug', 'Tasse Design Personnalisé') : getText('Premium Black Mug', 'Tasse Noire Premium'),
      thumbnail: mugThumbnail,
      payload: {
        sectionImages: sectionImages,
        layoutMode: 'triple', // Always use 3-section mode
        productType: 'custom-mug',
        imageCount: uploadedImageCount,
      },
      price: basePriceCad,
    });
  };

  const createWrapBlob = async (): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas unavailable');
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sections = ['section1', 'section2', 'section3'] as const;
    const sectionWidth = canvas.width / 3;
    const sectionHeight = canvas.height;

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
      });

    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i];
      const imageSrc = sectionImages[section];
      const x = i * sectionWidth;

      if (imageSrc) {
        try {
          const img = await loadImage(imageSrc);
          const scale = Math.min(sectionWidth / img.width, sectionHeight / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const offsetX = x + (sectionWidth - scaledWidth) / 2;
          const offsetY = (sectionHeight - scaledHeight) / 2;
          ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        } catch {
          ctx.fillStyle = '#f2f2f2';
          ctx.fillRect(x, 0, sectionWidth, sectionHeight);
        }
      } else {
        ctx.fillStyle = '#f2f2f2';
        ctx.fillRect(x, 0, sectionWidth, sectionHeight);
        ctx.fillStyle = '#999999';
        ctx.font = 'bold 32px Arial';
        ctx.fillText('EMPTY', x + 40, 80);
      }
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    });
  };

  const handleOrderNow = async () => {
    if (isOrdering) return;
    setIsOrdering(true);
    setOrderNowStatus(getText('Preparing design…', 'Préparation du design…'));

    try {
      const amountForCurrency = Number(
        (currency === 'USD' ? basePriceCad * CAD_TO_USD : basePriceCad).toFixed(2)
      );
      const draftResponse = await fetch('/api/orders/create-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cupType,
          currency,
          amount_cad: currency === 'CAD' ? amountForCurrency : undefined,
          amount_usd: currency === 'USD' ? amountForCurrency : undefined,
        }),
      });

      if (!draftResponse.ok) {
        setOrderNowStatus(getText('Failed to create order', 'Échec création'));
        setIsOrdering(false);
        return;
      }

      const draftData = await draftResponse.json();
      const orderId = draftData.orderId as string;
      const orderUploadToken = draftData.orderUploadToken as string;

      setOrderNowStatus(getText('Uploading…', 'Téléversement…'));
      const wrapBlob = await createWrapBlob();
      const formData = new FormData();
      formData.append('file', wrapBlob, 'wrap.png');

      const uploadResponse = await fetch(`/api/orders/${orderId}/wrap`, {
        method: 'POST',
        headers: { 'x-order-upload-token': orderUploadToken },
        body: formData,
      });

      if (!uploadResponse.ok) {
        setOrderNowStatus(getText('Upload failed', 'Échec téléversement'));
        setIsOrdering(false);
        return;
      }

      setOrderNowStatus(getText('Redirecting…', 'Redirection…'));
      router.push(`/checkout?orderId=${orderId}`);
      return;
    } catch (error) {
      setOrderNowStatus(getText('Something went wrong', 'Erreur'));
    } finally {
      setIsOrdering(false);
    }
  };

  const showDevTools = process.env.NODE_ENV !== 'production';

  const createTestWrapBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas unavailable'));
        return;
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 64px Arial';
      ctx.fillText('TEST WRAP', 80, 140);
      ctx.font = '32px Arial';
      ctx.fillText('Hotzy Customizer', 80, 220);
      ctx.fillStyle = '#76B900';
      ctx.fillRect(80, 260, 320, 12);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    });
  };

  const handleUploadTestWrap = async () => {
    if (!testOrderId) {
      setWrapUploadStatus('Missing order id');
      return;
    }
    setWrapUploadStatus('Uploading...');
    try {
      const blob = await createTestWrapBlob();
      const formData = new FormData();
      formData.append('file', blob, 'wrap.png');

      const response = await fetch(`/api/orders/${testOrderId}/wrap`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setWrapUploadStatus('Upload failed');
        return;
      }

      const result = await response.json();
      setWrapUploadStatus(`Uploaded: ${result.wrap_path || 'ok'}`);
    } catch (error) {
      setWrapUploadStatus('Upload error');
    }
  };


  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Clear background with subtle grid and glow */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(118,185,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(118,185,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Radial glow effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="relative z-10">
        <NavigationHeader />
      
        <main className="container py-8 md:py-12 lg:py-20">
          {/* Header */}
          <motion.div
            className="text-center mb-8 md:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 md:mb-6 leading-tight px-4 lg:whitespace-nowrap">
              {getText('Design Your', 'Concevez Votre')}{' '}
              <span className="bg-gradient-to-r from-primary via-[#9ACD32] to-primary bg-clip-text text-transparent">
                {getText('Perfect Mug', 'Tasse Parfaite')}
              </span>
            </h1>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto mb-12 md:mb-20">
            {/* 3D Viewer - Always First on Mobile */}
            <motion.div
              className="order-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative">
                {/* Main viewer container */}
                <div
                  className={`relative border-2 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ${
                    cupType === 'standard'
                      ? 'bg-gradient-to-br from-[#F2F2F2] via-[#E2E2E2] to-[#D5D5D5] border-white/60'
                      : 'bg-gradient-to-br from-[#1A1A1A] via-[#0d0d0d] to-black border-primary/30'
                  }`}
                >
                  {/* Corner accents - hidden on small mobile */}
                  <div className="hidden sm:block absolute top-0 left-0 w-12 h-12 md:w-20 md:h-20 border-t-2 border-l-2 border-primary rounded-tl-2xl md:rounded-tl-3xl z-10" />
                  <div className="hidden sm:block absolute top-0 right-0 w-12 h-12 md:w-20 md:h-20 border-t-2 border-r-2 border-primary rounded-tr-2xl md:rounded-tr-3xl z-10" />
                  <div className="hidden sm:block absolute bottom-0 left-0 w-12 h-12 md:w-20 md:h-20 border-b-2 border-l-2 border-primary rounded-bl-2xl md:rounded-bl-3xl z-10" />
                  <div className="hidden sm:block absolute bottom-0 right-0 w-12 h-12 md:w-20 md:h-20 border-b-2 border-r-2 border-primary rounded-br-2xl md:rounded-br-3xl z-10" />

                  {/* Glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
                  
                  {/* 3D Viewer */}
                  <div className="relative aspect-square p-4 md:p-8">
                    <MugViewer 
                      customImage={null}
                      dividedMode={true}
                      cupType={cupType}
                      sectionImages={sectionImages}
                      imagePosition={imagePosition}
                      imageRotation={imageRotation}
                    />
                  </div>

                  {/* Status badge */}
                  {uploadedImageCount > 0 && (
                    <motion.div
                      className="absolute top-3 right-3 md:top-6 md:right-6 flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-primary/20 backdrop-blur-xl border border-primary/50 rounded-full z-10"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.6 }}
                    >
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      <span className="text-[10px] md:text-sm font-bold text-primary">
                        {uploadedImageCount} {getText('Image(s)', 'Image(s)')}
                      </span>
                    </motion.div>
                  )}

                  {/* 360 indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-black/60 backdrop-blur-xl border border-primary/30 rounded-full z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </motion.div>
                    <span className="text-[10px] md:text-xs font-semibold text-white hidden sm:inline">
                      {getText('Drag to Rotate', 'Glissez pour Pivoter')}
                    </span>
                  </div>
                </div>

                {/* Section Selector - Compact on Mobile */}
                <motion.div
                  className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-xl p-3 md:p-4 shadow-xl mt-4 md:mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Grid3x3 className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                    <h3 className="text-sm md:text-lg font-bold text-white">
                      {getText('Select Section', 'Sélectionner Section')}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {getText('Cup Type', 'Type de Tasse')}
                    </span>
                    <div className="flex items-center gap-2 bg-black/40 border border-primary/30 rounded-full p-1">
                      <button
                        type="button"
                        onClick={() => setCupType('hotzy')}
                        className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold transition-all ${
                          cupType === 'hotzy'
                            ? 'bg-primary text-black'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Hotzy
                      </button>
                      <button
                        type="button"
                        onClick={() => setCupType('standard')}
                        className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold transition-all ${
                          cupType === 'standard'
                            ? 'bg-primary text-black'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Standard
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['section1', 'section2', 'section3'] as const).map((section, index) => (
                      <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${
                          activeSection === section
                            ? 'border-primary shadow-[0_0_20px_rgba(118,185,0,0.3)]'
                            : 'border-primary/20 hover:border-primary/60'
                        }`}
                      >
                        {sectionImages[section] ? (
                          <>
                            <img 
                              src={sectionImages[section]!} 
                              alt={`Section ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(section);
                              }}
                              className="absolute top-0.5 right-0.5 w-4 h-4 md:w-5 md:h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="w-2 h-2 md:w-3 md:h-3 text-white" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full bg-black/40 flex flex-col items-center justify-center">
                            <span className="text-white font-bold text-sm md:text-base">{index + 1}</span>
                            <span className="text-[8px] md:text-[10px] text-muted-foreground mt-0.5">
                              {getText('Empty', 'Vide')}
                            </span>
                          </div>
                        )}
                        
                        {activeSection === section && (
                          <motion.div 
                            className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                            layoutId="activeSection"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <p className="text-[9px] md:text-[10px] text-muted-foreground mt-2 text-center">
                    {getText(
                      'Click a section to upload its image',
                      'Cliquez sur une section pour télécharger'
                    )}
                  </p>
                </motion.div>

                {/* Quick stats - Hidden on small mobile */}
                <motion.div
                  className="hidden sm:grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/30 rounded-xl p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-black text-primary">11oz</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">{getText('Capacity', 'Capacité')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/30 rounded-xl p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-black text-primary">4K</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">{getText('Print', 'Qualité')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/30 rounded-xl p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-black text-primary">24h</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">{getText('Production', 'Production')}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Controls - Collapsible on Mobile */}
            <motion.div
              className="order-2 space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Upload Section - Collapsible */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-xl md:rounded-2xl shadow-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('upload')}
                  className="w-full flex items-center justify-between p-4 md:p-6 lg:cursor-default"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Upload className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base md:text-xl font-bold text-white">
                        {getText('Upload Design', 'Télécharger Design')}
                      </h3>
                      <span className="text-xs md:text-sm text-primary lg:hidden">
                        ({getText('Section', 'Section')} {activeSection.replace('section', '')})
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform lg:hidden ${expandedSections.upload ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {(expandedSections.upload || isDesktop) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 md:px-6 md:pb-6"
                    >
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-4 md:p-6 text-center max-h-[240px] md:max-h-[260px] transition-all duration-300 ${
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
                          <div className="flex flex-col items-center gap-2 md:gap-3">
                            <motion.div
                              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-[#9ACD32] rounded-full flex items-center justify-center"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring" }}
                            >
                              <Upload className="w-5 h-5 md:w-6 md:h-6 text-black" />
                            </motion.div>
                            <div>
                              <p className="text-white font-semibold text-sm md:text-base mb-1">
                                {getText('Drop your design here', 'Déposez votre design ici')}
                              </p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                {getText('or click to browse', 'ou cliquez pour parcourir')}
                              </p>
                              <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2">
                                {getText('JPG, PNG, SVG • Max 10MB', 'JPG, PNG, SVG • Max 10MB')}
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {currentSectionImage && (
                        <motion.div
                          className="space-y-2 md:space-y-3 mt-3 md:mt-4"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center justify-between p-2 md:p-3 bg-primary/10 border border-primary/30 rounded-lg">
                            <span className="text-xs md:text-sm text-white font-medium">
                              ✓ {getText('Design uploaded', 'Design téléchargé')}
                            </span>
                            <button
                              onClick={() => handleRemoveImage(activeSection)}
                              className="text-[10px] md:text-xs text-primary hover:text-primary/80 font-semibold"
                            >
                              {getText('Remove', 'Supprimer')}
                            </button>
                          </div>
                          
                          {currentSectionType === 'uploaded' && (
                            <motion.button
                              onClick={handleDuplicateToAll}
                              className="w-full flex items-center justify-center gap-2 p-2 md:p-3 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-lg transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Copy className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                              <span className="text-xs md:text-sm text-primary font-semibold">
                                {getText('Duplicate to All', 'Dupliquer Tout')}
                              </span>
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Position Controls - Only show when image exists */}
              {currentSectionImage && (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('position')}
                    className="w-full flex items-center justify-between p-3 md:p-4 lg:cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Move className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      </div>
                      <h3 className="text-sm md:text-lg font-bold text-white">
                        {getText('Position', 'Position')}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetPositionControls();
                        }}
                        className="text-[10px] md:text-xs text-primary hover:text-primary/80 font-semibold"
                      >
                        {getText('Reset', 'Réinitialiser')}
                      </button>
                      <ChevronDown className={`w-5 h-5 text-primary transition-transform lg:hidden ${expandedSections.position ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {(expandedSections.position || isDesktop) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-3 pb-3 md:px-4 md:pb-4 space-y-3 md:space-y-4"
                      >
                        <div>
                          <label className="text-xs text-white font-medium mb-1.5 md:mb-2 block">
                            {getText('Move Image', 'Déplacer')}
                          </label>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => moveImage('left')}
                              className="w-9 h-9 md:w-10 md:h-10 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <ArrowLeft className="w-4 h-4 text-primary" />
                            </button>
                            
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-black/40 border border-primary/20 rounded-lg flex items-center justify-center">
                              <span className="text-[8px] md:text-[9px] text-muted-foreground text-center leading-tight">
                                {imagePosition.x.toFixed(2)}<br/>{imagePosition.y.toFixed(2)}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => moveImage('right')}
                              className="w-9 h-9 md:w-10 md:h-10 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <ArrowRight className="w-4 h-4 text-primary" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs text-white font-medium flex items-center gap-1.5">
                              <RotateCw className="w-3 h-3 text-primary" />
                              {getText('Rotation', 'Rotation')}
                            </label>
                            <span className="text-[10px] text-muted-foreground">{imageRotation.toFixed(0)}°</span>
                          </div>
                          <input
                            type="range"
                            min="-45"
                            max="45"
                            step="1"
                            value={imageRotation}
                            onChange={(e) => setImageRotation(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Design Templates - Collapsible */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-xl md:rounded-2xl shadow-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('templates')}
                  className="w-full flex items-center justify-between p-4 md:p-6 lg:cursor-default"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base md:text-xl font-bold text-white">
                        {getText('Templates', 'Modèles')}
                      </h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground lg:hidden">
                        {getText('Browse designs', 'Parcourir')}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform lg:hidden ${expandedSections.templates ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {(expandedSections.templates || isDesktop) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 md:px-6 md:pb-6"
                    >
                      <div className="flex items-center justify-end mb-3">
                        <label
                          htmlFor="apply-template-all"
                          className="flex items-center gap-2 text-[11px] md:text-xs text-muted-foreground cursor-pointer"
                        >
                          <input
                            id="apply-template-all"
                            type="checkbox"
                            checked={applyTemplateToAll}
                            onChange={(e) => setApplyTemplateToAll(e.target.checked)}
                            className="h-3.5 w-3.5 accent-primary"
                          />
                          <span>{getText('Apply to all sections', 'Appliquer à toutes les sections')}</span>
                        </label>
                      </div>
                      <div className="relative">
                        <CircularGallery
                          items={DESIGN_TEMPLATES.map(template => ({
                            image: template.image,
                            text: getText(template.name, template.nameFr)
                          }))}
                          bend={3}
                          textColor="#76B900"
                          borderRadius={0.05}
                          font="bold 30px Inter"
                          scrollSpeed={2}
                          scrollEase={0.05}
                          onItemClick={(image, text) => {
                            handleTemplateSelect(image);
                          }}
                        />
                        
                        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-black/60 backdrop-blur-xl border border-primary/30 rounded-full z-10 pointer-events-none">
                          <span className="text-[9px] md:text-xs font-semibold text-white">
                            {getText('Drag • Click', 'Glissez • Cliquez')}
                          </span>
                        </div>
                      </div>

                      {currentSectionImage && (
                        <motion.div
                          className="flex items-center justify-between p-2 md:p-3 bg-primary/10 border border-primary/30 rounded-lg mt-3 md:mt-4"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-xs md:text-sm text-white font-medium truncate">
                            ✓ {
                              DESIGN_TEMPLATES.find(t => t.image === currentSectionImage)
                                ? getText(
                                    DESIGN_TEMPLATES.find(t => t.image === currentSectionImage)!.name,
                                    DESIGN_TEMPLATES.find(t => t.image === currentSectionImage)!.nameFr
                                  )
                                : getText('Custom', 'Personnalisé')
                            }
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {showDevTools && (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-4 md:p-6 space-y-3">
                    <div className="text-sm md:text-base font-bold text-white">
                      {getText('Dev: Upload Test Wrap', 'Dev: Upload Test Wrap')}
                    </div>
                    <input
                      type="text"
                      value={testOrderId}
                      onChange={(e) => setTestOrderId(e.target.value)}
                      placeholder={getText('Paste Order ID', 'Coller ID commande')}
                      className="w-full rounded-lg bg-black/40 border border-primary/30 px-3 py-2 text-xs md:text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleUploadTestWrap}
                        className="px-3 py-2 rounded-lg bg-primary text-black text-xs md:text-sm font-semibold hover:bg-[#9ACD32] transition-colors"
                      >
                        {getText('Upload Test Wrap', 'Uploader Wrap Test')}
                      </button>
                      {wrapUploadStatus && (
                        <span className="text-[10px] md:text-xs text-muted-foreground">
                          {wrapUploadStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing - Collapsible */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-xl md:rounded-2xl shadow-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('pricing')}
                  className="w-full flex items-center justify-between p-4 md:p-6"
                >
                  <h3 className="text-base md:text-xl font-bold text-white">
                    {getText('Pricing', 'Prix')}
                  </h3>
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-lg md:text-2xl font-black text-primary">{displayPrice}</span>
                    <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedSections.pricing ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {expandedSections.pricing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 md:px-6 md:pb-6 space-y-2 md:space-y-3"
                    >
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-muted-foreground">{getText('Per Mug', 'Par Tasse')}</span>
                        <span className="text-white font-semibold">{displayPrice}</span>
                      </div>
                      <div className="border-t border-primary/20 pt-2 md:pt-3 text-[10px] md:text-xs text-muted-foreground">
                        {getText('Price depends on cup type', 'Le prix depend du type de tasse')}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Details - Collapsible */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-xl md:rounded-2xl shadow-xl overflow-hidden hidden md:block">
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between p-4 md:p-6"
                >
                  <h3 className="text-base md:text-xl font-bold text-white">
                    {getText('Details & Features', 'Détails & Caractéristiques')}
                  </h3>
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform ${expandedSections.details ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedSections.details && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 md:px-6 md:pb-6 space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{getText('Material', 'Matériau')}</span>
                          <span className="text-white font-medium">{getText('Ceramic', 'Céramique')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{getText('Capacity', 'Capacité')}</span>
                          <span className="text-white font-medium">11 oz</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-primary/20 pt-4 space-y-2">
                        {[
                          { en: 'Dishwasher safe', fr: 'Lave-vaisselle' },
                          { en: 'Microwave safe', fr: 'Micro-ondes' },
                          { en: 'Lifetime warranty', fr: 'Garantie à vie' }
                        ].map((feature) => (
                          <div key={feature.en} className="flex items-center gap-2 text-light-gray">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{getText(feature.en, feature.fr)}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA Buttons - Always visible, sticky on mobile */}
              <div className="space-y-3 sticky bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl p-4 -mx-4 border-t border-primary/20 md:static md:bg-transparent md:backdrop-blur-none md:p-0 md:border-none z-20">
                <motion.button
                  onClick={handleOrderNow}
                  disabled={isOrdering}
                  className={`w-full bg-gradient-to-r from-primary via-[#9ACD32] to-primary text-black font-black text-base md:text-lg py-4 md:py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 ${
                    isOrdering
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:shadow-[0_0_30px_rgba(118,185,0,0.5)]'
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  {getText('Order Now', 'Commander')} - {displayPrice}
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
                {orderNowStatus && (
                  <div className="text-[10px] md:text-xs text-muted-foreground text-center">
                    {orderNowStatus}
                  </div>
                )}

                <motion.button
                  onClick={handleAddToCart}
                  className="w-full bg-transparent border-2 border-primary text-primary font-bold text-base md:text-lg py-4 md:py-5 rounded-xl hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Package className="w-4 h-4 md:w-5 md:h-5" />
                  {getText('Add to Cart', 'Ajouter')}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Bottom Features - Simplified on mobile */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Package className="text-primary" size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                {getText('Premium Quality', 'Qualité Premium')}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {getText('Professional sublimation printing', 'Impression professionnelle')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Truck className="text-primary" size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                {getText('Fast Delivery', 'Livraison Rapide')}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {getText('24 hours production', 'Production 24 heures')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                {getText('Satisfaction', 'Satisfaction')}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {getText('100% guaranteed', '100% garantie')}
              </p>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
