"use client";

import React, { useEffect, useState } from "react";
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
import { getData } from "@/app/API/method";
import { emptyAdminStats, normalizeAdminStats } from "@/lib/adminStats";

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
  const [stats, setStats] = useState(emptyAdminStats());

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getData("/admin-panel/statistics");
        setStats(normalizeAdminStats(response));
      } catch (error) {
        console.error("Error fetching user statistics:", error);
      }
    };
    load();
  }, []);

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
    <div className="w-full h-96">
      <Bar data={data} options={options} />
    </div>
  );
};

export default UserStatistics;
