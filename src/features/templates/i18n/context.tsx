"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { Locale, Translations } from "./types";
import { defaultLocale, getTranslations } from "./translations";

interface TemplateI18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const TemplateI18nContext = createContext<TemplateI18nContextValue | undefined>(undefined);

export function TemplateI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = getTranslations(locale);

  return (
    <TemplateI18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TemplateI18nContext.Provider>
  );
}

export function useTemplateI18n() {
  const context = useContext(TemplateI18nContext);
  if (!context) {
    throw new Error("useTemplateI18n must be used within TemplateI18nProvider");
  }
  return context;
}

