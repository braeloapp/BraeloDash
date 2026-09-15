"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiEdit3 } from "react-icons/fi";

const Banner = () => {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EE9E03] via-[#CD9403] to-[#b37f02] px-5 py-5 sm:px-7 sm:py-6">
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-48 rounded-full bg-black/5 blur-2xl"
        aria-hidden
      />

      <button
        type="button"
        onClick={() => router.push("/pages/banners")}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/95 px-3 py-1.5 text-xs font-semibold text-brand-ink shadow-sm transition hover:bg-white sm:right-4 sm:top-4 sm:text-sm"
      >
        <FiEdit3 size={14} aria-hidden />
        Edit
      </button>

      <div className="relative flex flex-col items-center gap-4 pr-0 sm:flex-row sm:pr-24">
        <div className="w-full sm:w-[42%]">
          <p className="text-[22px] font-semibold leading-snug tracking-tight text-white sm:text-[26px]">
            Advertise your company on Braelo!
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/90">
            Check out our plans and boost your sales!
          </p>
        </div>
        <div className="flex flex-1 justify-center sm:justify-end">
          <img
            src="/image.svg"
            alt=""
            className="max-h-[100px] w-auto max-w-full drop-shadow-sm sm:max-h-[128px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
