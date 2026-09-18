"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  FiAlertTriangle,
  FiArrowUpRight,
  FiBriefcase,
  FiLifeBuoy,
  FiPackage,
  FiUsers,
} from "react-icons/fi";
import { useDashboardStats } from "./DashboardStatsContext";
import { KpiSkeleton } from "@/app/components/ux/Skeleton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PeriodKpis() {
  const { t } = useLanguage();
  const { overview, loading, period } = useDashboardStats();
  const kpis = overview?.kpis;

  const cards = useMemo(() => {
    if (!kpis) return [];
    return [
      {
        id: "users",
        title: t("dashboard.newInPeriod", "New users"),
        value: kpis.users?.new_period ?? 0,
        hint: t("dashboard.activeHint", undefined, {
          count: kpis.users?.active || 0,
        }),
        href: "/pages/users",
        icon: FiUsers,
      },
      {
        id: "listings",
        title: t("dashboard.newListingsPeriod", "New listings"),
        value: kpis.listings?.new_period ?? 0,
        hint: t("dashboard.activeHint", undefined, {
          count: kpis.listings?.active || 0,
        }),
        href: "/pages/listing",
        icon: FiPackage,
      },
      {
        id: "businesses",
        title: t("dashboard.newBusinessPeriod", "New businesses"),
        value: kpis.businesses?.new_period ?? 0,
        hint: t("dashboard.activeHint", undefined, {
          count: kpis.businesses?.active || 0,
        }),
        href: "/pages/business",
        icon: FiBriefcase,
      },
      {
        id: "moderation",
        title: t("dashboard.reportsPending", "Reports pending"),
        value: kpis.moderation?.pending_reports ?? 0,
        hint: t("dashboard.openHint", undefined, {
          count:
            (kpis.support?.open || 0) + (kpis.support?.in_progress || 0),
        }),
        href: "/pages/reportedusers",
        icon: FiAlertTriangle,
      },
    ];
  }, [kpis, t]);

  if (loading && !overview) return <KpiSkeleton cards={4} />;
  if (!kpis) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-brand-muted">
        {t("dashboard.periodKpisLabel", "Growth in selected period")} · {period}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-card transition duration-150 hover:-translate-y-0.5 hover:border-[#f0e2b3] hover:shadow-panel sm:p-5"
            >
              <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#D8B039] opacity-80" />
              <div className="flex items-start justify-between gap-3 pl-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    {card.title}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-brand-faint">{card.hint}</p>
                </div>
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E8] text-brand-gold">
                  <Icon size={20} aria-hidden />
                </div>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 pl-2 text-xs font-medium text-brand-gold opacity-0 transition group-hover:opacity-100">
                {t("common.view")} <FiArrowUpRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        <Link
          href="/pages/support"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-brand-ink hover:border-[#f0e2b3]"
        >
          <FiLifeBuoy size={12} />
          {t("dashboard.supportOpen")}:{" "}
          {(kpis.support?.open || 0) + (kpis.support?.in_progress || 0)}
        </Link>
        <Link
          href="/pages/reportedusers"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-brand-ink hover:border-[#f0e2b3]"
        >
          {t("nav.items.Reported Users", "Reported Users")}
        </Link>
      </div>
    </div>
  );
}
