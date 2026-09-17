"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin top progress bar on soft navigations — keeps clicks feeling instant
 * while the next page chunk/API loads.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const done = window.setTimeout(() => setActive(false), 420);
    return () => window.clearTimeout(done);
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[2px] overflow-hidden"
      aria-hidden
    >
      <div className="admin-nav-progress h-full w-full origin-left bg-[#CD9403]" />
    </div>
  );
}
