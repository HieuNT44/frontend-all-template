"use client";

import Image from "next/image";
import Link from "next/link";

import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

const LOGO_URL = "https://tomosia.com.vn/wp-content/themes/tomosia_vn/asset/img/gioi-thieu/logo.png";

export function TemplateHeader() {
  return (
    <header className="TemplateHeader border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src={LOGO_URL}
            alt="TOMOSIA Logo"
            width={120}
            height={40}
            className="h-auto w-auto"
            priority
          />
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

