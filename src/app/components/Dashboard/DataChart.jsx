"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getData } from "@/app/API/method";
import { emptyAdminStats, normalizeAdminStats } from "@/lib/adminStats";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CollectionChart = () => {
  const [stats, setStats] = useState(emptyAdminStats());

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        const response = await getData("/admin-panel/statistics");
        setStats(normalizeAdminStats(response));
      } catch (error) {
        console.error("Error fetching collection data:", error);
      }
    };

    fetchCollectionData();
  }, []);

  const chartData = {
    labels: ["Total Listings", "Businesses", "Users"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.listings.total || 0,
          stats.businesses.total || 0,
          stats.users.total || 0,
        ],
        backgroundColor: ["#F3A000", "#FFE8BA", "#C98903"],
        borderColor: ["#C98903", "#C98903", "#C98903"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Count" },
      },
    },
  };

  return (
    <div>
      <h4 className="text-xl font-semibold my-4 ">Total Listings, Businesses & Users</h4>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CollectionChart;
