"use client";

import AppLoader from "@/app/components/ux/AppLoader";

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-16">
      <AppLoader showLabel={false} />
    </div>
  );
}
