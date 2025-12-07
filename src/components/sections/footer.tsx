"use client";

import { Facebook, Instagram, Music, Twitter } from 'lucide-react';
import { usePreferences } from '@/contexts/preferences-context';
import FooterColumnShop from '@/components/footer/FooterColumnShop';

const socialLinks = [
  { href: '#', label: 'Facebook', icon: Facebook },
  { href: '#', label: 'Instagram', icon: Instagram },
  { href: '#', label: 'Twitter', icon: Twitter },
  { href: '#', label: 'TikTok', icon: Music },
];

export default function Footer() {
  const { language } = usePreferences();

  const translations = {
    en: {
      products: "Products",
      productLinks: [
        { href: '#', name: 'Mugs' },
        { href: '#', name: 'Travel Mugs' },
        { href: '#', name: 'Tumblers' },
        { href: '#', name: 'Gift Sets' },
      ],
      community: "Community & News",
      communityLinks: [
        { href: '#', name: 'News' },
        { href: '#', name: 'Community Forums' },
        { href: '#', name: '#HOTZYART' },
        { href: '#', name: 'Community Portal' },
        { href: '#', name: 'Designer Resources' },
      ],
      support: "Support",
      supportLinks: [
        { href: '#', name: 'Care Guide' },
        { href: '#', name: 'Technical Support' },
      ],
      follow: "Follow Hotzy",
      legalLinks: [
        { href: '/terms-of-use', name: "Terms of Use" },
        { href: '/accessibility', name: 'Accessibility' },
        { href: '/contact', name: 'Contact Us' },
      ],
      copyright: "© 2025 Hotzy. Hotzy, the Hotzy logo, and HotzyChrome are trademarks and/or registered trademarks of Hotzy in the United States and other countries. All other copyrights and trademarks are the property of their respective owners."
    },
    fr: {
      products: "Produits",
      productLinks: [
        { href: '#', name: 'Mugs' },
        { href: '#', name: 'Mugs de voyage' },
        { href: '#', name: 'Gobelets' },
        { href: '#', name: 'Coffrets cadeaux' },
      ],
      community: "Communauté et actualités",
      communityLinks: [
        { href: '#', name: 'Actualités' },
        { href: '#', name: 'Forums communautaires' },
        { href: '#', name: '#HOTZYART' },
        { href: '#', name: 'Portail communautaire' },
        { href: '#', name: 'Ressources pour designers' },
      ],
      support: "Assistance",
      supportLinks: [
        { href: '#', name: "Guide d'entretien" },
        { href: '#', name: 'Support technique' },
      ],
      follow: "Suivez Hotzy",
      legalLinks: [
        { href: '/terms-of-use', name: "Conditions d'utilisation" },
        { href: '/accessibility', name: 'Accessibilité' },
        { href: '/contact', name: 'Nous contacter' },
      ],
      copyright: "© 2025 Hotzy. Hotzy, le logo Hotzy et HotzyChrome sont des marques commerciales et/ou des marques déposées de Hotzy aux États-Unis et dans d'autres pays. Tous les autres droits d'auteur et marques sont la propriété de leurs propriétaires respectifs."
    }
  };

  const t = translations[language];

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-16">
        <div className="border-t border-border py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:gap-12">
            
            <FooterColumnShop />

            <div>
              <h3 className="mb-6 text-base font-bold">{t.support}</h3>
              <ul className="space-y-3 text-sm mb-8">
                {t.supportLinks.map((link) => (
                  <li key={link.name}><a href={link.href} className="transition-colors hover:text-primary">{link.name}</a></li>
                ))}
              </ul>
              
              <h3 className="mb-6 text-base font-bold">{t.follow}</h3>
              <div className="flex items-center gap-x-5">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a key={label} href={href} aria-label={label} className="text-white transition-colors hover:text-primary">
                    <Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-16 pt-8">
            <ul className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
              {t.legalLinks.map((link) => (
                <li key={link.name}><a href={link.href} className="text-xs transition-colors hover:text-primary">{link.name}</a></li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed text-[#666666]">
              {t.copyright}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}