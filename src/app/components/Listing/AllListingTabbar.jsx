"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Vehicles from "./Vehicles";
import RealState from "./realstate";
import Events from "./events";
import Job from "./job";
import Electronics from "./electronics";
import Furniture from "./furniture";
import Kids from "./kids";
import Fashion from "./fashion";
import Sports from "./sport&hobby";

const BUTTONS = [
  "Vehicles",
  "Real Estate",
  "Events",
  "Jobs",
  "Electronics",
  "Furniture",
  "Kids",
  "Fashion",
  "Sports & Hobby",
];

const AllListingTabbar = () => {
  const [activeButton, setActiveButton] = useState(1);

  const buttonClasses = (index) =>
    `w-[100px] border-b-2 pb-2 text-[13px] font-semibold transition duration-300 ${
      activeButton === index
        ? "border-[#CD9403] text-[#78828A]"
        : "border-transparent text-[#ACB6BE] hover:text-[#78828A]"
    }`;

  return (
    <>
      <div
        className="border-b pb-1"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Swiper
          slidesPerView="auto"
          navigation
          loop={false}
          modules={[Navigation]}
          className="listing-tabs"
          breakpoints={{
            320: { slidesPerView: 2.4, spaceBetween: 8 },
            640: { slidesPerView: 4, spaceBetween: 12 },
            1024: { slidesPerView: 7, spaceBetween: 16 },
          }}
        >
          {BUTTONS.map((label, index) => (
            <SwiperSlide key={label} className="!w-auto">
              <div className="px-2 sm:px-4">
                <button
                  type="button"
                  className={buttonClasses(index + 1)}
                  onClick={() => setActiveButton(index + 1)}
                >
                  {label}
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="mt-4">
        {activeButton === 1 && <Vehicles />}
        {activeButton === 2 && <RealState />}
        {activeButton === 3 && <Events />}
        {activeButton === 4 && <Job />}
        {activeButton === 5 && <Electronics />}
        {activeButton === 6 && <Furniture />}
        {activeButton === 7 && <Kids />}
        {activeButton === 8 && <Fashion />}
        {activeButton === 9 && <Sports />}
      </div>
    </>
  );
};

export default AllListingTabbar;
