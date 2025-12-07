"use client";

import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface Partner {
  name: string;
  logo: string;
  url: string;
  width: number;
  height: number;
}

const mainPartnersRow1: Partner[] = [
  { name: 'LDLC', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/LDLC-23.png', url: '#', width: 115, height: 30 },
  { name: 'Materiel.net', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/images-24.png', url: '#', width: 115, height: 46 },
  { name: 'Infomax', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/Background-25.png', url: '#', width: 115, height: 50 },
];

const mainPartnersRow2: Partner[] = [
  { name: 'TopAchat', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/topachat-26.png', url: '#', width: 115, height: 18 },
  { name: 'Cybertek', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/87115-27.png', url: '#', width: 115, height: 41 },
];

const otherPartners = [
  { name: '1fodiscount', url: '#' },
  { name: 'Flowup', url: '#' },
  { name: 'Grosbill', url: '#' },
  { name: 'powerlab', url: '#' },
  { name: 'PCComponentes', url: '#' },
];

const WhereToBuySection = () => {
  return (
    <section id="wheretobuy" className="bg-black py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6">
        <h2 className="text-center font-bold text-white text-[2.5rem] leading-tight mb-8">Où acheter?</h2>
        
        <div className="relative mb-12">
          <select 
            aria-label="countries" 
            className="cursor-pointer appearance-none border-0 border-b-2 border-primary bg-transparent pb-1 pl-1 pr-8 text-lg text-white focus:outline-none focus:ring-0"
          >
            <option value="France" className="bg-black text-white">France</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
        </div>

        <div className="flex w-full flex-col items-center gap-6">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {mainPartnersRow1.map((partner) => (
              <a 
                key={partner.name} 
                href={partner.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex h-40 items-center justify-center rounded-lg bg-white p-8 shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              >
                <Image 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  width={partner.width} 
                  height={partner.height} 
                  className="max-h-16 w-auto object-contain"
                />
              </a>
            ))}
          </div>
          
          <div className="grid w-full grid-cols-1 gap-6 md:w-2/3 md:grid-cols-2">
            {mainPartnersRow2.map((partner) => (
              <a 
                key={partner.name} 
                href={partner.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex h-40 items-center justify-center rounded-lg bg-white p-8 shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              >
                <Image 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  width={partner.width} 
                  height={partner.height} 
                  className="max-h-16 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <h3 className="mb-6 font-semibold text-white text-[2rem]">Autres Partenaires</h3>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {otherPartners.map((partner) => (
              <li key={partner.name}>
                <a href={partner.url} className="text-primary underline transition-colors hover:text-white">
                  {partner.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhereToBuySection;