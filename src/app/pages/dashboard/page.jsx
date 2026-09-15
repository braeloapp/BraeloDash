"use client";
import React from "react";
import DashboardCards from "@/app/components/Dashboard/DashboardCards";
import DataChart from "@/app/components/Dashboard/DataChart";
import HalfPieChart from "@/app/components/Dashboard/HalfPieChart";
import ActiveUsers from "@/app/components/Dashboard/ActiveUsers";
import Banner from "@/app/components/Dashboard/banner";
import PageHeader from "@/app/components/ux/PageHeader";
import { DashboardStatsProvider } from "@/app/components/Dashboard/DashboardStatsContext";

const Dashboard = () => {
  return (
    <DashboardStatsProvider>
      <div className="page-shell">
        <PageHeader
          title="Dashboard"
          description="Operational overview from live admin statistics — what needs attention now."
        />
        <div className="space-y-5 p-4 sm:p-5">
          <Banner />
          <DashboardCards />
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-7">
              <DataChart />
            </div>
            <div className="col-span-12 lg:col-span-5">
              <HalfPieChart />
            </div>
          </div>
          <ActiveUsers />
        </div>
      </div>
    </DashboardStatsProvider>
  );
};

export default Dashboard;
