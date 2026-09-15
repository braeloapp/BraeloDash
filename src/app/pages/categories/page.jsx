"use client";

import React from "react";
import CategoriesTable from "@/app/components/Categories/CategoriesTable";
import BackButton from "@/app/components/BackButton";

const Categories = () => {

  return (
    <div className="page-shell">
      <div className="page-header">
      <div className="flex min-w-0 items-center gap-2">
          <BackButton />
          <h1 className="page-title">Categories</h1>
        </div>
        <p className="max-w-md text-sm text-[#ACB6BE] sm:text-right">
          Taxonomy keys come from the backend listing contract. Admins can
          activate, deactivate, and relabel them. New listing types require a
          backend release.
        </p>
      </div>
      <div>
        <CategoriesTable />
      </div>
    </div>
  );
};

export default Categories;
