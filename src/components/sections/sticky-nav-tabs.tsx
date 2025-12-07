"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePreferences } from '@/contexts/preferences-context';

const StickyNavTabs = () => {
  const [activeTab, setActiveTab] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const { language } = usePreferences();

  const translations = {
    en: {
      customizer: "Customizer",
      gallery: "Gallery",
      story: "Story",
      features: "Features",
      specifications: "Specifications",
      shopNow: "Shop Now"
    },
    fr: {
      customizer: "Personnalisation",
      gallery: "Galerie",
      story: "Histoire",
      features: "Caractéristiques",
      specifications: "Spécifications",
      shopNow: "Acheter maintenant"
    }
  };

  const t = translations[language];

  const navItems = [
    { name: t.customizer, href: "#customizer" },
    { name: t.gallery, href: "#gallery" },
    { name: t.story, href: "#story" },
    { name: t.features, href: "#features" },
    { name: t.specifications, href: "#specifications" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector("section");
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsSticky(window.scrollY > heroBottom - 120);
      }

      const sections = navItems.map((item) =>
        document.querySelector(item.href)
      );
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i] as HTMLElement;
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(navItems[i].href);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [language]);

  return (
    <nav
      className={`sticky top-16 z-30 h-[72px] bg-black/80 backdrop-blur-lg border-b border-[#333333] transition-all duration-300 ${
        isSticky ? "shadow-[0_8px_32px_rgba(0,0,0,0.6)]" : ""
      }`}
    >
      <div className="container h-full flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-nowrap py-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector(item.href);
                if (element) {
                  const offset = 140;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition =
                    elementPosition + window.scrollY - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
              className={`relative px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === item.href
                  ? "bg-primary text-black shadow-[0_0_20px_rgba(118,185,0,0.4)]"
                  : "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Link
          href="/shop"
          className="flex-shrink-0 bg-gradient-to-r from-primary to-[#9ACD32] text-black font-bold py-3 px-8 rounded-full text-sm whitespace-nowrap hover:shadow-[0_0_30px_rgba(118,185,0,0.5)] hover:scale-105 transition-all duration-300"
        >
          {t.shopNow}
        </Link>
      </div>
    </nav>
  );
};

export default StickyNavTabs;