"use client";

import React from "react";
import Link from "next/link";
import CategoriesTable from "@/app/components/Categories/CategoriesTable";
import PageHeader from "@/app/components/ux/PageHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Categories = () => {
  const { t } = useLanguage();

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title={t("pages.categories.title")}
        description={t("pages.categories.description")}
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
