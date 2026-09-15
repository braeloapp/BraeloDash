"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Import the Navigation module
import "swiper/css";
import "swiper/css/navigation"; // Import the CSS for navigation
import Vehicles from "./Vehicles";//import Vehicles from "./Vehicles";
import RealState from "./realstate";
import Events from "./events";
import Job from "./job";
import Electronics from "./electronics";
import Furniture from "./furniture";
import Kids from "./kids";
import Fashion from "./fashion";
import Sports from "./sport&hobby";



const AllListingTabbar = () => {
  const [activeButton, setActiveButton] = useState(1);

  const handleClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  const buttonClasses = (index) =>
    `font-semibold transition ease-in-out duration-300 text-[13px] w-[100px] ${
      activeButton === index
        ? "border-b-2 border-[#cd9403] text-[#78828A] font-bold"
        : "text-[#ACB6BE]"
    }`;

  const buttons = [
    "Vehicles",
    "Real Estate",
    // "Services",
    "Events",
    "Jobs",
    "Electronics",
    "Furniture",
    "Kids",
    "Fashion",
    "Sports & Hobby",
    // "Outing",
    // "Places",
    // "Tours",
  ];

  return (
    <>
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
        {buttons.map((label, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <div className="px-2 sm:px-4">
            <button
              className={buttonClasses(index + 1)}
              onClick={() => handleClick(index + 1)}
            >
              {label}
            </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-4">
        {activeButton === 1 && <Vehicles/>}
        {activeButton === 2 && <RealState/>}
        {activeButton === 3 && <Events/>}
        {activeButton === 4 && <Job/>}
        {activeButton === 5 && <Electronics/>}
        {activeButton === 6 && <Furniture/>}
        {activeButton === 7 && <Kids/>}
        {activeButton === 8 && <Fashion/>}
        {activeButton === 9 && <Sports/>}
      </div>
    </>
  );
};

export default AllListingTabbar