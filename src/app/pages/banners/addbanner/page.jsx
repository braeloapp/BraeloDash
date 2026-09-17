"use client";

import React, { useState } from "react";
import { postBusiData } from "@/app/API/method";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiErrorMessage } from "@/lib/apiResponse";
import PageHeader from "@/app/components/ux/PageHeader";
import Button from "@/app/components/ux/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const AddBanner = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    business_banner: null,
    business_name: "",
    business_email: "",
    business_category: "",
    business_subcategory: "",
    url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submissionData = new FormData();
      submissionData.append("business_banner", formData.business_banner);
      submissionData.append("business_name", formData.business_name);
      submissionData.append("business_email", formData.business_email);
      submissionData.append("business_category", formData.business_category);
      submissionData.append("business_subcategory", formData.business_subcategory);
      submissionData.append("url", formData.url);

      // Make API call
      const response = await postBusiData("/admin-panel/banner", submissionData, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });

      const okStatus = response?.status === 201 || response?.status === 200;
      const okFlag = response?.success === true;
      if (okStatus || okFlag) {
        toast.success("Banner created successfully");
        // Reset form after successful submission
        setFormData({
          business_banner: null,
          business_name: "",
          business_email: "",
          business_category: "",
          business_subcategory: "",
          url: "",
        });
      } else {
        toast.error(response.message || "Failed to add banner");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "An error occurred while adding the banner"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <ToastContainer position="top-right" autoClose={3000} />
      <PageHeader
        showBack
        title={t("pages.banners.add")}
        description={t("pages.banners.addDesc")}
      />

      <div className="mx-auto w-full max-w-md p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="business_banner" className="field-label">
              Banner Image
            </label>
            <input
              type="file"
              id="business_banner"
              name="business_banner"
              accept="image/*"
              onChange={handleChange}
              className="field-control"
              required
            />
          </div>

          <div>
            <label htmlFor="business_name" className="field-label">
              Business Name
            </label>
            <input
              type="text"
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="field-control"
              placeholder="Enter business name"
              required
            />
          </div>

          <div>
            <label htmlFor="business_email" className="field-label">
              Business Email
            </label>
            <input
              type="email"
              id="business_email"
              name="business_email"
              value={formData.business_email}
              onChange={handleChange}
              className="field-control"
              placeholder="Enter business email"
              required
            />
          </div>

          <div>
            <label htmlFor="business_category" className="field-label">
              Business Category
            </label>
            <input
              type="text"
              id="business_category"
              name="business_category"
              value={formData.business_category}
              onChange={handleChange}
              className="field-control"
              placeholder="Enter business category"
              required
            />
          </div>

          <div>
            <label htmlFor="business_subcategory" className="field-label">
              Business Subcategory
            </label>
            <input
              type="text"
              id="business_subcategory"
              name="business_subcategory"
              value={formData.business_subcategory}
              onChange={handleChange}
              className="field-control"
              placeholder="Enter business subcategory"
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="field-label">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="field-control"
              placeholder="Enter URL"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={isSubmitting}
          >
            Add Banner
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddBanner;
