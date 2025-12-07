import Image from 'next/image';

const ArchitectureSection = () => {
  const features = [
    {
      title: "5th Generation Color-Changing Pigments",
      description: "Instant color change from 68°F to 149°F",
    },
    {
      title: "New Ceramic Insulation",
      description: "Double-wall technology with vacuum chamber",
    },
    {
      title: "4th Generation Heat Coating",
      description: "Heat retention up to 6 hours",
    },
  ];

  return (
    <section id="architecture" className="bg-black py-24">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-eyebrow text-primary mb-4">
            NVIDIA Blackwell Technology
          </p>
          <h2 className="text-5xl font-bold leading-tight text-white">
            The Ultimate Platform for Hot Beverage Enthusiasts
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-16 gap-y-12 items-center">
          <div className="lg:col-span-6 flex justify-center items-center">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/technical-exploded-view-diagram-of-a-the-b5c41322-20251030104404.jpg"
              alt="Internal structure of Hotzy with insulation layers"
              width={763}
              height={654}
              className="w-full max-w-2xl h-auto"
            />
          </div>

          <div className="lg:col-span-4 flex flex-col space-y-12">
            {features.map((feature, index) => (
              <div key={index}>
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;