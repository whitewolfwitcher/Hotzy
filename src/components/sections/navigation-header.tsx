"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Menu, X, ShoppingCart, DollarSign } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { usePreferences } from '@/contexts/preferences-context';

const HotzyLogo = () => (
  <svg
    width="120"
    height="40"
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Hotzy"
    role="img"
  >
    <text x="0" y="30" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="900" fill="#76B900">HOTZY</text>
  </svg>
);

const NavigationHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { getTotalItems } = useCart();
    const { currency, setCurrency, language, setLanguage } = usePreferences();
    const cartItemCount = getTotalItems();

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const mainNavItems = [
        { name: "Collections", href: "/#design-gallery" },
        { name: "Customizer", href: "/customizer" },
        { name: "Gallery", href: "/#gallery" },
        { name: "Discover", href: "/discover" }
    ];
    const utilityNavItems = [
        { name: "Shop", href: "/shop" }
    ];

    return (
        <>
            <header className="sticky top-0 z-[1000] w-full bg-black/95 backdrop-blur-sm h-16 text-white border-b border-border">
                <div className="container flex h-full items-center justify-between">
                    <div className="flex items-center gap-x-8">
                        <Link href="/" aria-label="Hotzy Homepage">
                            <HotzyLogo />
                        </Link>
                        <nav className="hidden lg:flex">
                            <ul className="flex items-center gap-x-6">
                                {mainNavItems.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm font-medium hover:text-primary transition-colors">{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center">
                        <nav className="hidden lg:flex items-center">
                            <ul className="flex items-center gap-x-6">
                                {utilityNavItems.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-sm font-medium hover:text-primary transition-colors">{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-center gap-x-4 ml-6">
                                <Link href="/checkout" aria-label="Shopping cart" className="hover:text-primary transition-colors relative">
                                    <ShoppingCart size={20} />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                                <button 
                                    onClick={() => setCurrency(currency === 'CAD' ? 'USD' : 'CAD')}
                                    aria-label="Toggle currency" 
                                    className="hover:text-primary transition-colors flex items-center gap-1">
                                    <DollarSign size={18} />
                                    <span className="text-xs font-bold">{currency}</span>
                                </button>
                                <button 
                                    onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                                    aria-label="Toggle language" 
                                    className="hover:text-primary transition-colors flex items-center gap-1">
                                    <Globe size={18} />
                                    <span className="text-xs font-bold">{language.toUpperCase()}</span>
                                </button>
                            </div>
                        </nav>

                        <div className="flex items-center gap-x-4 lg:hidden">
                            <Link href="/checkout" aria-label="Shopping cart" className="hover:text-primary transition-colors relative">
                                <ShoppingCart size={22} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                            <button 
                                onClick={() => setCurrency(currency === 'CAD' ? 'USD' : 'CAD')}
                                aria-label="Toggle currency" 
                                className="hover:text-primary transition-colors flex items-center gap-1">
                                <DollarSign size={20} />
                                <span className="text-xs font-bold">{currency}</span>
                            </button>
                            <button 
                                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                                aria-label="Toggle language" 
                                className="hover:text-primary transition-colors flex items-center gap-1">
                                <Globe size={20} />
                                <span className="text-xs font-bold">{language.toUpperCase()}</span>
                            </button>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="z-[1001]">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 bg-black z-[999] overflow-y-auto">
                    <div className="container py-6">
                        <nav className="flex flex-col">
                            {mainNavItems.map((item) => (
                                <Link href={item.href} key={item.name} className="py-3 text-lg font-medium text-white hover:text-primary">{item.name}</Link>
                            ))}
                            <div className="border-t border-border my-4" />
                            {utilityNavItems.map((item) => (
                                <Link href={item.href} key={item.name} className="py-3 text-lg text-white hover:text-primary">{item.name}</Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavigationHeader;