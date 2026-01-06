import { en, TranslationKeys } from "./translations/en";
import { ar } from "./translations/ar";
import { ur } from "./translations/ur";
import { zh } from "./translations/zh";
import { es } from "./translations/es";
import { fr } from "./translations/fr";
import { Language } from "@/store/languageStore";

const translations: Record<Language, TranslationKeys> = {
  en,
  ar,
  ur,
  zh,
  es,
  fr,
};

export const getTranslations = (lang: Language): TranslationKeys => {
  return translations[lang] || translations.en;
};

export type { TranslationKeys };
