"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "@/app/API/method";
import { getApiErrorMessage } from "@/lib/apiResponse";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/ux/PageHeader";
import Button from "@/app/components/ux/Button";

const AddNewNotification = () => {
  const [messageData, setMessageData] = useState({
    type: "Notification",
    title: "",
    description: "",
  });

  const [messagePreview, setMessagePreview] = useState({
    message: "",
    placeholder:
      "Just dropping by to let you know that there are 5 days left until your plan expires, eh? Do not waste time, get the plan that best fits your pocket now!",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessageData({
      ...messageData,
      [name]: value,
    });

    if (name === "description") {
      setMessagePreview({
        ...messagePreview,
        message: value,
      });
    }
  };

  const resetForm = () => {
    setMessageData({
      type: "Notification",
      title: "",
      description: "",
    });

    setMessagePreview({
      message: "",
      placeholder:
        "Just dropping by to let you know that there are 5 days left until your plan expires, eh? Do not waste time, get the plan that best fits your pocket now!",
    });
  };

  const handlePublish = async () => {
    setLoading(true);

    const payload = {
      title: messageData.title,
      body: messageData.description,
    };

    try {
      await postData("/admin-panel/notification/send", payload);
      toast.success("Notification created successfully!");
      resetForm();
    } catch (err) {
      console.error("Error sending notification:", err);
      toast.error(
        getApiErrorMessage(err, "Failed to send notification. Please try again.")
      );
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <ToastContainer position="top-right" autoClose={3000} />
      <PageHeader
        showBack
        title="Create New Notification"
        description="Compose and publish an announcement to platform users."
      />

      <div className="space-y-5 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="field-label">Message Title</label>
            <input
              placeholder="Tic Tac, Tic Tac! Your plan needs you!"
              className="field-control"
              name="title"
              value={messageData.title}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <label className="field-label">Description</label>
            <textarea
              placeholder={messagePreview.placeholder}
              className="field-control h-40"
              name="description"
              value={messageData.description}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center justify-start gap-2">
          <Button variant="ghost" onClick={resetForm} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handlePublish}
            loading={loading}
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddNewNotification;
