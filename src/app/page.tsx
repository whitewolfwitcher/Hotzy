import NavigationHeader from "@/components/sections/navigation-header";
import HotzyHero from "@/components/sections/hotzy-hero";
import GallerySection from "@/components/sections/gallery-section";
import StorySlides from "@/components/sections/story-slides";
import FeaturesSection from "@/components/sections/features-section";
import SpecificationsSection from "@/components/sections/specifications-section";
import DesignGallery from "@/components/sections/design-gallery";
import Footer from "@/components/sections/footer";
import HashTitleSync from "@/components/seo/HashTitleSync";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HashTitleSync />
      <NavigationHeader />
      <HotzyHero />
      <GallerySection />
      <StorySlides />
      <FeaturesSection />
      <SpecificationsSection />
      <DesignGallery />
      <Footer />
    </div>
  );
}
