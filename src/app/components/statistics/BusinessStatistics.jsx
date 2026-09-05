"use client";

import React, { useEffect, useState } from "react";
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
import { getData } from "@/app/API/method";
import { emptyAdminStats, normalizeAdminStats } from "@/lib/adminStats";

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
  const [stats, setStats] = useState(emptyAdminStats());

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getData("/admin-panel/statistics");
        setStats(normalizeAdminStats(response));
      } catch (error) {
        console.error("Error fetching business statistics:", error);
      }
    };
    load();
  }, []);

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
    <div className="w-full h-96">
      <Line data={data} options={options} />
    </div>
  );
};

export default BusinessStatistics;
