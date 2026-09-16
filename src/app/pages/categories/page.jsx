"use client";

import React from "react";
import Link from "next/link";
import CategoriesTable from "@/app/components/Categories/CategoriesTable";
import PageHeader from "@/app/components/ux/PageHeader";

const Categories = () => {
  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Categories"
        description="Add, rename, activate, and remove categories and subcategories. Platform listing keys stay listing-enabled; custom entries are CMS-managed."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/pages/categories/addcategory" className="btn-primary">
              Add category
            </Link>
            <Link href="/pages/categories/addsubcategory" className="btn-ghost">
              Add subcategory
            </Link>
          </div>
        }
      />
      <CategoriesTable />
    </div>
  );
};

export default Categories;
