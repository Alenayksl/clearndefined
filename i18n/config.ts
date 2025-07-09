export const locales = ['en', 'tr'] as const
export const defaultLocale = 'en'

export const getLocaleFromPath = (path: string) => {
  const locale = locales.find((loc) => path.startsWith(`/${loc}`))
  return locale || defaultLocale
}

export type Locale = typeof locales[number]
