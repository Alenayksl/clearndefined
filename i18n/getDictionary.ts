import type { Locale } from './config'

export const getDictionary = async (locale: Locale) => {
  try {
    return await import(`./dictionaries/${locale}.json`).then((module) => module.default)
  } catch {
    return await import(`./dictionaries/en.json`).then((module) => module.default)
  }
}
