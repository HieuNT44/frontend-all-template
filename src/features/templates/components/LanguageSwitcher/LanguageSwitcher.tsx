"use client";

import { Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTemplateI18n } from "../../i18n/context";
import type { Locale } from "../../i18n/types";

const localeLabels: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useTemplateI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
          <Globe className="size-4" />
          <span>{localeLabels[locale]}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale("en")}>
          <span className={locale === "en" ? "font-semibold" : ""}>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("ja")}>
          <span className={locale === "ja" ? "font-semibold" : ""}>日本語</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

