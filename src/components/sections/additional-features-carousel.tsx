"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowDownToLine } from "lucide-react";

export default function AdditionalFeaturesCarousel() {
  return (
    <section className="bg-[#1a1a1a] py-24">
      <div className="container">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Autres caractéristiques et avantages
        </h2>
        
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto px-12">
            <div className="flex-shrink-0 w-[400px] bg-[#2a2a2a] rounded-lg p-8">
              <div className="mb-6 h-[72px] w-[72px] rounded-full bg-primary flex items-center justify-center">
                <ArrowDownToLine className="h-9 w-9 text-black" />
              </div>
              
              <h3 className="text-2xl font-semibold text-white mb-4">
                Pilotes Game Ready et Studio
              </h3>
              
              <p className="text-light-gray mb-6 leading-relaxed">
                Les pilotes GeForce Game Ready et NVIDIA Studio vous aident à vivre la meilleure expérience possible dans vos jeux favoris.
              </p>
              
              <div className="mb-6 relative h-32 w-full rounded-lg overflow-hidden">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/geforce-game-ready-driver-19.jpeg"
                  alt="Driver screenshot"
                  fill
                  className="object-cover"
                />
              </div>
              
              <a href="#" className="text-primary hover:text-[#9ACD32] font-semibold">
                En savoir plus →
              </a>
            </div>
            
            <div className="flex-shrink-0 w-[400px] bg-[#2a2a2a] rounded-lg p-8">
              <div className="mb-6 relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/nvidia-app-oct24-nv-app-hero-1920x1080-20.png"
                  alt="NVIDIA App"
                  fill
                  className="object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-semibold text-white mb-4">
                NVIDIA App
              </h3>
              
              <p className="text-light-gray mb-6 leading-relaxed">
                Découvrez l'application incontournable pour les joueurs et les créateurs sur PC.
              </p>
              
              <a href="#" className="text-primary hover:text-[#9ACD32] font-semibold">
                En savoir plus →
              </a>
            </div>
            
            <div className="flex-shrink-0 w-[400px] bg-[#2a2a2a] rounded-lg p-8">
              <div className="mb-6 relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/nvidia-g-sync-21.jpeg"
                  alt="NVIDIA G-SYNC"
                  fill
                  className="object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-semibold text-white mb-4">
                NVIDIA G-SYNC
              </h3>
              
              <p className="text-light-gray mb-6 leading-relaxed">
                NVIDIA G-SYNC® vous donne accès à une suite de technologies d'affichage ultimes.
              </p>
              
              <a href="#" className="text-primary hover:text-[#9ACD32] font-semibold">
                En savoir plus →
              </a>
            </div>
            
            <div className="flex-shrink-0 w-[400px] bg-[#2a2a2a] rounded-lg p-8">
              <div className="mb-6 relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/geforce-virtual-reality-22.jpeg"
                  alt="Réalité virtuelle"
                  fill
                  className="object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-semibold text-white mb-4">
                Réalité virtuelle
              </h3>
              
              <p className="text-light-gray mb-6 leading-relaxed">
                Les solutions graphiques les plus performantes vous procurent les expériences de réalité virtuelle (VR) les plus fluides et immersives.
              </p>
              
              <a href="#" className="text-primary hover:text-[#9ACD32] font-semibold">
                En savoir plus →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
