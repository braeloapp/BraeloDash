"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getData } from "@/app/API/method";
import { emptyAdminStats, normalizeAdminStats } from "@/lib/adminStats";

const DashboardCards = () => {
  const [stats, setStats] = useState(emptyAdminStats());

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getData("/admin-panel/statistics");
        setStats(normalizeAdminStats(response));
      } catch (error) {
        console.error("Error fetching admin statistics:", error);
      }
    };
    load();
  }, []);

  const cardData = [
    {
      id: 1,
      title: "Total Listing",
      value: stats.listings.total,
      img: "/r1.png",
    },
    {
      id: 2,
      title: "Total Users",
      value: stats.users.total,
      img: "/ads.svg",
    },
    {
      id: 3,
      title: "Support Requests",
      value: stats.support_requests.total,
      img: "/ads.svg",
    },
    {
      id: 4,
      title: "Total Businesses",
      value: stats.businesses.total,
      img: "/r1.png",
    },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="rounded-2xl border border-[#F3E2B8] bg-[#feefcb] p-3 shadow-card sm:p-5"
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <Image
                src={card.img}
                alt=""
                width={40}
                height={40}
                className="rounded-full bg-[#EE9E03] p-2"
              />
              <h5 className="text-center text-[22px] font-semibold tracking-tight text-[#495057]">
                {card.value ?? 0}
              </h5>
              <p className="text-center text-[13px] font-medium text-[#78828A] sm:text-[16px]">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
