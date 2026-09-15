"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getData } from "@/app/API/method";
import { extractResultsList } from "@/lib/apiResponse";
import { getBodyStyle, getHeaderStyle } from "@/app/components/Users/UserData";

const FeedbackCard = () => {
  const [selectedReaction, setSelectedReaction] = useState("");
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setFirst(0);
      try {
        let url = "/admin-panel/feedback";
        if (selectedReaction) {
          url += `?feedback=${selectedReaction}`;
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
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbackData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [selectedReaction]);

  const reactionTemplate = (rowData) => {
    const tone =
      rowData.reaction === "Love" || rowData.reaction === "Like"
        ? "rounded-lg bg-[#06B64C] p-1 text-center text-xs text-white"
        : rowData.reaction === "Neutral"
        ? "rounded-lg bg-[#EE9E03] p-1 text-center text-xs text-white"
        : "rounded-lg bg-[#C7233F] p-1 text-center text-xs text-white";
    return <span className={tone}>{rowData.reaction || "—"}</span>;
  };

  return (
    <div className="p-5">
      <div className="filter-row mb-4">
        <span className="text-sm font-medium text-[#78828A]">Filter by reaction</span>
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

      <div className="table-scroll-wrapper">
        <DataTable
          value={feedbackData}
          dataKey="id"
          paginator
          first={first}
          rows={rows}
          onPage={(event) => {
            setFirst(event.first);
            setRows(event.rows);
          }}
          loading={loading}
          emptyMessage="No feedback yet. Feedback appears here when users submit reactions in the main app."
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          tableStyle={{ width: "100%" }}
          className="custom-paginator p-datatable-striped"
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
    </div>
  );
};

export default FeedbackCard;
