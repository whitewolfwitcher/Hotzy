import Image from "next/image";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const featuresData: Feature[] = [
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/svgs/m48-nvidia-gpu-cloud-ngc-catalog-ffffff-1.svg",
    title: "Heat-Optimized Color Change",
    description: "Thermochromic pigments with instant transformation",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/svgs/m48-accuracy-ffffff-2.svg",
    title: "Decisive Thermal Retention",
    description: "Double-wall insulation with vacuum chamber",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/svgs/m48-render-ffffff-3.svg",
    title: "Realistic Ergonomic Design",
    description: "Non-slip handle with soft-touch coating",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/svgs/m48-digital-person-ffffff-4.svg",
    title: "Smart Customization",
    description: "Customizable patterns with color change",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/svgs/m48-3d-manipulation-ffffff-5.svg",
    title: "Compatible with All Beverages",
    description: "Coffee, tea, hot chocolate, and infused drinks",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/svgs/m48-live-talk-on-demand-ffffff-6.svg",
    title: "Optimized Easy Care",
    description: "Dishwasher and microwave safe",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/svgs/m48-download-ffffff-7.svg",
    title: "Durability and Reliability",
    description: "High-quality ceramic with lifetime warranty",
  },
  {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/svgs/m48-pc-ffffff-8.svg",
    title: "Ultimate Display Technologies",
    description: "Matte anti-glare surface with premium finish",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-accent p-8 rounded-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={48}
                height={48}
                className="mx-auto mb-6"
              />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;