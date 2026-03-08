"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { getMessage, type Locale } from "./messages";

const LOCALE_KEY = "lds-locale";
const LOCALE_COOKIE = "lds-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const LocaleContext = React.createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
} | null>(null);

function setLocaleCookie(value: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? "en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (initialLocale) {
      setLocaleState(initialLocale);
      setMounted(true);
      return;
    }
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (stored && (stored === "en" || stored === "fr" || stored === "ar")) {
      setLocaleState(stored);
    }
    setMounted(true);
  }, [initialLocale]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale === "ar" ? "ar" : locale === "fr" ? "fr" : "en";
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale, mounted]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_KEY, next);
      setLocaleCookie(next);
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => getMessage(locale, key, params),
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
