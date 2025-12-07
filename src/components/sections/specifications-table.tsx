import React from 'react';

const specsData = [
  { label: 'Material', value: 'Ceramic' },
  { label: 'Capacity', value: '325ml / 11oz' },
  { label: 'Height', value: '9.5cm / 3.7"' },
  { label: 'Diameter', value: '8cm / 3.1"' },
  { label: 'Weight', value: '312g' },
  { label: 'Print Area', value: '2048×1024 px' },
  { label: 'Care Instructions', value: 'Easy Clean' },
  { label: 'Finish', value: 'Glossy' },
  { label: 'Handle', value: 'Ergonomic C-shape' },
  { label: 'Dishwasher Safe', value: 'Yes' },
  { label: 'Microwave Safe', value: 'Yes' },
  { label: 'Shape', value: 'Round' },
  { label: 'Pattern', value: 'Solid' },
  { label: 'Material Features', value: 'Thermal Responsive, Dishwasher Safe' },
  { label: 'Reusability', value: 'Reusable' },
  { label: 'Material Type Free', value: 'Lead Free, BPA Free' },
];

const SpecificationsTable = () => {
    return (
        <section id="specifications" className="bg-black py-24">
            <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
                <h2 className="text-center text-[3rem] font-bold leading-tight text-white mb-12">
                    Complete Specifications
                </h2>

                <div className="mx-auto max-w-[900px]">
                    <div className="grid grid-cols-2 border border-border">
                        {/* Headers */}
                        <div className="bg-black p-4 text-center font-semibold text-white border-r border-border">Specification</div>
                        <div className="bg-black p-4 text-center font-semibold text-white">Value</div>

                        {/* Data */}
                        {specsData.map((spec, index) => [
                            <div key={`${index}-label`} className={`p-4 text-left text-white border-t border-r border-border ${index % 2 === 0 ? 'bg-card' : 'bg-black'}`}>
                                {spec.label}
                            </div>,
                            <div key={`${index}-value`} className={`p-4 text-center text-primary border-t border-border ${index % 2 === 0 ? 'bg-card' : 'bg-black'}`}>
                                {spec.value}
                            </div>
                        ])}
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href="#"
                            className="inline-block rounded-[4px] bg-primary px-8 py-3.5 font-bold text-primary-foreground text-button transition-colors hover:bg-primary/90"
                        >
                            View Full Specifications
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecificationsTable;