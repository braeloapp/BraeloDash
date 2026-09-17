"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default function AppProviders({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
