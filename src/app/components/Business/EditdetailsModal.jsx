"use client";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postBusiData } from "@/app/API/method";

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

const EditdetailsModal = ({ isOpen, onClose, businessData, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(businessData?.business_logo || null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const { isLoaded: mapLoaded } = useGoogleMaps(isOpen);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  // Initialize form with business data
  useEffect(() => {
    if (businessData && isOpen) {
      formik.setValues({
        business_name: businessData.BusinessName || "",
        business_logo: null,
        business_address: businessData.Coordinates || "",
        business_number: businessData["Phone Number"] || "",
        business_email: businessData.Email || "",
        business_website: businessData.website || "",
        business_goals: businessData.Description || "",
        business_category: businessData.BusinessType || "",
        business_subcategory: "",
        business_banner: null,
        business_images: [],
      });
      setLogoPreview(businessData.business_logo || null);
    }
  }, [businessData, isOpen]);

  // Initialize autocomplete for address field
  useEffect(() => {
    if (!mapLoaded || !isOpen) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("business_address"),
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const { lat, lng } = place.geometry.location;
      setCoordinates({
        lat: lat(),
        lng: lng(),
      });

      formik.setFieldValue("business_address", place.formatted_address);
    });
  }, [mapLoaded, isOpen]);

  const handleLogoClick = () => {
    logoInputRef.current.click();
  };

  const handleBannerClick = () => {
    bannerInputRef.current.click();
  };

  const handleImagesClick = () => {
    imagesInputRef.current.click();
  };

  const handleLogoSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setLogoPreview(URL.createObjectURL(file));
    formik.setFieldValue("business_logo", file);
    setLoading(false);
  };

  const handleBannerSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setBannerPreview(URL.createObjectURL(file));
    formik.setFieldValue("business_banner", file);
    setLoading(false);
  };

  const handleImagesSelected = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    formik.setFieldValue("business_images", files);
    setLoading(false);
  };

  // Formik setup with API integration
  const formik = useFormik({
    initialValues: {
      business_name: "",
      business_logo: null,
      business_address: "",
      business_number: "",
      business_email: "",
      business_website: "",
      business_goals: "",
      business_category: "",
      business_subcategory: "",
      business_banner: null,
      business_images: [],
    },
    validationSchema: Yup.object({
      business_name: Yup.string().required("Business Name is required"),
      business_address: Yup.string().required("Address is required"),
      business_number: Yup.string().required("Business Number is required"),
      business_email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      business_website: Yup.string().url("Invalid URL format"),
      business_category: Yup.string().required("Business Category is required"),
      business_subcategory: Yup.string().required(
        "Business Subcategory is required"
      ),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        // Prepare form data
        const formData = new FormData();
        formData.append("business_name", values.business_name);
        if (values.business_logo) {
          formData.append("business_logo", values.business_logo);
        }
        formData.append("business_address", values.business_address);
        formData.append("business_number", values.business_number);
        formData.append("business_email", values.business_email);
        formData.append("business_website", values.business_website);
        formData.append("business_goals", values.business_goals);
        formData.append("business_category", values.business_category);
        formData.append("business_subcategory", values.business_subcategory);
        if (values.business_banner) {
          formData.append("business_banner", values.business_banner);
        }
        values.business_images.forEach((file) => {
          formData.append("business_images", file);
        });
        if (coordinates.lat && coordinates.lng) {
          formData.append("latitude", coordinates.lat);
          formData.append("longitude", coordinates.lng);
        }

        // API call to update business
        const response = await postBusiData(
          `/admin-panel/business/update/${businessData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data) {
          toast.success("Business updated successfully!");
          if (onUpdateSuccess) {
            onUpdateSuccess();
          }
          onClose();
        } else {
          toast.error(response.message || "Failed to update business");
        }
      } catch (error) {
        toast.error("An error occurred while updating the business");
        console.error("Update error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Business Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label htmlFor="business_name" className="block text-[#78828A] text-[16px] font-[600] mb-2">
                  Business Name
                </label>
                <input
                  id="business_name"
                  name="business_name"
                  placeholder="Enter business name"
                  className="border p-2 rounded-lg w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.business_name}
                />
                {formik.touched.business_name && formik.errors.business_name ? (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.business_name}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="business_address" className="block text-[#78828A] text-[16px] font-[600] mb-2">
                  Business Address (Start typing to search)
                </label>
                <input
                  id="business_address"
                  name="business_address"
                  placeholder="Enter business address"
                  className="border p-2 rounded-lg w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.business_address}
                />
                {formik.touched.business_address && formik.errors.business_address ? (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.business_address}</div>
                ) : null}
                {coordinates.lat && coordinates.lng && (
                  <div className="text-sm text-gray-500 mt-1">
                    Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="business_number" className="block text-[#78828A] text-[16px] font-[600] mb-2">
                  Business Number
                </label>
                <input
                  id="business_number"
                  name="business_number"
                  placeholder="Enter business number"
                  className="border p-2 rounded-lg w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.business_number}
                />
                {formik.touched.business_number && formik.errors.business_number ? (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.business_number}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="business_email" className="block text-[#78828A] text-[16px] font-[600] mb-2">
                  Business Email
                </label>
                <input
                  id="business_email"
                  name="business_email"
                  placeholder="Enter business email"
                  className="border p-2 rounded-lg w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.business_email}
                />
                {formik.touched.business_email && formik.errors.business_email ? (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.business_email}</div>
                ) : null}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label htmlFor="business_website" className="block text-[#78828A] text-[16px] font-[600] mb-2">
                  Business Website
                </label>
                <input
                  id="business_website"
                  name="business_website"
                  placeholder="Enter website URL"
                  className="border p-2 rounded-lg w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.business_website}
                />
                {formik.touched.business_website && formik.errors.business_website ? (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.business_website}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="business_category" className="block text-[#78828A] text-[16px] font-[600] mb-2">
                  Business Category
                </label>
                <select
                  id="business_category"
                  name="business_category"
                  className="border p-2 rounded-lg w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.business_category}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {formik.touched.business_category && formik.errors.business_category ? (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.business_category}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="business_subcategory" className="block text-[#78828A] text-[16px] font-[600] mb-2">
                  Business Subcategory
                </label>
                <select
                  id="business_subcategory"
                  name="business_subcategory"
                  className="border p-2 rounded-lg w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.business_subcategory}
                  disabled={!formik.values.business_category}
                >
                  <option value="">Select a subcategory</option>
                  {formik.values.business_category &&
                    categories
                      .find((c) => c.value === formik.values.business_category)
                      ?.subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                </select>
                {formik.touched.business_subcategory && formik.errors.business_subcategory ? (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.business_subcategory}</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Full width fields */}
          <div className="mb-4">
            <label htmlFor="business_goals" className="block text-[#78828A] text-[16px] font-[600] mb-2">
              Business Description
            </label>
            <textarea
              id="business_goals"
              name="business_goals"
              placeholder="Describe your business..."
              className="border p-2 rounded-lg w-full h-[100px]"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.business_goals}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Logo Upload */}
            <div>
              <h6 className="text-[#78828A] text-[16px] font-[600] mb-2">Business Logo</h6>
              <div
                className="flex flex-col justify-center items-center border-2 border-dotted rounded-lg"
                style={{ minHeight: "150px" }}
                onClick={handleLogoClick}
              >
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center p-4">
                        <Image
                          src="/b6.png"
                          alt="filesicon"
                          width={50}
                          height={50}
                          className="cursor-pointer"
                        />
                        <p className="text-[14px] text-[#AB9E7D] mt-2 text-center">
                          Click to upload logo
                        </p>
                      </div>
                    )}
                  </>
                )}
                <input
                  type="file"
                  name="business_logo"
                  accept="image/*"
                  onChange={handleLogoSelected}
                  ref={logoInputRef}
                  className="hidden"
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <h6 className="text-[#78828A] text-[16px] font-[600] mb-2">Business Banner</h6>
              <div
                className="flex flex-col justify-center items-center border-2 border-dotted rounded-lg"
                style={{ minHeight: "150px" }}
                onClick={handleBannerClick}
              >
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center p-4">
                        <Image
                          src="/b6.png"
                          alt="filesicon"
                          width={50}
                          height={50}
                          className="cursor-pointer"
                        />
                        <p className="text-[14px] text-[#AB9E7D] mt-2 text-center">
                          Click to upload banner
                        </p>
                      </div>
                    )}
                  </>
                )}
                <input
                  type="file"
                  name="business_banner"
                  accept="image/*"
                  onChange={handleBannerSelected}
                  ref={bannerInputRef}
                  className="hidden"
                />
              </div>
            </div>

            {/* Images Upload */}
            <div>
              <h6 className="text-[#78828A] text-[16px] font-[600] mb-2">Business Images</h6>
              <div
                className="flex flex-col justify-center items-center border-2 border-dotted rounded-lg"
                style={{ minHeight: "150px" }}
                onClick={handleImagesClick}
              >
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {imagePreviews.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 w-full p-2">
                        {imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`preview-${index}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center p-4">
                        <Image
                          src="/b6.png"
                          alt="filesicon"
                          width={50}
                          height={50}
                          className="cursor-pointer"
                        />
                        <p className="text-[14px] text-[#AB9E7D] mt-2 text-center">
                          Click to upload images
                        </p>
                      </div>
                    )}
                  </>
                )}
                <input
                  type="file"
                  name="business_images"
                  accept="image/*"
                  onChange={handleImagesSelected}
                  ref={imagesInputRef}
                  className="hidden"
                  multiple
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
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
  );
};

export default EditdetailsModal;