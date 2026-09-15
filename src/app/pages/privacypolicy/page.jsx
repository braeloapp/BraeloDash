import React from "react";
import PrivacyContent from "@/app/components/Privacy/PrivacyContent";
import BackButton from "@/app/components/BackButton";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="page-header">
        <div className="flex min-w-0 items-center gap-2">
          <BackButton />
          <h1 className="page-title">Privacy Policy</h1>
        </div>
      </div>
      <div className="px-1 py-2 sm:px-6">
        <PrivacyContent />
      </div>
    </>
  );
};

export default PrivacyPolicy;
