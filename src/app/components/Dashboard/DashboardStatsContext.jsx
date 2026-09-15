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
import { emptyAdminStats, normalizeAdminStats } from "@/lib/adminStats";

const DashboardStatsContext = createContext(null);

export function DashboardStatsProvider({ children }) {
  const [stats, setStats] = useState(emptyAdminStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getData("/admin-panel/statistics");
      setStats(normalizeAdminStats(response));
    } catch (err) {
      console.error("Error fetching admin statistics:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({ stats, loading, error, reload: load }),
    [stats, loading, error, load]
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
