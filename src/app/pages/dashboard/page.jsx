"use client";
import React from "react";
import DashboardCards from "@/app/components/Dashboard/DashboardCards";
import DataChart from "@/app/components/Dashboard/DataChart";
import HalfPieChart from "@/app/components/Dashboard/HalfPieChart";
import ActiveUsers from "@/app/components/Dashboard/ActiveUsers";
import OpsAlerts from "@/app/components/Dashboard/OpsAlerts";
import PageHeader from "@/app/components/ux/PageHeader";
import { DashboardStatsProvider } from "@/app/components/Dashboard/DashboardStatsContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <DashboardStatsProvider>
      <div className="page-shell">
        <PageHeader
          title={t("dashboard.title")}
          description={t("dashboard.description")}
        />
        <div className="space-y-5 p-4 sm:p-5">
          <OpsAlerts />
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
