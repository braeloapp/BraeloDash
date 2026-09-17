"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/app/components/ux/PageHeader";
import PageState from "@/app/components/ux/PageState";
import Button from "@/app/components/ux/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function CategoryDetailStub() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const subcategoryHref = id
    ? `/pages/categories/${encodeURIComponent(String(id))}/subcategories`
    : "/pages/categories";

  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title={t("pages.categories.detail")}
        description={
          id
            ? `Category key: ${id}`
            : "No category selected."
        }
      />
      <PageState
        status="empty"
        title={t("pages.categories.openSubs")}
        description={t("pages.categories.openSubsDesc")}
        action={
          <Button
            variant="primary"
            onClick={() => router.push(subcategoryHref)}
          >
            View subcategories
          </Button>
        }
      />
    </div>
  );
}

export default CategoryDetailStub;
