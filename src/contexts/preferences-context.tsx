"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'CAD' | 'USD';
type Language = 'en' | 'fr';

interface PreferencesContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  convertPrice: (price: number) => string;
  getText: (en: string, fr: string) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('CAD');
  const [language, setLanguage] = useState<Language>('en');

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('hotzy-currency') as Currency;
    const savedLanguage = localStorage.getItem('hotzy-language') as Language;
    
    if (savedCurrency && (savedCurrency === 'CAD' || savedCurrency === 'USD')) {
      setCurrency(savedCurrency);
    }
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('hotzy-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('hotzy-language', language);
  }, [language]);

  const convertPrice = (price: number): string => {
    if (currency === 'USD') {
      return (price * 0.72).toFixed(2);
    }
    return price.toFixed(2);
  };

  const getText = (en: string, fr: string): string => {
    return language === 'en' ? en : fr;
  };

  return (
    <PreferencesContext.Provider
      value={{
        currency,
        setCurrency,
        language,
        setLanguage,
        convertPrice,
        getText,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
