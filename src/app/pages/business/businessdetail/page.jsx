"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BusinessTabbar from "@/app/components/Listing/BusinessTabbar";
import BackButton from "@/app/components/BackButton";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";
import { postBusiData } from "@/app/API/method";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

const categories = [
  {
    value: "Vehicles",
    label: "Vehicles",
    subcategories: ["Cars", "Motorcycles", "Trucks"],
  },
  {
    value: "Restaurants",
    label: "Restaurants",
    subcategories: ["Fast Food", "Fine Dining", "Cafe"],
  },
];

const BusinessDetails = () => {
  const router = useRouter();
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

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

  useEffect(() => {
    const storedData = sessionStorage.getItem("currentBusinessData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setBusinessData(data);
      setLoading(false);
      // Initialize edit form
      setEditForm({
        business_name: data.BusinessName || "",
        business_address: data.Coordinates || "",
        business_number: data["Phone Number"] || "",
        business_email: data.Email || "",
        business_website: data.website || "",
        business_goals: data.Description || "",
        business_category: data.BusinessType || "",
        business_subcategory: "",
        business_logo: null,
        business_banner: null,
        business_images: [],
      });
      setLogoPreview(data.business_logo?.[0] || "");
      setBannerPreview(data.business_banner?.[0] || "");
      setImagesPreview(data.business_images || []);
    }
  }, []);

  useEffect(() => {
    const handleDataUpdate = () => {
      const updatedData = sessionStorage.getItem("currentBusinessData");
      if (updatedData) {
        setBusinessData(JSON.parse(updatedData));
      }
    };
    window.addEventListener("businessData", handleDataUpdate);
    return () => {
      window.removeEventListener("businessData", handleDataUpdate);
    };
  }, [businessData]);

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
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        toast.success("Business updated successfully!");
        const updatedData = { 
          ...businessData, 
          ...editForm,
          business_logo: [logoPreview],
          business_banner: [bannerPreview],
          business_images: imagesPreview
        };
        setBusinessData(updatedData);
        sessionStorage.setItem("currentBusinessData", JSON.stringify(updatedData));
        setEditModalOpen(false);
      } else {
        toast.error(response.message || "Failed to update business");
      }
    } catch (error) {
      toast.error("Error updating business");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
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
    setIsDownloadDropdownOpen(false);
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
    setIsDownloadDropdownOpen(false);
    toast.success("CSV downloaded successfully!");
  };

  // Chat Modal Component
  const ChatModal = ({ isOpen, onClose, businessEmail }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contact Business</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          <div className="mb-4">
            <p>Send an email to: <strong>{businessEmail}</strong></p>
          </div>
          <div className="flex justify-end">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(businessEmail)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#CD9403] text-white rounded hover:bg-[#b37f02]"
            >
              Open Gmail
            </a>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-5">
        <div className="flex justify-between">
          <BackButton buttonStyle="bg-gray-300" iconStyle="text-gray-700" />
          <div className="animate-pulse">Loading business data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="flex justify-between">
          <BackButton buttonStyle="bg-gray-300" iconStyle="text-gray-700" />
          <div className="text-red-500">
            Error: {error.message}
            <button
              onClick={() => router.back()}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="p-5">
        <div className="flex justify-between">
          <BackButton buttonStyle="bg-gray-300" iconStyle="text-gray-700" />
          <div>No business data available</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-b">
        <div className="p-5">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <BackButton buttonStyle="bg-gray-300" iconStyle="text-gray-700" />
              <h1 className="text-[#78828A] text-[24px] font-[500] flex items-center">
                {businessData.BusinessName} Details
              </h1>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
                className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm pl-10 pr-2 py-2"
              >
                <Image
                  src="/images/export.png"
                  alt="export"
                  width={24}
                  height={24}
                  className="absolute left-3"
                />
                <span className="text-[#75818D] text-[14px]">
                  Download Export
                </span>
              </button>
              {isDownloadDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={downloadAsPDF}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={downloadAsCSV}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-b">
        <div className="flex justify-between mt-5">
          <div className="flex gap-2 items-center">
            <div className="px-2 rounded-full">
              {businessData.business_logo?.[0] ? (
                <img
                  src={businessData.business_logo[0]}
                  alt="logo"
                  width={20}
                  height={20}
                  className="rounded-full w-8"
                  onError={(e) => (e.target.src = "/c1.png")}
                />
              ) : (
                <Image src="/c1.png" alt="logo" width={20} height={20} />
              )}
            </div>
            <h1 className="text-[#75818D] text-[18px] font-[700]">
              {businessData.BusinessName}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChatModalOpen(true)}
              className="p-2 bg-[#CD9403] rounded text-white flex items-center gap-2"
            >
              <img src="/a7.png" alt="" />
              Chat
            </button>
            <button
              onClick={() => setEditModalOpen(true)}
              className="p-2 bg-[#CD9403] rounded text-white flex items-center"
            >
              <img src="/a17.png" alt="" />
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 border-b">
        <div className="flex gap-3">
          {businessData.business_images?.map((image, index) => (
            <div
              key={index}
              className="border border-dashed border-[#CD940380] w-[154px] h-[134px] flex justify-center p-10 rounded-lg"
            >
              <img
                src={image}
                alt={`business ${index}`}
                width={50}
                height={50}
                className="object-cover"
                onError={(e) => (e.target.src = "/b6.png")}
              />
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h1 className="text-[16px] font-[700] text-[#75818D]">
            Bio: <span className="font-[400] text-[#a0a8b1] ml-1">
              {businessData.Bio || "No bio"}
            </span>
          </h1>
          <h1 className="text-[16px] font-[700] text-[#75818D] mt-3">
            Description: <span className="font-[400] text-[#a0a8b1] ml-1">
              {businessData.Description || "No description"}
            </span>
          </h1>
        </div>
        <div className="mt-3">
          <button
            className="w-[200px] h-[40px] bg-[#CD9403] text-white rounded-lg text-[15px]"
            onClick={() => router.push("/pages/statistics")}
          >
            View Business Stats
          </button>
        </div>
      </div>

      <div className="flex gap-[100px] mt-5 border-b p-5">
        <div>
          <h1 className="text-[16px] font-[700] text-[#75818D]">
            Name: <span className="font-[400] text-[#a0a8b1] ml-1">
              {businessData.BusinessName}
            </span>
          </h1>
          <h1 className="text-[16px] font-[700] text-[#75818D] mt-3">
            Email: <span className="font-[400] text-[#a0a8b1] ml-1">
              {businessData.Email}
            </span>
          </h1>
          <h1 className="text-[16px] font-[700] text-[#75818D] mt-3">
            Phone: <span className="font-[400] text-[#a0a8b1] ml-1">
              {businessData["Phone Number"]}
            </span>
          </h1>
          <h1 className="text-[16px] font-[700] text-[#75818D] mt-3">
            Status: <span className={`font-[400] px-5 py-2 text-white rounded-lg ml-1 ${
              businessData.Status === "Active" ? "bg-[#06B64C]" : "bg-[#C7233F]"
            }`}>
              {businessData.Status}
            </span>
          </h1>
        </div>
        <div>
          <h1 className="text-[16px] font-[700] text-[#75818D]">
            Created: <span className="font-[400] text-[#a0a8b1] ml-1">
              {businessData["Date Created"] || "N/A"}
            </span>
          </h1>
          <h1 className="text-[16px] font-[700] text-[#75818D] mt-3">
            Last Update: <span className="font-[400] text-[#a0a8b1] ml-1">
              {businessData["Last Update"] || "N/A"}
            </span>
          </h1>
          <h1 className="text-[16px] font-[700] text-[#75818D] mt-3">
            Address: <span className="font-[400] text-[#a0a8b1] ml-1">
              {businessData.Coordinates || "N/A"}
            </span>
          </h1>
        </div>
      </div>

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
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
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
                    className="w-full p-2 border rounded-lg"
                    disabled={!editForm.business_category}
                  >
                    <option value="">Select subcategory</option>
                    {editForm.business_category && 
                      categories.find(c => c.value === editForm.business_category)?.subcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))
                    }
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
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
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
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#CD9403] text-white rounded hover:bg-[#b37f02] disabled:opacity-50"
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
      <ChatModal 
        isOpen={isChatModalOpen}
        onClose={() => setChatModalOpen(false)}
        businessEmail={businessData?.Email}
      />

      <BusinessTabbar businessId={businessData?.id} />
    </>
  );
};

export default BusinessDetails;