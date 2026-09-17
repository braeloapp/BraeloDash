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

const CollectionChart = () => {
  const { t } = useLanguage();
  const { stats, loading } = useDashboardStats();

  const chartData = useMemo(
    () => ({
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
    }),
    [stats, t]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#232F30",
          titleFont: { family: "inherit", size: 12 },
          bodyFont: { family: "inherit", size: 12 },
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            label(context) {
              return `${context.label}: ${context.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#78828A", font: { size: 12, weight: "500" } },
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
    [t]
  );

  return (
    <div className="app-card h-full">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="section-title">{t("dashboard.platformVolume")}</h4>
          <p className="page-desc">{t("dashboard.platformVolumeDesc")}</p>
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
