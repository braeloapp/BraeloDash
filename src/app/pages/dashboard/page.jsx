"use client";
import React from "react";
import DashboardCards from "@/app/components/Dashboard/DashboardCards";
import DataChart from "@/app/components/Dashboard/DataChart";
import HalfPieChart from "@/app/components/Dashboard/HalfPieChart";
import ActiveUsers from "@/app/components/Dashboard/ActiveUsers";
import Banner from "@/app/components/Dashboard/banner";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <Banner />
      <DashboardCards />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-7">
          <DataChart />
        </div>
        <div className="col-span-12 md:col-span-5">
          <HalfPieChart />
        </div>
      </div>
      <ActiveUsers />
    </div>
  );
};

export default Dashboard;
