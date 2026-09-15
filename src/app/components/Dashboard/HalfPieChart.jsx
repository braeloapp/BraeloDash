"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getData } from "@/app/API/method";
import { emptyAdminStats, normalizeAdminStats } from "@/lib/adminStats";

ChartJS.register(ArcElement, Tooltip, Legend);

const HalfPieChart = () => {
  const [stats, setStats] = useState(emptyAdminStats());

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getData("/admin-panel/statistics");
        setStats(normalizeAdminStats(response));
      } catch (error) {
        console.error("Error fetching listing status:", error);
      }
    };
    load();
  }, []);

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
        backgroundColor: [
          "#049B1C",
          "#B4BEC8",
          "#FF0000",
          "#F2A40C",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-[#F8F9FA] p-4 sm:p-5">
      <h2 className="mb-2 text-center text-lg font-semibold text-[#495057] sm:text-xl">
        Listing & Moderation Status
      </h2>
      <div className="mx-auto flex w-full max-w-[320px] flex-1 items-center">
        <Doughnut data={data} options={{ ...options, maintainAspectRatio: true }} />
      </div>
    </div>
  );
};

export default HalfPieChart;
