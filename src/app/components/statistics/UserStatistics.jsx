"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDashboardStats } from "@/app/components/Dashboard/DashboardStatsContext";
import AppLoader from "@/app/components/ux/AppLoader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    title: {
      display: true,
      text: "User Statistics",
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
        text: "Users",
      },
      beginAtZero: true,
    },
  },
};

const UserStatistics = () => {
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
        label: "Users",
        data: stats.growth.users.length ? stats.growth.users : [0],
        backgroundColor: "#CD9403",
        borderColor: "#CD9403",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-96 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default UserStatistics;
