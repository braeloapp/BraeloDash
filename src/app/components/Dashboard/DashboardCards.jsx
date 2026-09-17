"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  FiBriefcase,
  FiPackage,
  FiLifeBuoy,
  FiUsers,
  FiArrowUpRight,
} from "react-icons/fi";
import { useDashboardStats } from "./DashboardStatsContext";
import { KpiSkeleton } from "@/app/components/ux/Skeleton";
import PageState from "@/app/components/ux/PageState";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const DashboardCards = () => {
  const { t } = useLanguage();
  const { stats, loading, error, reload } = useDashboardStats();

  const cards = useMemo(
    () => [
      {
        id: "listings",
        title: t("dashboard.totalListings"),
        href: "/pages/listing",
        icon: FiPackage,
        getValue: (s) => s.listings.total,
        getHint: (s) =>
          t("dashboard.activeHint", undefined, { count: s.listings.active || 0 }),
      },
      {
        id: "users",
        title: t("dashboard.totalUsers"),
        href: "/pages/users",
        icon: FiUsers,
        getValue: (s) => s.users.total,
        getHint: (s) =>
          t("dashboard.activeHint", undefined, { count: s.users.active || 0 }),
      },
      {
        id: "support",
        title: t("dashboard.supportRequests"),
        href: "/pages/support",
        icon: FiLifeBuoy,
        getValue: (s) => s.support_requests.total,
        getHint: (s) =>
          t("dashboard.openHint", undefined, {
            count: s.support_requests.open || 0,
          }),
      },
      {
        id: "businesses",
        title: t("dashboard.totalBusinesses"),
        href: "/pages/business",
        icon: FiBriefcase,
        getValue: (s) => s.businesses.total,
        getHint: (s) =>
          t("dashboard.activeHint", undefined, {
            count: s.businesses.active || 0,
          }),
      },
    ],
    [t]
  );

  if (loading) return <KpiSkeleton cards={4} />;

  if (error) {
    return (
      <PageState
        status="error"
        title={t("dashboard.loadMetricsError")}
        description={t("dashboard.loadMetricsErrorDesc")}
        onRetry={reload}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.id}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-card transition duration-150 hover:-translate-y-0.5 hover:border-[#f0e2b3] hover:shadow-panel sm:p-5"
          >
            <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-brand-gold opacity-80" />
            <div className="flex items-start justify-between gap-3 pl-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink">
                  {card.getValue(stats) ?? 0}
                </p>
                <p className="mt-1 text-xs text-brand-faint">{card.getHint(stats)}</p>
              </div>
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E8] text-brand-gold transition group-hover:bg-brand-cream">
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
  );
};

export default DashboardCards;
