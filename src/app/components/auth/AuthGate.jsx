"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/apiConfig";
import { clearAdminSession, getAdminToken, persistAdminSession } from "@/lib/adminAuth";

export default function AuthGate({ children }) {
  const router = useRouter();
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
      try {
        const response = await fetch(`${getApiBaseUrl()}/admin-panel/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401 || response.status === 403) {
          clearAdminSession();
          router.replace("/");
          return;
        }
        if (!response.ok) {
          setReady(true);
          return;
        }
        const payload = await response.json();
        const data = payload?.data || payload;
        persistAdminSession({
          token,
          role: data?.role,
          name: data?.name,
        });
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setReady(true);
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center text-[#78828A]">
        Checking admin session...
      </div>
    );
  }

  return children;
}
