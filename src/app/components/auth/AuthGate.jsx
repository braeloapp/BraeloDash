"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAdminSession, getAdminToken } from "@/lib/adminAuth";
import { fetchAdminMe } from "@/lib/adminMe";
import AppLoader from "@/app/components/ux/AppLoader";

/**
 * Unlock after mount so SSR HTML matches the first client paint.
 * Token check + /me verify run in the background (no Azure wait on nav).
 */
export default function AuthGate({ children }) {
  const router = useRouter();
  // Always false on first render (server + client) to avoid hydration mismatch.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const token = getAdminToken();
      if (!token) {
        clearAdminSession();
        router.replace("/");
        return;
      }

      // Instant unlock once we know a token exists (client-only).
      if (!cancelled) setReady(true);

      try {
        await fetchAdminMe();
      } catch (error) {
        if (error?.status === 401 || error?.status === 403) {
          clearAdminSession();
          if (!cancelled) router.replace("/");
        }
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <AppLoader label="Checking admin session..." />
      </div>
    );
  }

  return children;
}
