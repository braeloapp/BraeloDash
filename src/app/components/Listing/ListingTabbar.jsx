"use client";
import React, { useState } from "react";
import TotalListing from "./TotalListing";
import ActiveListing from "./ActiveLsiting";
import InactiveListing from "./InactiveListing";
import DeletedListing from "./DeletedLsiting";
import SaveListing from "./SaveLsiting";

const ListingTabbar = ({userId}) => {
  const [activeButton, setActiveButton] = useState(1);

  const handleClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  const buttonClasses = (index) =>
    `whitespace-nowrap px-[10px] py-2 mx-1 sm:mx-2 font-semibold  transition ease-in-out duration-300 ${
      activeButton === index
        ? "border-b-2 border-[#EE9E03] text-[#78828A]  font-[600]"
        : "text-[#ACB6BE] text-[16px] font-[500] "
    }`;

  return (
    <>
      <div className="flex gap-1 overflow-x-auto p-3 sm:justify-between sm:p-5">
        <button className={buttonClasses(1)} onClick={() => handleClick(1)}>
          Total Listings
        </button>
        <button className={buttonClasses(2)} onClick={() => handleClick(2)}>
          Active Listings
        </button>
        <button className={buttonClasses(3)} onClick={() => handleClick(3)}>
          Inactive Listings
        </button>
        {/* <button className={buttonClasses(4)} onClick={() => handleClick(4)}>
          Deleted Listings
        </button> */}
        <button className={buttonClasses(5)} onClick={() => handleClick(5)}>
          Saved Listings
        </button>
      </div>
      <div className="mt-4">
        {activeButton === 1 && <TotalListing user_id={userId} />}
        {activeButton === 2 && <ActiveListing user_id={userId} />}
        {activeButton === 3 && <InactiveListing user_id={userId} />}
        {/* {activeButton === 4 && <DeletedListing user_id={userId} />} */}
        {activeButton === 5 && <SaveListing user_id={userId} />}
      </div>
    </>
  );
};

export default ListingTabbar;
