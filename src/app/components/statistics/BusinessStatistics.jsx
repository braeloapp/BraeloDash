"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDashboardStats } from "@/app/components/Dashboard/DashboardStatsContext";
import AppLoader from "@/app/components/ux/AppLoader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    title: {
      display: true,
      text: "Business Growth Statistics",
      font: {
        size: 24,
      },
      color: "#78828A",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Month",
      },
    },
    y: {
      title: {
        display: true,
        text: "New businesses",
      },
      beginAtZero: true,
    },
  },
};

const BusinessStatistics = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <AppLoader showLabel={false} />
      </div>
    );
  }

  const data = {
    labels: stats.growth.labels.length ? stats.growth.labels : ["No data"],
    datasets: [
      {
        label: "Business Growth",
        data: stats.growth.businesses.length ? stats.growth.businesses : [0],
        borderColor: "#CD9403",
        backgroundColor: "rgba(205, 148, 3, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="h-96 w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default BusinessStatistics;
