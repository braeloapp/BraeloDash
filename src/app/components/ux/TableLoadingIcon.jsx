"use client";

import React from "react";
import AppLoader from "./AppLoader";

/** Braelo wave icon for PrimeReact DataTable `loadingIcon`. */
export default function TableLoadingIcon() {
  return <AppLoader size="md" full={false} showLabel={false} />;
}
