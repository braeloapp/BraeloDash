"use client";

import React from "react";
import CategoriesTable from "@/app/components/Categories/CategoriesTable";
import BackButton from "@/app/components/BackButton";

const Categories = () => {

  return (
    <div>
      <div className="flex justify-between p-5 border-b">
      <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-[#78828A] text-[24px] font-[500]">Categories</h1>
        </div>
        <p className="text-sm text-gray-500 max-w-md text-right">
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
