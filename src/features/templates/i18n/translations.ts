import type { Locale, Translations } from "./types";

import enTranslations from "./locales/en.json";
import jaTranslations from "./locales/ja.json";

export const translations: Record<Locale, Translations> = {
  en: enTranslations,
  ja: jaTranslations,
};

export const defaultLocale: Locale = "en";

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations[defaultLocale];
}

