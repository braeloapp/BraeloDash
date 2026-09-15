"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AllListingTabbar from "@/app/components/Listing/AllListingTabbar";
import ListingPageChrome from "@/app/components/Listing/ListingPageChrome";
import Button from "@/app/components/ux/Button";

const Listing = () => {
  const router = useRouter();

  return (
    <ListingPageChrome
      showBack
      title="Listings"
      description="Browse and manage marketplace listings by category — edit, activate, or remove as needed."
      actions={
        <Button
          variant="primary"
          onClick={() => router.push("/pages/listing/addlisting")}
        >
          Add New Listing
        </Button>
      }
    >
      <AllListingTabbar />
    </ListingPageChrome>
  );
};

export default Listing;
