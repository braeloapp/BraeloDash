"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Banner = () => {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-[#EE9E03] px-4 py-3 sm:px-6 sm:py-4">
      <button
        type="button"
        onClick={() => router.push("/pages/banners")}
        className="absolute right-3 top-3 z-10 inline-flex items-center rounded-[22px] bg-[#F5C12B] px-3 py-1.5 text-sm font-semibold text-[#634802] sm:right-4 sm:top-4 sm:px-5"
      >
        <img src="/media-library-folder.1.svg" alt="" className="h-4 w-4" />
        <span className="ml-2">Edit</span>
      </button>
      <div className="flex flex-col items-center gap-4 pr-16 sm:flex-row sm:pr-28">
        <div className="w-full sm:w-1/3">
          <p className="text-[20px] leading-snug text-white sm:text-[25px]">
            Advertise your company on Braelo!
          </p>
          <p className="mt-2 max-w-[220px] text-sm text-white/90">
            Check out our plans and boost your sales!
          </p>
        </div>
        <div className="flex flex-1 justify-center">
          <img
            src="/image.svg"
            alt=""
            className="max-h-[92px] w-auto max-w-full sm:max-h-[120px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
