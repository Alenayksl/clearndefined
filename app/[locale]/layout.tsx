import { ReactNode } from 'react'
import { NextIntlClientProvider, useMessages, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { locales } from '../i18n'
import '../../app/globals.css'
import '../styles/Button.module.scss';
import '../styles/globals.scss';


export default function LocaleLayout({
  children,
  params
}: {
  children: ReactNode
  params: { locale: string }
}) {
  const { locale } = params
  if (!hasLocale(locales, locale)) notFound()

  const messages = useMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
