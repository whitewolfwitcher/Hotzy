import { Play } from 'lucide-react';

// A placeholder to mimic the exploded view from the screenshot as no assets were provided.
// This is styled to match the dark, high-tech aesthetic of the original website.
const ExplodedViewPlaceholder = () => (
  <div
    className="relative aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden"
  >
    {/* Top component */}
    <div className="absolute top-[25%] h-[10%] w-[60%] bg-[#111] rounded-sm -translate-y-4 shadow-lg"></div>
    
    {/* Middle component - smaller */}
    <div className="absolute top-[38%] h-[8%] w-[55%] bg-[#151515] rounded-sm shadow-md"></div>
    
    {/* Central block with a "chip" */}
    <div className="absolute top-1/2 -translate-y-1/2 h-[15%] w-[50%] bg-[#0A0A0A] border border-zinc-800 rounded-md flex items-center justify-center shadow-2xl">
      <div className="w-[20%] h-[40%] bg-green-900/50 border border-green-700/50 rounded-sm"></div>
    </div>

    {/* Another layer */}
    <div className="absolute top-[68%] h-[5%] w-[45%] bg-[#111] rounded-sm shadow-md"></div>
    
    {/* Bottom fans */}
    <div className="absolute top-[76%] flex gap-x-8">
      <div className="w-24 h-24 bg-[#0A0A0A] border border-zinc-800 rounded-full flex items-center justify-center shadow-lg">
        <div className="w-20 h-20 rounded-full border-t-2 border-zinc-600 animate-spin [animation-duration:4s]"></div>
      </div>
      <div className="w-24 h-24 bg-[#0A0A0A] border border-zinc-800 rounded-full flex items-center justify-center shadow-lg">
        <div className="w-20 h-20 rounded-full border-t-2 border-zinc-600 animate-spin [animation-duration:4s] [animation-direction:reverse]"></div>
      </div>
    </div>
  </div>
);


const FoundersEditionDesign = () => {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-white font-bold text-[2.5rem] leading-tight mb-6">
            Design révolutionnaire double flux dans l'édition Founders Edition
          </h2>
          <p className="text-muted-foreground text-xl leading-8 max-w-3xl mx-auto">
            Les PCB avancés et la conception thermique fournissent deux fois plus de flux d'air qu'une configuration de carte graphique traditionnelle. Une chambre à vapeur 3D avec caloducs intégrés et ailettes actives améliore encore les performances thermiques. Il en résulte le refroidisseur pour carte graphique Dual Slot le plus performant jamais conçu.
          </p>
        </div>
        
        <div className="relative mt-16 max-w-6xl mx-auto group cursor-pointer">
          <div className="w-full min-w-[320px] md:min-w-[800px] rounded-lg overflow-hidden">
            <ExplodedViewPlaceholder />
          </div>
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg pointer-events-none">
            <div
              className="w-28 h-28 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:scale-105"
            >
              <Play className="w-14 h-14 text-black fill-black ml-2" />
            </div>
          </div>
           <a href="#" className="absolute inset-0" aria-label="Voir la vidéo sur le design Founders Edition">
             <span className="sr-only">Play Video</span>
           </a>
        </div>
      </div>
    </section>
  );
};

export default FoundersEditionDesign;