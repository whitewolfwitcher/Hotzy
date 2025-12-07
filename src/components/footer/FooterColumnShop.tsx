"use client";

import Link from 'next/link';
import { Sparkles, Star, Ruler } from 'lucide-react';
import { usePreferences } from '@/contexts/preferences-context';

interface ShopLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
  isPrimary?: boolean;
}

const ShopLink = ({ href, label, icon, ariaLabel, isPrimary }: ShopLinkProps) => (
  <li>
    <Link 
      href={href}
      aria-label={ariaLabel}
      className={`group flex items-center gap-2 text-sm transition-all duration-300 ${
        isPrimary 
          ? 'text-white hover:text-primary underline decoration-primary decoration-2 underline-offset-4' 
          : 'text-light-gray hover:text-white'
      } hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 -mx-2`}
    >
      <span className={`transition-all duration-300 ${
        isPrimary 
          ? 'text-primary group-hover:drop-shadow-[0_0_8px_rgba(118,185,0,0.6)]' 
          : 'text-muted-foreground group-hover:text-primary'
      }`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  </li>
);

export default function FooterColumnShop() {
  const { language } = usePreferences();

  const translations = {
    en: {
      heading: "Shop",
      links: [
        {
          label: "Custom Mugs",
          href: "/explore",
          icon: <Sparkles size={18} />,
          ariaLabel: "Go to Explore designs page to build your custom mug",
          isPrimary: true
        },
        {
          label: "Limited Editions",
          href: "/gallery",
          icon: <Star size={18} />,
          ariaLabel: "View limited edition mugs in gallery",
          isPrimary: false
        },
        {
          label: "Find Your Size",
          href: "/shop",
          icon: <Ruler size={18} />,
          ariaLabel: "Go to shop page to compare mug sizes",
          isPrimary: false
        }
      ]
    },
    fr: {
      heading: "Boutique",
      links: [
        {
          label: "Mugs personnalisés",
          href: "/explore",
          icon: <Sparkles size={18} />,
          ariaLabel: "Accédez à la page Explorer pour créer votre mug personnalisé",
          isPrimary: true
        },
        {
          label: "Éditions limitées",
          href: "/gallery",
          icon: <Star size={18} />,
          ariaLabel: "Voir les mugs en édition limitée dans la galerie",
          isPrimary: false
        },
        {
          label: "Trouvez votre taille",
          href: "/shop",
          icon: <Ruler size={18} />,
          ariaLabel: "Accédez à la boutique pour comparer les tailles de mugs",
          isPrimary: false
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <div>
      <h3 className="mb-6 text-base font-bold text-white">{t.heading}</h3>
      <ul className="space-y-3">
        {t.links.map((link) => (
          <ShopLink
            key={link.label}
            href={link.href}
            label={link.label}
            icon={link.icon}
            ariaLabel={link.ariaLabel}
            isPrimary={link.isPrimary}
          />
        ))}
      </ul>
    </div>
  );
}
