"use client";

import React from "react";
import { FiMenu } from "react-icons/fi";
import LanguageSwitcher from "@/app/components/ux/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const NavBar = ({ onMenuClick }) => {
  const { t } = useLanguage();

  return (
    <header className="admin-topbar sticky top-0 z-30 shrink-0 border-b backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            className="btn-icon md:hidden"
            aria-label={t("common.menu", "Open menu")}
          >
            <FiMenu size={20} />
          </button>
          <p className="hidden truncate text-sm font-semibold tracking-[-0.01em] text-[var(--color-text-secondary)] md:block">
            {t("appName")}
          </p>
        </div>
        <LanguageSwitcher variant="light" align="right" />
      </div>
    </header>
  );
};

export default NavBar;
