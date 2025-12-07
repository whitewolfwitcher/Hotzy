import Image from 'next/image';

const SystemRequirementsSection = () => {
  return (
    <section className="bg-card text-white py-24" id="care">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <h2 className="text-[40px] font-bold text-center mb-4 leading-tight">
          Guide d'entretien pour votre Hotzy® 5090
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-16 max-w-xl mx-auto">
          Les instructions d'entretien peuvent varier selon le modèle et le fabricant. Veuillez consulter les instructions spécifiques fournies avec votre mug.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16">
          {/* Column 1: Cleaning */}
          <div className="flex items-start gap-6">
            <span className="text-6xl font-bold text-primary flex-shrink-0">1.</span>
            <div className="flex-grow pt-2">
              <h3 className="text-[32px] font-semibold mb-4">Nettoyage et entretien</h3>
              <h4 className="text-2xl font-bold text-primary mb-2">Lavage quotidien recommandé</h4>
              <p className="text-muted-foreground mb-6">
                Pour préserver les pigments de changement de couleur et maintenir l'efficacité de l'isolation thermique.
                <br />
                Veuillez suivre ces instructions avec précaution.
              </p>

              <div className="space-y-8">
                <div>
                  <p className="font-bold mb-2">Option de nettoyage 1.</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Lavage à la main avec eau tiède et savon doux. Évitez les éponges abrasives qui pourraient endommager les pigments de changement de couleur. Séchez immédiatement après le lavage.
                  </p>
                  <div className="bg-[#d9d9d9] rounded-lg overflow-hidden">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/2321550-gf-comp-guide-4090-pcie-8pin-2560x1440px-29.png"
                      alt="Diagram showing hand washing technique for the mug"
                      width={2560}
                      height={1440}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold mb-2">Option de nettoyage 2.</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Compatible lave-vaisselle (panier supérieur uniquement). Programme délicat à 50°C maximum pour préserver les pigments de changement de couleur.
                  </p>
                  <div className="bg-[#d9d9d9] rounded-lg overflow-hidden">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/2321550-gf-comp-guide-4090-pcie-16pin-2560x1440px-30.png"
                      alt="Diagram showing dishwasher placement for the mug"
                      width={2560}
                      height={1440}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Storage */}
          <div className="flex items-start gap-6">
            <span className="text-6xl font-bold text-primary flex-shrink-0">2.</span>
            <div className="flex-grow pt-2">
              <h3 className="text-[32px] font-semibold mb-6">Stockage et utilisation</h3>
              
              <div className="space-y-6 text-muted-foreground mb-8">
                <p className="text-lg font-semibold text-white">Conservation dans un endroit sec et tempéré.</p>
                <p>Éviter l'exposition prolongée à la lumière directe du soleil qui pourrait altérer les pigments de changement de couleur.</p>
                <p>
                  <span className="font-bold text-white">Température d'utilisation :</span> Compatible avec des liquides de 5°C à 95°C. La transformation complète des couleurs se produit entre 45°C et 65°C.
                </p>
                <p>
                  <span className="font-bold text-white">Capacité maximale :</span> 450ml (15oz). Ne pas remplir au-delà de la ligne de remplissage recommandée située 1cm sous le bord.
                </p>
                <p className="text-white font-semibold">Compatible micro-ondes jusqu'à 800W pendant 2 minutes maximum.</p>
              </div>

              <div className="bg-[#d9d9d9] rounded-lg overflow-hidden">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/f5f72cb8-da36-4f58-8ea5-e9218193ea09-nvidia-com/assets/images/2321550-gf-comp-guide-4090-850w-2560x1440px-28.png"
                  alt="Diagram showing proper storage and usage guidelines for the mug"
                  width={2560}
                  height={1440}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemRequirementsSection;