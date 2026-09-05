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
    <div className="mt-5">
      <h1 className="text-[#78828A] text-[24px] font-[500] flex items-center">
        Dashboard
      </h1>
      <div className="grid  xl:grid-cols-4 gap-5 mt-5">
        {cardData.map((card) => (
          <div
            key={card.id}
            className=" p-6 bg-[#feefcb] border border-gray-100 rounded-lg shadow"
          >
            <div className="flex flex-col justify-center items-center gap-5">
              <Image
                src={card.img}
                alt="image"
                width={40}
                height={40}
                className="bg-[#EE9E03] p-2 rounded-full flex items-center"
              />
              <h5 className="text-center text-[22px] font-semibold tracking-tight text-[#495057] flex items-center">
                {card.value ?? 0}
              </h5>
              <h5 className="text-center text-[16px]  font-semibold tracking-tight text-[#495057] flex items-center">
                {card.title}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
