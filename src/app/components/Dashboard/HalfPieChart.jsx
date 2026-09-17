"use client";

import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDashboardStats } from "./DashboardStatsContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const HalfPieChart = () => {
  const { t } = useLanguage();
  const { stats, loading } = useDashboardStats();

  const data = useMemo(
    () => ({
      labels: [
        t("dashboard.legendActiveListings"),
        t("dashboard.legendInactiveListings"),
        t("dashboard.legendReports"),
        t("dashboard.legendOpenSupport"),
      ],
      datasets: [
        {
          data: [
            stats.listings.active || 0,
            stats.listings.inactive || 0,
            stats.reports.pending || stats.reports.total || 0,
            (stats.support_requests.open || 0) +
              (stats.support_requests.in_progress || 0),
          ],
          backgroundColor: ["#06B64C", "#ACB6BE", "#C7233F", "#CD9403"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    }),
    [stats, t]
  );

  const options = useMemo(
    () => ({
      rotation: -90,
      circumference: 180,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 14,
            color: "#78828A",
            font: { size: 11, weight: "500" },
          },
        },
        tooltip: {
          backgroundColor: "#232F30",
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            label(tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <div className="app-card flex h-full flex-col">
      <div className="mb-2 text-center sm:text-left">
        <h2 className="section-title">{t("dashboard.listingModeration")}</h2>
        <p className="page-desc">{t("dashboard.listingModerationDesc")}</p>
      </div>
      <div className="mx-auto flex w-full max-w-[300px] flex-1 items-center">
        {loading ? (
          <div className="skeleton mx-auto h-40 w-full max-w-[240px] rounded-full" />
        ) : (
          <Doughnut data={data} options={{ ...options, maintainAspectRatio: true }} />
        )}
      </div>
    </div>
  );
};

export default HalfPieChart;
