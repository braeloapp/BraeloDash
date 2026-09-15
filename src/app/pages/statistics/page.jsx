"use client";
import React from "react";
import UserStatistics from "@/app/components/statistics/UserStatistics";
import BusinessStatistics from "@/app/components/statistics/BusinessStatistics";
import ListingCategorystats from "@/app/components/statistics/ListingCategorystats";
import PageHeader from "@/app/components/ux/PageHeader";

const Statistics = () => {
  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Statistics"
        description="Platform metrics across users, businesses, and listing categories."
      />
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <UserStatistics />
        <BusinessStatistics />
        <ListingCategorystats />
      </div>
    </div>
  );
};

export default Statistics;
