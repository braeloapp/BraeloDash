"use client";
import React from "react";
import UserStatistics from "@/app/components/statistics/UserStatistics";
import BusinessStatistics from "@/app/components/statistics/BusinessStatistics";
import ListingCategorystats from "@/app/components/statistics/ListingCategorystats";
import PageHeader from "@/app/components/ux/PageHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DashboardStatsProvider } from "@/app/components/Dashboard/DashboardStatsContext";

const Statistics = () => {
  const { t } = useLanguage();

  return (
    <DashboardStatsProvider>
      <div className="page-shell">
        <PageHeader
          showBack
          title={t("pages.statistics.title")}
          description={t("pages.statistics.description")}
        />
        <div className="flex flex-col gap-5 p-4 sm:p-5">
          <UserStatistics />
          <BusinessStatistics />
          <ListingCategorystats />
        </div>
      </div>
    </DashboardStatsProvider>
  );
};

export default Statistics;
