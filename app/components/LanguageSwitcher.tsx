"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];
  const restOfPath = pathname.split("/").slice(2).join("/");
  const locales = ["en", "tr"];

  return (
    <div style={{ padding: "1rem", background: "red" }}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}/${restOfPath}`}
          style={{
            marginRight: "1rem",
            fontWeight: currentLocale === locale ? "bold" : "normal",
          }}>
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
