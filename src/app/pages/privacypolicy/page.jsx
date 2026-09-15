import React from "react";
import PrivacyContent from "@/app/components/Privacy/PrivacyContent";
import PageHeader from "@/app/components/ux/PageHeader";

const PrivacyPolicy = () => {
  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Privacy Policy"
        description="Manage the privacy policy content shown to users."
      />
      <div className="px-4 py-4 sm:px-5">
        <PrivacyContent />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
