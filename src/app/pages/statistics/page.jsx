"use client";
import React from "react";
import UserStatistics from "@/app/components/statistics/UserStatistics";
import BusinessStatistics from "@/app/components/statistics/BusinessStatistics";
import ListingCategorystats from "@/app/components/statistics/ListingCategorystats";
import BackButton from "@/app/components/BackButton";

const Statistics = () => {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="flex min-w-0 items-center gap-2">
          <BackButton />
          <h3 className="page-title">Statistics</h3>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <UserStatistics />
        <BusinessStatistics />
        <ListingCategorystats />
      </div>
    </div>
  );
};

export default Statistics;
