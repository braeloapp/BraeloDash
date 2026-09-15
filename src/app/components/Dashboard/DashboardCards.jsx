"use client";

import React from "react";
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

const CARDS = [
  {
    id: "listings",
    title: "Total Listings",
    href: "/pages/listing",
    icon: FiPackage,
    getValue: (s) => s.listings.total,
    getHint: (s) => `${s.listings.active || 0} active`,
  },
  {
    id: "users",
    title: "Total Users",
    href: "/pages/users",
    icon: FiUsers,
    getValue: (s) => s.users.total,
    getHint: (s) => `${s.users.active || 0} active`,
  },
  {
    id: "support",
    title: "Support Requests",
    href: "/pages/support",
    icon: FiLifeBuoy,
    getValue: (s) => s.support_requests.total,
    getHint: (s) => `${s.support_requests.open || 0} open`,
  },
  {
    id: "businesses",
    title: "Total Businesses",
    href: "/pages/business",
    icon: FiBriefcase,
    getValue: (s) => s.businesses.total,
    getHint: (s) => `${s.businesses.active || 0} active`,
  },
];

const DashboardCards = () => {
  const { stats, loading, error, reload } = useDashboardStats();

  if (loading) return <KpiSkeleton cards={4} />;

  if (error) {
    return (
      <PageState
        status="error"
        title="Unable to load dashboard metrics"
        description="Something went wrong while retrieving the latest statistics."
        onRetry={reload}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card) => {
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
              View <FiArrowUpRight size={12} />
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardCards;
