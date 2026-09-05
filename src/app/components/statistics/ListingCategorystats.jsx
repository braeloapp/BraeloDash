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
import { categoryEntries, normalizeAdminStats } from "@/lib/adminStats";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LISTINGS_COLOR = "#CD9403";

const ListingCategorystats = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getData("/admin-panel/statistics");
        const stats = normalizeAdminStats(response);
        const entries = categoryEntries(stats.listings.by_category);

        if (entries.length === 0) {
          setChartData({
            labels: ["No listing data"],
            datasets: [
              {
                label: "Total Listings",
                data: [0],
                backgroundColor: LISTINGS_COLOR,
              },
            ],
          });
          return;
        }

        setChartData({
          labels: entries.map((entry) => entry.name),
          datasets: [
            {
              label: "Total Listings",
              data: entries.map((entry) => entry.listings),
              backgroundColor: LISTINGS_COLOR,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setChartData({
          labels: ["Unable to load data"],
          datasets: [
            {
              label: "Total Listings",
              data: [0],
              backgroundColor: "#d1d5db",
            },
          ],
        });
      }
    };

    fetchListings();
  }, []);

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

  return (
    <div className="w-full h-96">
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default ListingCategorystats;
