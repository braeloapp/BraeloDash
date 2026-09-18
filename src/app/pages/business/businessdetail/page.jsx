"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BusinessTabbar from "@/app/components/Listing/BusinessTabbar";
import ListingPageChrome from "@/app/components/Listing/ListingPageChrome";
import PageHeader from "@/app/components/ux/PageHeader";
import PageState from "@/app/components/ux/PageState";
import ActionMenu from "@/app/components/ux/ActionMenu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";
import {
  FiEdit2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiBriefcase,
  FiClock,
} from "react-icons/fi";
import { postBusiData, getData } from "@/app/API/method";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import AuditHistoryPanel from "@/app/components/Audit/AuditHistoryPanel";
import { fetchAdminTaxonomy } from "@/lib/taxonomy";

function formatDate(value) {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "N/A";
  }
}

function initialsFrom(name) {
  const source = String(name || "B").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function MetaCard({ label, children }) {
  return (
    <div className="user-detail-meta">
      <span className="user-detail-meta__label">{label}</span>
      <div className="user-detail-meta__value">{children}</div>
    </div>
  );
}

function normalizeToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

function findCategory(catalog, stored) {
  const target = normalizeToken(stored);
  if (!target) return null;
  return (
    catalog.find(
      (item) =>
        normalizeToken(item.key) === target ||
        normalizeToken(item.label) === target
    ) || null
  );
}

function findSubcategory(category, stored) {
  const target = normalizeToken(stored);
  if (!category || !target) return null;
  return (
    (category.subcategories || []).find(
      (item) =>
        normalizeToken(item.key) === target ||
        normalizeToken(item.label) === target
    ) || null
  );
}

const BusinessDetails = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get("id");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [businessData, setBusinessData] = useState(null);
  const [taxonomy, setTaxonomy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    business_name: "",
    business_address: "",
    business_number: "",
    business_email: "",
    business_website: "",
    business_goals: "",
    business_category: "",
    business_subcategory: "",
    business_logo: null,
    business_banner: null,
    business_images: [],
  });

  // For file previews
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  const applyBusiness = (data) => {
    const mapped = {
      id: data.id,
      documentId: data.id,
      BusinessName: data.business_name || data.BusinessName,
      Email: data.business_email || data.Email,
      "Phone Number": data.business_number || data["Phone Number"],
      website: data.business_website || data.website,
      BusinessType: data.business_category || data.BusinessType,
      Subcategory: data.business_subcategory || data.subcategory || "",
      Status: data.is_active === false ? "Inactive" : (data.Status || "Active"),
      "Date Created": data.created_at || data["Date Created"] || "",
      "Last Update": data.updated_at || data["Last Update"] || "",
      Coordinates: data.business_address || data.Coordinates,
      Description: data.business_goals || data.Description,
      business_logo: data.business_logo,
      business_banner: data.business_banner,
      user_id: data.user_id,
    };
    setBusinessData(mapped);
    setEditForm({
      business_name: mapped.BusinessName || "",
      business_address: mapped.Coordinates || "",
      business_number: mapped["Phone Number"] || "",
      business_email: mapped.Email || "",
      business_website: mapped.website || "",
      business_goals: mapped.Description || "",
      business_category: data.business_category || data.BusinessType || "",
      business_subcategory: data.business_subcategory || data.subcategory || "",
      business_logo: null,
      business_banner: null,
      business_images: [],
    });
    setLogoPreview(
      Array.isArray(mapped.business_logo)
        ? mapped.business_logo[0] || ""
        : mapped.business_logo || ""
    );
    setBannerPreview(
      Array.isArray(mapped.business_banner)
        ? mapped.business_banner[0] || ""
        : mapped.business_banner || ""
    );
  };

  useEffect(() => {
    const loadBusiness = async () => {
      if (!businessId) {
        setError({ message: "Business id is required" });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getData(`/admin-panel/business/${businessId}`);
        applyBusiness(response?.data || {});
        setError(null);
      } catch (err) {
        setError({
          message: err.response?.data?.message || "Failed to load business",
        });
      } finally {
        setLoading(false);
      }
    };
    loadBusiness();
  }, [businessId]);

  useEffect(() => {
    let cancelled = false;
    fetchAdminTaxonomy()
      .then((rows) => {
        if (!cancelled) setTaxonomy(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (!cancelled) setTaxonomy([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!taxonomy.length) return;
    setEditForm((prev) => {
      const category = findCategory(taxonomy, prev.business_category);
      const subcategory = findSubcategory(category, prev.business_subcategory);
      const nextCategory = category?.key || prev.business_category;
      const nextSubcategory =
        subcategory?.key || prev.business_subcategory || "";
      if (
        nextCategory === prev.business_category &&
        nextSubcategory === prev.business_subcategory
      ) {
        return prev;
      }
      return {
        ...prev,
        business_category: nextCategory,
        business_subcategory: nextSubcategory,
      };
    });
  }, [taxonomy, businessData]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("business_name", editForm.business_name);
      formData.append("business_address", editForm.business_address);
      formData.append("business_number", editForm.business_number);
      formData.append("business_email", editForm.business_email);
      formData.append("business_website", editForm.business_website);
      formData.append("business_goals", editForm.business_goals);
      formData.append("business_category", editForm.business_category);
      formData.append("business_subcategory", editForm.business_subcategory);
      const ownerUserId = businessData?.businessId ?? businessData?.user_id;
      if (!ownerUserId) {
        toast.error("Cannot update business: missing owner user id");
        setLoading(false);
        return;
      }
      formData.append("user_id", String(ownerUserId));

      if (editForm.business_logo) {
        formData.append("business_logo", editForm.business_logo);
      }
      if (editForm.business_banner) {
        formData.append("business_banner", editForm.business_banner);
      }
      editForm.business_images.forEach((file) => {
        formData.append("business_images", file);
      });

      const response = await postBusiData(
        "/admin-panel/business/update",
        formData
      );

      const saved = response?.data;
      if (saved && typeof saved === "object") {
        applyBusiness({
          ...saved,
          business_website:
            saved.business_website || editForm.business_website,
          business_name: saved.business_name || editForm.business_name,
          business_address:
            saved.business_address || editForm.business_address,
          business_number:
            saved.business_number || editForm.business_number,
          business_goals: saved.business_goals || editForm.business_goals,
          business_category:
            saved.business_category || editForm.business_category,
          business_subcategory:
            saved.business_subcategory || editForm.business_subcategory,
        });
        toast.success("Business updated successfully!");
        setEditModalOpen(false);
      } else {
        toast.error(response?.message || "Failed to update business");
      }
    } catch (error) {
      const apiError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error updating business";
      toast.error(
        typeof apiError === "string" ? apiError : "Error updating business"
      );
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      if (name === "business_category" && value !== prev.business_category) {
        return {
          ...prev,
          business_category: value,
          business_subcategory: "",
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === "business_logo") {
        setLogoPreview(reader.result);
      } else if (field === "business_banner") {
        setBannerPreview(reader.result);
      } else if (field === "business_images") {
        setImagesPreview(prev => [...prev, reader.result]);
      }
    };
    reader.readAsDataURL(file);

    setEditForm(prev => ({
      ...prev,
      [field]: field === "business_images" 
        ? [...prev.business_images, file] 
        : file
    }));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...imagesPreview];
    newImages.splice(index, 1);
    setImagesPreview(newImages);
    
    const newFiles = [...editForm.business_images];
    newFiles.splice(index, 1);
    setEditForm(prev => ({ ...prev, business_images: newFiles }));
  };

  // Download functionality
  const downloadAsPDF = () => {
    if (!businessData) return;
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`${businessData.BusinessName} Details`, 10, 20);
    
    doc.setFontSize(12);
    let yPosition = 40;
    
    // Basic Info
    doc.text(`Name: ${businessData.BusinessName}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Email: ${businessData.Email}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Phone: ${businessData["Phone Number"]}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Status: ${businessData.Status}`, 10, yPosition);
    yPosition += 15;
    
    // Additional Info
    doc.text(`Created At: ${businessData["Date Created"] || "N/A"}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Address: ${businessData.Coordinates || "N/A"}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Description: ${businessData.Description || "N/A"}`, 10, yPosition, { maxWidth: 180 });
    
    doc.save(`${businessData.BusinessName}_details.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  const downloadAsCSV = () => {
    if (!businessData) return;
    
    const worksheet = XLSX.utils.json_to_sheet([
      {
        "Business Name": businessData.BusinessName,
        "Email": businessData.Email,
        "Phone Number": businessData["Phone Number"],
        "Status": businessData.Status,
        "Created At": businessData["Date Created"] || "N/A",
        "Address": businessData.Coordinates || "N/A",
        "Description": businessData.Description || "N/A",
        "Website": businessData.website || "N/A",
        "Category": businessData.BusinessType || "N/A"
      }
    ]);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Business Details");
    XLSX.writeFile(workbook, `${businessData.BusinessName}_details.csv`);
    toast.success("CSV downloaded successfully!");
  };

  // Chat Modal Component

  if (loading) {
    return (
      <ListingPageChrome
        showBack
        title={t("pages.businessDetail.title")}
        description={t("pages.businessDetail.loading")}
      >
        <PageState status="loading" title={t("pages.businessDetail.loadingData")} />
      </ListingPageChrome>
    );
  }

  if (error) {
    return (
      <ListingPageChrome
        showBack
        title={t("pages.businessDetail.title")}
        description={t("pages.businessDetail.error")}
      >
        <PageState
          status="error"
          title={t("pages.businessDetail.loadError")}
          description={error.message}
          onRetry={() => router.refresh()}
        />
      </ListingPageChrome>
    );
  }

  if (!businessData) {
    return (
      <ListingPageChrome
        showBack
        title={t("pages.businessDetail.title")}
        description={t("pages.businessDetail.empty")}
      >
        <PageState status="empty" title={t("pages.businessDetail.emptyData")} />
      </ListingPageChrome>
    );
  }

  const logoUrl = Array.isArray(businessData.business_logo)
    ? businessData.business_logo[0]
    : businessData.business_logo;
  const bannerUrl = Array.isArray(businessData.business_banner)
    ? businessData.business_banner[0]
    : businessData.business_banner;
  const isActive = businessData.Status === "Active";

  return (
    <>
      <div className="page-shell user-detail-page">
        <PageHeader
          showBack
          title={t("pages.businessDetail.title")}
          description={t("pages.businessDetail.description")}
          actions={
            <ActionMenu
              label="Download"
              items={[
                { label: "Export as PDF", onClick: downloadAsPDF },
                { label: "Export as CSV", onClick: downloadAsCSV },
              ]}
            />
          }
        />

        <section className="user-detail-panel">
          {bannerUrl ? (
            <div className="overflow-hidden rounded-t-[inherit]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bannerUrl}
                alt=""
                className="h-36 w-full object-cover sm:h-44"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : null}

          <div className="user-detail-hero">
            <div className="user-detail-hero__glow" aria-hidden />
            <div className="user-detail-hero__row">
              <div className="user-detail-avatar" aria-hidden>
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt=""
                    className="user-detail-avatar__img"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="user-detail-avatar__initials">
                    {initialsFrom(businessData.BusinessName)}
                  </span>
                )}
              </div>

              <div className="user-detail-hero__copy min-w-0 flex-1">
                <div className="user-detail-kicker">
                  <FiBriefcase size={14} aria-hidden />
                  <span>Business profile</span>
                </div>
                <h2 className="user-detail-name">
                  {businessData.BusinessName || "Business"}
                </h2>
                <p className="user-detail-email">
                  <FiMail size={14} aria-hidden />
                  <span>{businessData.Email || "N/A"}</span>
                </p>
                <div className="user-detail-chips">
                  <span
                    className={`badge ${
                      isActive ? "badge-active" : "badge-danger"
                    }`}
                  >
                    {businessData.Status || "Unknown"}
                  </span>
                  {businessData.BusinessType ? (
                    <span className="badge badge-brand">
                      {businessData.BusinessType}
                    </span>
                  ) : null}
                  {businessData.website ? (
                    <span className="badge badge-info">Has website</span>
                  ) : null}
                </div>
              </div>

              <div className="user-detail-hero__actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setEditModalOpen(true)}
                >
                  <FiEdit2 size={16} aria-hidden />
                  Edit business
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => router.push("/pages/statistics")}
                >
                  View stats
                </button>
              </div>
            </div>
          </div>

          {businessData.Description ? (
            <p className="user-detail-listings__desc px-5 pb-2 sm:px-6">
              {businessData.Description}
            </p>
          ) : null}

          <div className="user-detail-grid">
            <MetaCard label="Business name">
              {businessData.BusinessName || "N/A"}
            </MetaCard>
            <MetaCard label="Email">{businessData.Email || "N/A"}</MetaCard>
            <MetaCard label="Phone number">
              <span className="inline-flex items-center gap-1.5">
                <FiPhone size={14} className="opacity-60" aria-hidden />
                {businessData["Phone Number"] || "N/A"}
              </span>
            </MetaCard>
            <MetaCard label="Category">
              {businessData.BusinessType || "N/A"}
            </MetaCard>
            <MetaCard label="Website">
              <span className="inline-flex items-center gap-1.5">
                <FiGlobe size={14} className="opacity-60" aria-hidden />
                {businessData.website || "N/A"}
              </span>
            </MetaCard>
            <MetaCard label="Address">
              <span className="inline-flex items-center gap-1.5">
                <FiMapPin size={14} className="opacity-60" aria-hidden />
                {businessData.Coordinates || "N/A"}
              </span>
            </MetaCard>
            <MetaCard label="Created">
              <span className="inline-flex items-center gap-1.5">
                <FiClock size={14} className="opacity-60" aria-hidden />
                {formatDate(businessData["Date Created"])}
              </span>
            </MetaCard>
            <MetaCard label="Last update">
              {formatDate(businessData["Last Update"])}
            </MetaCard>
          </div>
        </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Business Details</h2>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={editForm.business_name}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <input
                    type="text"
                    name="business_address"
                    value={editForm.business_address}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="business_number"
                    value={editForm.business_number}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="business_email"
                    value={editForm.business_email}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="business_website"
                    value={editForm.business_website}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="business_category"
                    value={editForm.business_category}
                    onChange={handleEditChange}
                    className="field-control w-full"
                    required
                  >
                    <option value="">Select category</option>
                    {taxonomy.map((category) => (
                      <option key={category.key} value={category.key}>
                        {category.label || category.key}
                      </option>
                    ))}
                    {editForm.business_category &&
                    !taxonomy.some(
                      (category) => category.key === editForm.business_category
                    ) ? (
                      <option value={editForm.business_category}>
                        {editForm.business_category}
                      </option>
                    ) : null}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory
                  </label>
                  <select
                    name="business_subcategory"
                    value={editForm.business_subcategory}
                    onChange={handleEditChange}
                    className="field-control w-full"
                    disabled={!editForm.business_category}
                    required
                  >
                    <option value="">Select subcategory</option>
                    {(
                      findCategory(taxonomy, editForm.business_category)
                        ?.subcategories || []
                    ).map((sub) => (
                      <option key={sub.key} value={sub.key}>
                        {sub.label || sub.key}
                      </option>
                    ))}
                    {editForm.business_subcategory &&
                    !(
                      findCategory(taxonomy, editForm.business_category)
                        ?.subcategories || []
                    ).some(
                      (sub) => sub.key === editForm.business_subcategory
                    ) ? (
                      <option value={editForm.business_subcategory}>
                        {editForm.business_subcategory}
                      </option>
                    ) : null}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="business_goals"
                  value={editForm.business_goals}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded-lg h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Logo
                  </label>
                  <div
                    onClick={() => logoInputRef.current.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer h-40"
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="logo preview"
                        className="h-full object-contain"
                      />
                    ) : (
                      <>
                        <span className="text-gray-400">Click to upload logo</span>
                        <span className="text-xs text-gray-400 mt-2">Recommended: 500x500</span>
                      </>
                    )}
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={(e) => handleFileChange(e, "business_logo")}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>

                {/* Banner Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Banner
                  </label>
                  <div
                    onClick={() => bannerInputRef.current.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer h-40"
                  >
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="banner preview"
                        className="h-full object-cover w-full"
                      />
                    ) : (
                      <>
                        <span className="text-gray-400">Click to upload banner</span>
                        <span className="text-xs text-gray-400 mt-2">Recommended: 1200x400</span>
                      </>
                    )}
                    <input
                      type="file"
                      ref={bannerInputRef}
                      onChange={(e) => handleFileChange(e, "business_banner")}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>

                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Images
                  </label>
                  <div
                    onClick={() => imagesInputRef.current.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer h-40"
                  >
                    {imagesPreview.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {imagesPreview.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img}
                              alt={`preview ${index}`}
                              className="h-16 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(index);
                              }}
                              className="absolute top-0 right-0 bg-brand-danger text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-400">Click to upload images</span>
                        <span className="text-xs text-gray-400 mt-2">Upload multiple images</span>
                      </>
                    )}
                    <input
                      type="file"
                      ref={imagesInputRef}
                      onChange={(e) => handleFileChange(e, "business_images")}
                      className="hidden"
                      accept="image/*"
                      multiple
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}

      <section className="user-detail-listings">
        <div className="user-detail-listings__head">
          <h3 className="user-detail-listings__title">Business listings</h3>
          <p className="user-detail-listings__desc">
            Browse and manage every listing owned by this business.
          </p>
        </div>
        <BusinessTabbar userId={businessData?.user_id} />
      </section>

      <AuditHistoryPanel
        targetType="business"
        targetId={businessId}
        title="Business history"
        description="Admin deactivations and related audit events for this business."
      />
      </div>
    </>
  );
};

export default BusinessDetails;