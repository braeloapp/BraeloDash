"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDashboardStats } from "./DashboardStatsContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const HalfPieChart = () => {
  const { stats, loading } = useDashboardStats();

  const data = {
    labels: ["Active listings", "Inactive listings", "Reports", "Open support"],
    datasets: [
      {
        data: [
          stats.listings.active || 0,
          stats.listings.inactive || 0,
          stats.reports.total || 0,
          stats.support_requests.open || 0,
        ],
        backgroundColor: ["#06B64C", "#ACB6BE", "#C7233F", "#CD9403"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
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
  };

  return (
    <div className="app-card flex h-full flex-col">
      <div className="mb-2 text-center sm:text-left">
        <h2 className="section-title">Listing & moderation</h2>
        <p className="page-desc">Active inventory vs open issues.</p>
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
