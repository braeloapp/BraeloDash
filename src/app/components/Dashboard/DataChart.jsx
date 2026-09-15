"use client";

import React from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CollectionChart = () => {
  const { stats, loading } = useDashboardStats();

  const chartData = {
    labels: ["Listings", "Businesses", "Users"],
    datasets: [
      {
        label: "Count",
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

  const options = {
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
          text: "Count",
          color: "#ACB6BE",
          font: { size: 11, weight: "500" },
        },
      },
    },
  };

  return (
    <div className="app-card h-full">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="section-title">Platform volume</h4>
          <p className="page-desc">Listings, businesses, and users at a glance.</p>
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
