import React from "react";

const PrivacyContent = () => {
  return (
    <>
      <div className=" mt-3 border">
        <div className="px-10 pt-10">
          <p className="text-gray-500 font-extrabold text-lg">
            1. YOUR AGREEMENT
          </p>
          <p className="mt-4 text-gray-500 text-base">
            By using this Site, you agree to be bound by, and to comply with,
            these Terms and Conditions. If you do not agree to these Terms and
            Conditions, please do not use this site.
          </p>
          <p className="mt-5 text-gray-500 text-base">
            PLEASE NOTE: We reserve the right, at our sole discretion, to
            change, modify or otherwise alter these Terms and Conditions at any
            time...
          </p>
        </div>
        <div className="px-10 pt-10">
          <p className="text-gray-500 font-extrabold text-lg">2. PRIVACY</p>
          <p className="mt-4 text-gray-500 text-base">
            Please review our Privacy Policy, which also governs your visit to
            this Site, to understand our practices.
          </p>
        </div>
      </div>

      <div className="mt-5 w-11/12">
        <p className="text-sm text-gray-500">
          Legal copy is currently static. A publishable legal CMS is not enabled
          in this release, so save actions are disabled.
        </p>
      </div>
    </>
  );
};

export default PrivacyContent;
