"use client";

import React, { useMemo } from "react";
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
import { categoryEntries } from "@/lib/adminStats";
import { useDashboardStats } from "@/app/components/Dashboard/DashboardStatsContext";
import AppLoader from "@/app/components/ux/AppLoader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LISTINGS_COLOR = "#CD9403";

const ListingCategorystats = () => {
  const { stats, loading, error } = useDashboardStats();

  const chartData = useMemo(() => {
    if (error) {
      return {
        labels: ["Unable to load data"],
        datasets: [
          {
            label: "Total Listings",
            data: [0],
            backgroundColor: "#d1d5db",
          },
        ],
      };
    }

    const entries = categoryEntries(stats.listings.by_category);
    if (entries.length === 0) {
      return {
        labels: ["No listing data"],
        datasets: [
          {
            label: "Total Listings",
            data: [0],
            backgroundColor: LISTINGS_COLOR,
          },
        ],
      };
    }

    return {
      labels: entries.map((entry) => entry.name),
      datasets: [
        {
          label: "Total Listings",
          data: entries.map((entry) => entry.listings),
          backgroundColor: LISTINGS_COLOR,
        },
      ],
    };
  }, [stats, error]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Listings by Category",
        font: { size: 24 },
        color: "#78828A",
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <AppLoader showLabel={false} />
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ListingCategorystats;
