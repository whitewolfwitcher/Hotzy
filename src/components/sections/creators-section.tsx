import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CreatorTool {
  imgSrc: string;
  title: string;
  subtitle: string;
  description: string;
  linkHref: string;
}

const creatorTools: CreatorTool[] = [
  {
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/nvidia-broadcast-ari-15.jpeg",
    title: "NVIDIA MugDesigner",
    subtitle: "Your AI-optimized personal design studio",
    description: "Take your mug designs to the next level with powerful AI capabilities that enhance pattern and design quality. Remove imperfections, customize color-changing colors, and much more, in a fraction of a second.",
    linkHref: "#",
  },
  {
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/geforce-rtx-on-super-resolution-apex-2560x1440-3-16.png",
    title: "Hotzy Preview",
    subtitle: "Visualize your creations beautifully",
    description: "3D visualization technologies use AI to preview the color change of your designs in Chrome, Edge, or Firefox with cutting-edge AI algorithms that perfectly simulate color-changing transformation. Enjoy realistic real-time preview.",
    linkHref: "#",
  },
  {
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/nvidia-rtx-remix-ari-17.jpeg",
    title: "Hotzy Remix",
    subtitle: "Transform your classic designs",
    description: "The Hotzy Remix platform allows designers to easily capture existing patterns, enhance rendering with powerful AI tools, and create stunning color-changing designs with advanced support for multi-layer color transitions.",
    linkHref: "#",
  },
  {
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/studio-blackwell-video-editing-ui-ari-18.jpeg",
    title: "Rapid Prototyping",
    subtitle: "Combine speed and creativity",
    description: "Harness the full power of rapid prototyping tools to create your designs at lightning speed and integrate AI-optimized color-changing effects in Adobe Illustrator, CorelDRAW, and many other design applications.",
    linkHref: "#",
  },
];

const CreatorToolCard = ({ tool }: { tool: CreatorTool }) => {
  return (
    <div className="bg-card rounded-lg flex flex-col group transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="relative w-full aspect-video">
            <Image 
                src={tool.imgSrc} 
                alt={tool.title} 
                layout="fill" 
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
            <div className="mb-4 flex-grow">
                <p className="font-bold text-white mb-2 text-base">{tool.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-6">{tool.description}</p>
            </div>
            <Link href={tool.linkHref} className="text-primary font-bold text-sm mt-auto flex items-center gap-1.5 group-hover:text-white transition-colors self-start">
                Learn More
                <ArrowRight size={14} />
            </Link>
        </div>
    </div>
  );
};


const CreatorsSection = () => {
    return (
        <section id="care" className="bg-black py-24">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-center mb-24">
                    <div className="lg:pr-8">
                        <p className="text-eyebrow text-white mb-4">Designers</p>
                        <h2 className="text-[2.5rem] leading-tight font-bold text-white mb-6">Your Creative Advantage</h2>
                        <p className="text-base text-muted-foreground leading-relaxed mb-8">
                        NVIDIA Studio gives you the creative advantage. Hotzy 50 series technologies provide transformative performance for color-changing pattern design, 3D visualization, and graphic design. Leverage acceleration capabilities and the many features of the Hotzy platform in leading design applications, cutting-edge NVIDIA Studio tools constantly updated to guarantee maximum creativity, as well as a suite of exclusive tools harnessing the power of AI to enrich custom mug design workflows.
                        </p>
                        <Link href="#" className="font-bold text-primary hover:text-white transition-colors flex items-center gap-2 text-base">
                            Unleash Your Creativity with Hotzy
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="relative aspect-[4/3] w-full">
                        <Image 
                            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/modern-workspace-with-laptop-showing-mug-8574d9e1-20251030104401.jpg" 
                            alt="Laptop showing creative software for mug design"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {creatorTools.map((tool) => (
                        <CreatorToolCard key={tool.title} tool={tool} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CreatorsSection;