"use client";

import React from "react";
import { FiMenu } from "react-icons/fi";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const NavBar = ({ onMenuClick }) => {
  const { t } = useLanguage();

  return (
    <header className="admin-topbar sticky top-0 z-30 shrink-0 border-b backdrop-blur md:hidden">
      <div className="flex items-center justify-between gap-3 px-3 py-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="btn-icon"
          aria-label={t("common.menu", "Open menu")}
        >
          <FiMenu size={20} />
        </button>
        <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[var(--color-text-secondary)]">
          {t("appName")}
        </p>
      </div>
    </header>
  );
};

export default NavBar;
