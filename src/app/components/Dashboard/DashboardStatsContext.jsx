"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getData } from "@/app/API/method";
import {
  emptyAdminStats,
  isEmptyStats,
  normalizeAdminStats,
  statsFromOverview,
} from "@/lib/adminStats";

const DashboardStatsContext = createContext(null);

const PERIODS = ["today", "7d", "30d", "90d"];

function extractRecentUsers(payload) {
  const data = payload?.data ?? payload ?? {};
  const results = data.results || data.users || (Array.isArray(data) ? data : []);
  if (!Array.isArray(results)) return [];
  return results.slice(0, 8).map((user) => ({
    id: user.id,
    name: user.name || user.username || user.email || `User ${user.id}`,
    email: user.email || "",
    city: user.city || "",
    created_at: user.created_at || null,
  }));
}

export function DashboardStatsProvider({ children }) {
  const [stats, setStats] = useState(emptyAdminStats());
  const [overview, setOverview] = useState(null);
  const [period, setPeriod] = useState("90d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const overviewPromise = getData(
        `/admin-panel/analytics/overview?period=${period}`,
        { bypass: true, ttlMs: 0 }
      );
      const statsPromise = getData("/admin-panel/statistics", {
        ttlMs: 0,
        bypass: true,
      }).catch(() => null);
      const usersPromise = getData("/admin-panel/users?page=1&page_size=8", {
        ttlMs: 30_000,
        bypass: true,
      }).catch(() => null);

      const [overviewRes, statsRes, usersRes] = await Promise.all([
        overviewPromise,
        statsPromise,
        usersPromise,
      ]);

      const overviewData = overviewRes?.data || overviewRes || null;
      if (!overviewData?.kpis) {
        throw new Error("Analytics overview missing kpis");
      }
      setOverview(overviewData);

      const recentFromStats = normalizeAdminStats(statsRes).recent_active_users;
      const recentUsers =
        recentFromStats.length > 0
          ? recentFromStats
          : extractRecentUsers(usersRes);

      const fromOverview = statsFromOverview(overviewData, recentUsers);
      const fromStatistics = normalizeAdminStats(statsRes);

      // Prefer overview totals when /statistics is empty or broken.
      setStats(
        isEmptyStats(fromStatistics)
          ? fromOverview
          : {
              ...fromStatistics,
              ...fromOverview,
              recent_active_users:
                fromStatistics.recent_active_users?.length > 0
                  ? fromStatistics.recent_active_users
                  : recentUsers,
              growth:
                fromOverview.growth?.labels?.length > 0
                  ? fromOverview.growth
                  : fromStatistics.growth,
            }
      );
    } catch (err) {
      console.error("Error fetching dashboard analytics:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({
      stats,
      overview,
      period,
      setPeriod,
      periods: PERIODS,
      loading,
      error,
      reload: load,
    }),
    [stats, overview, period, loading, error, load]
  );

  return (
    <DashboardStatsContext.Provider value={value}>
      {children}
    </DashboardStatsContext.Provider>
  );
}

export function useDashboardStats() {
  const ctx = useContext(DashboardStatsContext);
  if (!ctx) {
    throw new Error("useDashboardStats must be used within DashboardStatsProvider");
  }
  return ctx;
}
