"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "ar" | "ur" | "zh" | "es" | "fr";

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  flag: string;
}

export const languages: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", direction: "ltr", flag: "🇺🇸" },
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl", flag: "🇸🇦" },
  { code: "ur", name: "Urdu", nativeName: "اردو", direction: "rtl", flag: "🇵🇰" },
  { code: "zh", name: "Chinese", nativeName: "中文", direction: "ltr", flag: "🇨🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr", flag: "🇫🇷" },
];

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  getLanguageInfo: () => LanguageInfo;
  getDirection: () => "ltr" | "rtl";
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: "en",
      setLanguage: (lang) => set({ currentLanguage: lang }),
      getLanguageInfo: () => languages.find((l) => l.code === get().currentLanguage) || languages[0],
      getDirection: () => get().getLanguageInfo().direction,
    }),
    { name: "language-storage" }
  )
);
