import AllTickets from "@/app/components/Support/AllTickets";
import React from "react";
import PageHeader from "@/app/components/ux/PageHeader";

const Support = () => {
  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Support Management"
        description="Review and resolve customer support tickets."
      />
      <AllTickets />
    </div>
  );
};

export default Support;
