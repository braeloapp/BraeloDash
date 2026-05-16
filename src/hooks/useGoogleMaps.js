"use client";

import { useEffect, useState } from "react";
import { loadGoogleMaps } from "@/lib/googleMaps";

/**
 * Loads Google Maps only while `enabled` is true (default). Reuses one script app-wide.
 */
export function useGoogleMaps(enabled = true) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoaded(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoaded(false);
    setError(null);

    loadGoogleMaps()
      .then(() => {
        if (!cancelled) setIsLoaded(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { isLoaded, error };
}
