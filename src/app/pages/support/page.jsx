import AllTickets from "@/app/components/Support/AllTickets";
import React from "react";
import BackButton from "@/app/components/BackButton";

const Support = () => {
  return (
    <>
      <div className="page-header">
        <div className="flex min-w-0 items-center gap-2">
          <BackButton />
          <h1 className="page-title">Support Management</h1>
        </div>
      </div>
      <AllTickets />
    </>
  );
};

export default Support;
