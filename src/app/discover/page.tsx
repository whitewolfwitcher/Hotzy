import { Metadata } from 'next';
import NavigationHeader from '@/components/sections/navigation-header';
import Footer from '@/components/sections/footer';
import DiscoverHero from '@/components/sections/discover-hero';
import ThermoColorSection from '@/components/sections/thermocolor-section';
import MaterialsCraftSection from '@/components/sections/materials-craft-section';
import DesignGalleryCustomizer from '@/components/sections/design-gallery-customizer';

export const metadata: Metadata = {
  title: 'Discover Hotzy – Color-Changing Science, Materials & Design Inspiration',
  description: 'See how heat-reactive color-changing technology reveals art, explore our materials & craft, then pick a preset design and customize it in 3D.',
};

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      <DiscoverHero />
      <ThermoColorSection />
      <MaterialsCraftSection />
      <DesignGalleryCustomizer />
      <Footer />
    </div>
  );
}