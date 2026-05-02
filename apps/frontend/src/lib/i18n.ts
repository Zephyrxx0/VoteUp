export const locales = ['en', 'hi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function getLocaleFromCookie(cookieLocale: string | undefined): Locale {
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }
  return defaultLocale;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}