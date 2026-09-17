"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_STORAGE_KEY,
  dictionaries,
  getByPath,
  interpolate,
} from "./dictionaries";

const LanguageContext = createContext(null);

function resolveLocale(code) {
  return LOCALES.some((item) => item.code === code) ? code : DEFAULT_LOCALE;
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved) setLocaleState(resolveLocale(saved));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      document.documentElement.lang = locale;
    } catch {
      /* ignore */
    }
  }, [locale, ready]);

  const setLocale = useCallback((code) => {
    setLocaleState(resolveLocale(code));
  }, []);

  const t = useCallback(
    (path, fallback, vars) => {
      const dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
      let value = getByPath(dict, path);
      if (typeof value !== "string") {
        const en = getByPath(dictionaries.en, path);
        value = typeof en === "string" ? en : fallback ?? path;
      }
      if (vars && typeof vars === "object") {
        return interpolate(value, vars);
      }
      return value;
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      locales: LOCALES,
      ready,
    }),
    [locale, setLocale, t, ready]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
