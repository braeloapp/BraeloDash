import React from "react";
import FeedbackCard from "@/app/components/Feedback/FeedbackCard";
import PageHeader from "@/app/components/ux/PageHeader";

const feedback = () => {
  return (
    <div className="page-shell">
      <PageHeader
        showBack
        title="Feedbacks"
        description="Browse user feedback submitted through the platform."
      />
      <FeedbackCard />
    </div>
  );
};

export default feedback;
