"use client";

import React from "react";
import CategoriesTable from "@/app/components/Categories/CategoriesTable";
import PageHeader from "@/app/components/ux/PageHeader";

const Categories = () => {
  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Categories"
        description="Taxonomy keys come from the backend listing contract. Admins can activate, deactivate, and relabel them. New listing types require a backend release."
      />
      <CategoriesTable />
    </div>
  );
};

export default Categories;
