"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useDashboardStats } from "./DashboardStatsContext";
import Badge from "@/app/components/ux/Badge";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const ActiveUsers = () => {
  const { t } = useLanguage();
  const { stats, loading } = useDashboardStats();
  const recent = stats.recent_active_users.slice(0, 6);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="app-card col-span-12 md:col-span-4">
        <h4 className="section-title">{t("dashboard.userStats")}</h4>
        <p className="page-desc mb-4">{t("dashboard.userStatsDesc")}</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 text-center">
            <p className="caption">{t("common.active")}</p>
            <p className="mt-1 text-2xl font-semibold text-brand-success">
              {loading ? "—" : stats.users.active || 0}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 text-center">
            <p className="caption">{t("dashboard.new7d")}</p>
            <p className="mt-1 text-2xl font-semibold text-brand-gold">
              {loading ? "—" : stats.users.new_7d || 0}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 text-center">
            <p className="caption">{t("dashboard.today")}</p>
            <p className="mt-1 text-2xl font-semibold text-brand-ink">
              {loading ? "—" : stats.users.new_today || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="app-card col-span-12 md:col-span-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="section-title">{t("dashboard.recentUsers")}</p>
            <p className="page-desc">{t("dashboard.recentUsersDesc")}</p>
          </div>
          <Link
            href="/pages/users"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-gold transition hover:text-brand-hover"
          >
            {t("common.viewAll")} <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-8 text-center text-sm text-brand-muted">
            {t("dashboard.noRecentUsers")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {recent.map((person) => {
              const href =
                person?.id != null
                  ? `/pages/users/userdetail?id=${person.id}`
                  : "/pages/users";
              return (
                <Link
                  key={person.id ?? person.email ?? person.name}
                  href={href}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 transition hover:border-[#f0e2b3] hover:bg-[#FFFBF0]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cream text-sm font-semibold text-brand-gold ring-1 ring-[#f0e2b3]">
                      {(person.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-brand-ink">
                        {person.name || t("dashboard.userFallback")}
                      </p>
                      <p className="truncate text-xs text-brand-faint">
                        {person.city || person.email || "—"}
                      </p>
                    </div>
                  </div>
                  <Badge tone="brand">{t("common.view")}</Badge>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveUsers;
