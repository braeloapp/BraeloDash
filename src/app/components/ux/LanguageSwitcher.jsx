"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiCheck, FiGlobe } from "react-icons/fi";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * Compact language picker — English / Português / Español.
 */
export default function LanguageSwitcher({
  variant = "light",
  className = "",
  align = "right",
}) {
  const { locale, setLocale, locales, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = locales.find((item) => item.code === locale) || locales[0];

  useEffect(() => {
    const onPointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isDark = variant === "dark";

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`.trim()}>
      <button
        type="button"
        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold tracking-wide transition ${
          isDark
            ? "border-white/15 bg-white/[0.06] text-white/90 hover:bg-white/10"
            : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[#f0e2b3] hover:text-[var(--color-brand)]"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("account.language", "Language")}
        onClick={() => setOpen((prev) => !prev)}
      >
        <FiGlobe size={14} aria-hidden />
        <span>{current.short}</span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={t("account.language", "Language")}
          className={`absolute z-[80] mt-2 min-w-[168px] overflow-hidden rounded-2xl border shadow-[0_16px_40px_rgba(23,30,34,0.14)] ${
            align === "left" ? "left-0" : "right-0"
          } ${
            isDark
              ? "border-white/10 bg-[#2a3137] text-white"
              : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)]"
          }`}
        >
          <p
            className={`px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              isDark ? "text-white/40" : "text-[var(--color-text-muted)]"
            }`}
          >
            {t("account.language", "Language")}
          </p>
          {locales.map((item) => {
            const active = item.code === locale;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={active}
                className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition ${
                  active
                    ? isDark
                      ? "bg-[#CD9403]/20 text-[#FFCC35]"
                      : "bg-[#fff8e8] text-[var(--color-brand)]"
                    : isDark
                      ? "hover:bg-white/5"
                      : "hover:bg-[#fbfcfe]"
                }`}
                onClick={() => {
                  setLocale(item.code);
                  setOpen(false);
                }}
              >
                <span className="font-medium">{item.label}</span>
                {active ? <FiCheck size={14} aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
