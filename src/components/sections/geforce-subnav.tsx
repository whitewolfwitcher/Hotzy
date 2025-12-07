"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";

const navItems = [
  { name: "Products", href: "#", hasDropdown: true },
  { name: "Collections & Technologies", href: "#", hasDropdown: true },
  { name: "Care Guide", href: "#" },
  { name: "Recipes", href: "#" },
  { name: "News", href: "#" },
  { name: "Support", href: "#" },
  { name: "Shop", href: "#" },
];

const GeForceSubNav = () => {
  return (
    <header className="sticky top-16 z-40 h-14 w-full bg-black">
      <div className="container flex h-full items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-white text-2xl font-black font-heading tracking-tighter">
            Hotzy
          </Link>
          <nav className="ml-10 hidden lg:block">
            <ul className="flex items-center space-x-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.hasDropdown ? (
                    <button className="flex items-center text-nav text-white hover:text-primary transition-colors">
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-nav text-white hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="lg:hidden">
          <button title="Open menu" className="text-white p-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default GeForceSubNav;