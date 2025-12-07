"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const GeoLocatorBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
  };

  const countries = [
    { value: "ar", label: "Argentina" },
    { value: "au", label: "Australia" },
    { value: "be-nl", label: "België (Belgium)" },
    { value: "be-fr", label: "Belgique (Belgium)" },
    { value: "br", label: "Brasil (Brazil)" },
    { value: "ca", label: "Canada" },
    { value: "cz", label: "Česká Republika (Czech Republic)" },
    { value: "cl", label: "Chile" },
    { value: "co", label: "Colombia" },
    { value: "dk", label: "Danmark (Denmark)" },
    { value: "de", label: "Deutschland (Germany)" },
    { value: "es", label: "España (Spain)" },
    { value: "fr", label: "France" },
    { value: "in", label: "India" },
    { value: "it", label: "Italia (Italy)" },
    { value: "mx", label: "México (Mexico)" },
    { value: "me", label: "Middle East" },
    { value: "nl", label: "Nederland (Netherlands)" },
    { value: "no", label: "Norge (Norway)" },
    { value: "at", label: "Österreich (Austria)" },
    { value: "pe", label: "Peru" },
    { value: "pl", label: "Polska (Poland)" },
    { value: "eu", label: "Rest of Europe" },
    { value: "ro", label: "România (Romania)" },
    { value: "sg", label: "Singapore" },
    { value: "fi", label: "Suomi (Finland)" },
    { value: "se", label: "Sverige (Sweden)" },
    { value: "tr", label: "Türkiye (Turkey)" },
    { value: "gb", label: "United Kingdom" },
    { value: "us", label: "United States" },
    { value: "kr", label: "대한민국 (South Korea)" },
    { value: "cn", label: "中国大陆 (Mainland China)" },
    { value: "tw", label: "台灣 (Taiwan)" },
    { value: "jp", label: "日本 (Japan)" },
  ];

  return (
    <div className="relative z-[100] w-full bg-[#f5f5f5] text-[#333333]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-8 py-4 text-center lg:flex-nowrap lg:justify-between lg:px-8">
        <p className="max-w-xl text-sm leading-6 lg:text-left">
          Visit your regional NVIDIA website for local content, pricing and where to buy partners specific to your location.
        </p>
        <div className="flex flex-shrink-0 items-center gap-4">
          <Select defaultValue="us">
            <SelectTrigger className="h-9 w-[200px] border-[#cccccc] bg-white text-sm focus:ring-ring">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {countries.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="focus:bg-gray-100">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild className="h-9 bg-[#76b900] px-5 text-sm font-bold text-white hover:bg-[#9acd32] uppercase tracking-[0.02em]">
            <a href="https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/">
              Continue
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-9 w-9 text-[#666666] hover:bg-black/10 hover:text-[#333333]"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeoLocatorBanner;