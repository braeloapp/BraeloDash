"use client";

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useDashboardStats } from "./DashboardStatsContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function formatDayLabel(isoDate) {
  if (!isoDate) return "";
  try {
    const d = new Date(`${isoDate}T12:00:00`);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return isoDate;
  }
}

const CollectionChart = () => {
  const { t } = useLanguage();
  const { stats, overview, loading } = useDashboardStats();

  const chartData = useMemo(() => {
    const growth = stats.growth || {};
    const hasSeries = Array.isArray(growth.labels) && growth.labels.length > 0;

    if (hasSeries) {
      return {
        labels: growth.labels.map(formatDayLabel),
        datasets: [
          {
            label: t("dashboard.chartListings"),
            data: growth.listings || [],
            backgroundColor: "#CD9403",
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 28,
          },
          {
            label: t("dashboard.chartUsers"),
            data: growth.users || [],
            backgroundColor: "#EE9E03",
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 28,
          },
          {
            label: t("dashboard.chartBusinesses"),
            data: growth.businesses || [],
            backgroundColor: "#D8B039",
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 28,
          },
        ],
      };
    }

    return {
      labels: [
        t("dashboard.chartListings"),
        t("dashboard.chartBusinesses"),
        t("dashboard.chartUsers"),
      ],
      datasets: [
        {
          label: t("dashboard.chartCount"),
          data: [
            stats.listings.total || 0,
            stats.businesses.total || 0,
            stats.users.total || 0,
          ],
          backgroundColor: ["#CD9403", "#D8B039", "#EE9E03"],
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 48,
        },
      ],
    };
  }, [stats, t]);

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          display: Boolean(stats.growth?.labels?.length),
          position: "bottom",
          labels: {
            boxWidth: 10,
            usePointStyle: true,
            pointStyle: "circle",
            color: "#78828A",
            font: { size: 11, weight: "500" },
          },
        },
        tooltip: {
          backgroundColor: "#232F30",
          titleFont: { family: "inherit", size: 12 },
          bodyFont: { family: "inherit", size: 12 },
          padding: 10,
          cornerRadius: 10,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#78828A", font: { size: 11, weight: "500" } },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
          grace: "12%",
          grid: { color: "#EEF1F4" },
          ticks: { color: "#ACB6BE", precision: 0 },
          border: { display: false },
          title: {
            display: true,
            text: t("dashboard.chartCount"),
            color: "#ACB6BE",
            font: { size: 11, weight: "500" },
          },
        },
      },
    }),
    [stats.growth?.labels?.length, t]
  );

  const subtitle = overview?.series
    ? t(
        "dashboard.platformVolumeSeriesDesc",
        "New listings, users, and businesses by day in the selected period."
      )
    : t("dashboard.platformVolumeDesc");

  return (
    <div className="app-card h-full">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="section-title">{t("dashboard.platformVolume")}</h4>
          <p className="page-desc">{subtitle}</p>
        </div>
      </div>
      <div className="h-[220px] lg:h-[260px]">
        {loading ? (
          <div className="skeleton h-full w-full" />
        ) : (
          <Bar data={chartData} options={{ ...options, maintainAspectRatio: false }} />
        )}
      </div>
    </div>
  );
};

export default CollectionChart;
