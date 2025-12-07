import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const AiPcSection = () => {
  return (
    <section 
      id="customization"
      className="relative w-full overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/modern-workspace-with-laptop-showing-mug-8574d9e1-20251030104401.jpg"
          alt="A modern workspace with AI-assisted mug customization tools"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          quality={100}
          className="scale-110 lg:scale-100"
        />
      </div>
      
      <div className="container relative z-10 mx-auto flex min-h-[600px] items-center py-16 lg:min-h-[700px]">
        <div className="w-full lg:w-[45%] xl:w-2/5">
          <div className="bg-black/70 p-8 sm:p-12 md:p-14 lg:p-16">
            <p className="text-eyebrow text-primary mb-6">
              AI-ASSISTED CUSTOMIZATION
            </p>
            <h2 className="font-heading text-4xl font-bold text-white leading-[1.2] md:text-[2.5rem] lg:text-5xl mb-6">
              NVIDIA Powers the World's Customization. And Yours.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Experience an unparalleled customization experience thanks to NVIDIA Hotzy™ technologies, which allow you to create unique designs, visualize your creations in real-time, and customize every aspect of your mug. With the integration of dedicated AI tools, you now have access to cutting-edge design technology for everyone.
            </p>
            <a href="#" className="inline-flex items-center text-lg font-bold text-primary transition-colors duration-200 hover:text-white">
              Create Your Custom Mug
              <ChevronRight className="ml-1 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiPcSection;