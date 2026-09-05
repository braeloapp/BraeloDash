"use client";

import { useEffect } from "react";
import { initErrorTracking } from "@/lib/errorTracking";

export default function ErrorTracking() {
  useEffect(() => {
    initErrorTracking();
  }, []);
  return null;
}
