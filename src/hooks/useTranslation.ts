"use client";

import { useLanguageStore } from "@/store/languageStore";
import { getTranslations, TranslationKeys } from "@/i18n";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TranslationKey = NestedKeyOf<TranslationKeys>;

export function useTranslation() {
  const { currentLanguage, getDirection } = useLanguageStore();
  const translations = getTranslations(currentLanguage);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  return {
    t,
    lang: currentLanguage,
    dir: getDirection(),
    translations,
  };
}
