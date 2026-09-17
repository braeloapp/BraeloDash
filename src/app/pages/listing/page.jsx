"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AllListingTabbar from "@/app/components/Listing/AllListingTabbar";
import ListingPageChrome from "@/app/components/Listing/ListingPageChrome";
import Button from "@/app/components/ux/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Listing = () => {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <ListingPageChrome
      showBack
      title={t("pages.listing.title")}
      description={t("pages.listing.description")}
      actions={
        <Button
          variant="primary"
          onClick={() => router.push("/pages/listing/addlisting")}
        >
          {t("pages.listing.add")}
        </Button>
      }
    >
      <AllListingTabbar />
    </ListingPageChrome>
  );
};

export default Listing;
