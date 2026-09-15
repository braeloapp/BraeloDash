"use client";
import React, { useState, useEffect } from "react";
import { getData } from "@/app/API/method";
import { extractResultsList } from "@/lib/apiResponse";
import AppLoader from "@/app/components/ux/AppLoader";

const FeedbackCard = () => {
  const [selectedReaction, setSelectedReaction] = useState("");
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feedback data based on selected reaction
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        let url = "/admin-panel/feedback";
        if (selectedReaction) {
          url += `?feedback=${selectedReaction}`;
        }
        
        const response = await getData(url);
        const rows = extractResultsList(response);
        const data = rows.map((item) => ({
          ...item,
          name: item.user_name,
          reaction: item.feedback,
          date: item.created_at
            ? new Date(item.created_at).toISOString().split("T")[0]
            : "",
          description: `User ${item.user_name || "Someone"} marked this as ${item.feedback}`,
        }));

        setFeedbackData(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbackData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [selectedReaction]);

  return (
    <div className="mt-4 space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl bg-[#F6F8FB] p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#78828A]">Feedbacks</h2>
        <div className="flex flex-col gap-2 sm:items-end">
          <span className="text-sm font-medium text-[#78828A]">Filter by reaction</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={`rounded-lg px-3 py-2 text-sm text-white ${selectedReaction === "Hate" ? "ring-2 ring-[#CD9403]" : ""} bg-[#C7233F]`}
              onClick={() => setSelectedReaction("Hate")}
            >
              Hate
            </button>
            <button
              className={`rounded-lg bg-red-700 px-3 py-2 text-sm text-white ${selectedReaction === "Dislike" ? "ring-2 ring-[#CD9403]" : ""}`}
              onClick={() => setSelectedReaction("Dislike")}
            >
              Dislike
            </button>
            <button
              className={`rounded-lg border border-[#EEF1F4] bg-white px-3 py-2 text-sm text-[#78828A] ${selectedReaction === "Neutral" ? "ring-2 ring-[#CD9403]" : ""}`}
              onClick={() => setSelectedReaction("Neutral")}
            >
              Neutral
            </button>
            <button
              className={`rounded-lg bg-[#06B64C] px-3 py-2 text-sm text-white ${selectedReaction === "Like" ? "ring-2 ring-[#CD9403]" : ""}`}
              onClick={() => setSelectedReaction("Like")}
            >
              Like
            </button>
            <button
              className={`rounded-lg bg-[#CD9403] px-3 py-2 text-sm text-white ${selectedReaction === "Love" ? "ring-2 ring-[#634802]" : ""}`}
              onClick={() => setSelectedReaction("Love")}
            >
              Love
            </button>
            <button
              className="px-3 py-2 text-sm font-medium text-[#CD9403]"
              onClick={() => setSelectedReaction("")}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <AppLoader label="Loading feedback..." />}

      {/* Feedback Cards */}
      {!loading && feedbackData.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-600">
          <p className="font-medium text-gray-700">No feedback yet</p>
          <p className="mt-2 text-sm">
            Feedback appears here when end users submit reactions in the main app. There is no test
            submission from this admin panel; use the consumer app or staging users to generate sample
            data.
          </p>
        </div>
      )}

      {!loading && feedbackData.map(({ id, name, reaction, description, date }) => (
        <div key={id} className="flex items-start rounded-2xl border border-[#EEF1F4] bg-white p-4 shadow-card sm:p-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-[#78828A]">{name}</h3>
              <span className="text-sm text-[#CD9403]">{date}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Reaction: {reaction}</p>
            <p className="text-gray-600 mt-2">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackCard;