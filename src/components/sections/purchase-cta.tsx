import Link from "next/link";

const PurchaseCtaSection = () => {
  return (
    <section className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] py-32">
      <div className="container mx-auto max-w-[600px] text-center">
        <h2 className="text-2xl font-semibold text-primary mb-4">Shop</h2>
        <h3 className="text-5xl font-bold text-white mb-8">Hotzy 5090</h3>
        <p className="text-4xl font-bold text-white mb-8">Starting at $89</p>
        <Link
          href="#"
          className="inline-block bg-primary text-primary-foreground font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:bg-[#9ACD32] hover:scale-105 shadow-lg hover:shadow-[0_8px_24px_rgba(118,185,0,0.4)]"
        >
          View All Purchase Options
        </Link>
      </div>
    </section>
  );
};

export default PurchaseCtaSection;