import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const RtxShowcase = () => {
  return (
    <section className="bg-black py-32 overflow-hidden" id="collections">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center max-w-4xl mx-auto">
          <p className="font-bold text-sm tracking-[0.08em] uppercase text-primary mb-4">
            Hotzy. It's Hot.
          </p>
          <h2 className="text-[2.5rem] leading-[1.3] font-bold text-white mb-6">
            Color-Changing Pigments and Insulation at Their Peak
          </h2>
          <p className="text-light-gray max-w-3xl mx-auto mb-8 leading-relaxed">
            The most advanced platform in the industry, NVIDIA Hotzy revolutionizes the way we enjoy hot beverages through color-changing technologies and ultra-high-performance ceramic insulation. More than 700 designs and customizable patterns leverage our technology to deliver an incredibly spectacular visual experience, significantly improved heat retention, and innovative features like multi-layer color change.
          </p>
          <a href="#" className="inline-flex items-center text-primary font-bold group transition-all duration-300 hover:brightness-110">
            <span>Discover the new Hotzy Collections</span>
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        
        <div className="mt-20 [perspective:1400px]">
          <div 
            className="relative mx-auto max-w-[980px] transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(30deg)]"
          >
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/3d-perspective-grid-wall-showcasing-mult-c4903edc-20251030104358.jpg"
              alt="A wall of thumbnails showcasing color-changing mug collections with different designs and patterns"
              width={980}
              height={551}
              className="w-full h-auto"
            />
            <div 
              className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-full h-3/4 bg-[radial-gradient(ellipse_at_bottom,rgba(118,185,0,0.2)_0%,transparent_70%)] -z-10"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RtxShowcase;