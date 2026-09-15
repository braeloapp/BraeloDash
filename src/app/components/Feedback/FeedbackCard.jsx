"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getData } from "@/app/API/method";
import { extractResultsList } from "@/lib/apiResponse";
import { getBodyStyle, getHeaderStyle } from "@/app/components/Users/UserData";
import PageState from "@/app/components/ux/PageState";

const REACTIONS = [
  { value: "", label: "All" },
  { value: "Hate", label: "Hate", tone: "hate" },
  { value: "Dislike", label: "Dislike", tone: "dislike" },
  { value: "Neutral", label: "Neutral", tone: "neutral" },
  { value: "Like", label: "Like", tone: "like" },
  { value: "Love", label: "Love", tone: "love" },
];

function reactionChipClass(tone, selected) {
  const base =
    "inline-flex items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold transition duration-150";
  const map = {
    hate: selected
      ? "bg-[#C7233F] text-white shadow-sm ring-2 ring-[#C7233F]/25"
      : "bg-[#fdecef] text-[#C7233F] border border-[#f5c2cc] hover:bg-[#fad6dc]",
    dislike: selected
      ? "bg-[#9f1239] text-white shadow-sm ring-2 ring-[#9f1239]/25"
      : "bg-[#fff1f2] text-[#9f1239] border border-[#fecdd3] hover:bg-[#ffe4e6]",
    neutral: selected
      ? "bg-[#78828A] text-white shadow-sm ring-2 ring-[#78828A]/20"
      : "bg-[#F3F5F7] text-[#596068] border border-[#e8edf2] hover:bg-[#eef1f4]",
    like: selected
      ? "bg-[#06B64C] text-white shadow-sm ring-2 ring-[#06B64C]/25"
      : "bg-[#e9f9ef] text-[#067a38] border border-[#b6ebc8] hover:bg-[#d7f5e3]",
    love: selected
      ? "bg-[#CD9403] text-white shadow-sm ring-2 ring-[#CD9403]/30"
      : "bg-[#FFF8E8] text-[#b37f02] border border-[#f0e2b3] hover:bg-[#feefcb]",
    all: selected
      ? "bg-[#3a4248] text-white shadow-sm"
      : "bg-white text-[#78828A] border border-[#e8edf2] hover:bg-[#F6F8FB]",
  };
  return `${base} ${map[tone] || map.all}`;
}

function reactionBadgeClass(reaction) {
  switch (reaction) {
    case "Love":
      return "badge badge-brand";
    case "Like":
      return "badge badge-success";
    case "Neutral":
      return "badge badge-neutral";
    case "Dislike":
      return "badge badge-warning";
    case "Hate":
      return "badge badge-danger";
    default:
      return "badge badge-neutral";
  }
}

const FeedbackCard = () => {
  const [selectedReaction, setSelectedReaction] = useState("");
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(false);
    setFirst(0);
    try {
      let url = "/admin-panel/feedback";
      if (selectedReaction) {
        url += `?feedback=${encodeURIComponent(selectedReaction)}`;
      }

      const response = await getData(url);
      const data = extractResultsList(response).map((item) => ({
        ...item,
        name: item.user_name,
        reaction: item.feedback,
        date: item.created_at
          ? new Date(item.created_at).toISOString().split("T")[0]
          : "",
        description: `User ${item.user_name || "Someone"} marked this as ${item.feedback}`,
      }));

      setFeedbackData(data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setFeedbackData([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [selectedReaction]);

  const reactionTemplate = (rowData) => (
    <span className={reactionBadgeClass(rowData.reaction)}>
      {rowData.reaction || "—"}
    </span>
  );

  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-ink">Filter by reaction</p>
            <p className="caption mt-0.5">
              {selectedReaction
                ? `Showing “${selectedReaction}” feedback`
                : "Showing all feedback"}
            </p>
          </div>
          {selectedReaction ? (
            <button
              type="button"
              className="btn-ghost self-start text-xs sm:self-auto"
              onClick={() => setSelectedReaction("")}
            >
              Clear filter
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {REACTIONS.map((item) => {
            const selected = selectedReaction === item.value;
            const tone = item.value === "" ? "all" : item.tone;
            return (
              <button
                key={item.label}
                type="button"
                aria-pressed={selected}
                className={reactionChipClass(tone, selected)}
                onClick={() => setSelectedReaction(item.value)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <PageState
          status="error"
          title="Unable to load feedback"
          description="Something went wrong while retrieving feedback."
          onRetry={fetchFeedback}
        />
      ) : (
        <div className="table-scroll-wrapper border-0">
          <DataTable
            value={feedbackData}
            dataKey="id"
            paginator
            first={first}
            rows={rows}
            rowsPerPageOptions={[5, 10, 20, 50]}
            onPage={(event) => {
              setFirst(event.first);
              setRows(event.rows);
            }}
            loading={loading}
            emptyMessage="No feedback yet. Feedback appears here when users submit reactions in the main app."
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            tableStyle={{ width: "100%" }}
            paginatorClassName="user-paginator"
            className="p-datatable-striped"
          >
            <Column
              field="name"
              header="User"
              headerStyle={getHeaderStyle()}
              bodyStyle={getBodyStyle()}
            />
            <Column
              header="Reaction"
              body={reactionTemplate}
              headerStyle={getHeaderStyle()}
              bodyStyle={getBodyStyle()}
            />
            <Column
              field="description"
              header="Message"
              headerStyle={getHeaderStyle()}
              bodyStyle={{ ...getBodyStyle(), whiteSpace: "pre-wrap" }}
            />
            <Column
              field="date"
              header="Date"
              headerStyle={getHeaderStyle()}
              bodyStyle={getBodyStyle()}
            />
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
