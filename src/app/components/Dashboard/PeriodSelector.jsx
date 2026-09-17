"use client";

import React from "react";
import { useDashboardStats } from "./DashboardStatsContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const LABELS = {
  today: "Today",
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
};

export default function PeriodSelector() {
  const { t } = useLanguage();
  const { period, setPeriod, periods, loading } = useDashboardStats();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
        {t("dashboard.period", "Period")}
      </span>
      <div className="inline-flex rounded-xl border border-[var(--color-border)] bg-white p-1">
        {periods.map((key) => {
          const active = period === key;
          return (
            <button
              key={key}
              type="button"
              disabled={loading}
              onClick={() => setPeriod(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-brand-gold text-white shadow-sm"
                  : "text-brand-muted hover:bg-[var(--color-surface-elevated)] hover:text-brand-ink"
              }`}
            >
              {t(`dashboard.periods.${key}`, LABELS[key] || key)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
