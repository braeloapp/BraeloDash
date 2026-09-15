"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/app/components/ux/PageHeader";
import PageState from "@/app/components/ux/PageState";
import Button from "@/app/components/ux/Button";

function CategoryDetailStub() {
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
        title="Category"
        description={
          id
            ? `Category key: ${id}`
            : "No category selected."
        }
      />
      <PageState
        status="empty"
        title="Open subcategories for this category"
        description="This route does not list category details. Use the subcategories view to manage labels under this taxonomy key."
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
