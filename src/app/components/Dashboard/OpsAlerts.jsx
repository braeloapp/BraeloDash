"use client";

import React from "react";
import Link from "next/link";
import {
  FiAlertTriangle,
  FiLifeBuoy,
  FiPackage,
  FiUsers,
} from "react-icons/fi";
import { useDashboardStats } from "./DashboardStatsContext";
import { KpiSkeleton } from "@/app/components/ux/Skeleton";
import PageState from "@/app/components/ux/PageState";

const OpsAlerts = () => {
  const { stats, loading, error, reload } = useDashboardStats();

  if (loading) return <KpiSkeleton cards={4} />;

  if (error) {
    return (
      <PageState
        status="error"
        title="Unable to load operational alerts"
        description="Live statistics could not be retrieved."
        onRetry={reload}
      />
    );
  }

  const alerts = [
    {
      id: "reports",
      label: "Reports pending review",
      value: stats.reports?.pending ?? 0,
      href: "/pages/reportedusers",
      icon: FiAlertTriangle,
      tone: "danger",
    },
    {
      id: "support",
      label: "Support tickets open",
      value: (stats.support_requests?.open || 0) + (stats.support_requests?.in_progress || 0),
      href: "/pages/support",
      icon: FiLifeBuoy,
      tone: "warn",
    },
    {
      id: "users",
      label: "New users (7 days)",
      value: stats.users?.new_7d ?? 0,
      href: "/pages/users",
      icon: FiUsers,
      tone: "info",
    },
    {
      id: "listings",
      label: "Active listings",
      value: stats.listings?.active ?? 0,
      href: "/pages/listing",
      icon: FiPackage,
      tone: "ok",
    },
  ];

  const toneClass = {
    danger: "border-[#f3c4cd] bg-[#fff5f7]",
    warn: "border-[#f0e2b3] bg-[#fffaf0]",
    info: "border-[#d7e4f7] bg-[#f5f9ff]",
    ok: "border-[#c6ebd4] bg-[#f3fbf6]",
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {alerts.map((alert) => {
        const Icon = alert.icon;
        return (
          <Link
            key={alert.id}
            href={alert.href}
            className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-card ${toneClass[alert.tone]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                  {alert.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-brand-ink">
                  {alert.value}
                </p>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-gold">
                <Icon size={18} aria-hidden />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default OpsAlerts;
