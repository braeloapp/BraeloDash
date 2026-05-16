"use client";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import {
  getBusinessSaveFailure,
  isBusinessCreateSuccess,
  businessSaveErrorMessage,
} from "@/lib/businessApi";
import { getApiErrorMessage } from "@/lib/apiResponse";
import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import BackButton from "@/app/components/BackButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { postBusiData } from "@/app/API/method";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Categories (API values) and subcategories — keys must match backend expectations
const categories = [
  {
    value: "Vehicles",
    label: "Vehicles",
    subcategories: [
      "Cars",
      "Motorcycle",
      "Truck",
      "Bike",
      "Boat",
      "Van",
      "Scooter",
      "partsandaccessories",
      "Rentals",
    ],
  },
  {
    value: "realestate",
    label: "Real estate",
    subcategories: [
      "House",
      "Apartment",
      "Land",
      "mobilehome",
      "commercial",
      "bedroom",
      "suite",
      "studio",
      "vacationhome",
      "basement",
    ],
  },
  {
    value: "electronics",
    label: "Electronics",
    subcategories: [
      "smartphones",
      "computers",
      "appliances",
      "games",
      "servicesandparts",
    ],
  },
  {
    value: "events",
    label: "Events",
    subcategories: ["networkingevents", "concert", "festival"],
  },
  {
    value: "jobs",
    label: "Jobs",
    subcategories: ["fulltime", "parttime", "freelancer", "helper", "homeoffice"],
  },
  {
    value: "furniture",
    label: "Furniture",
    subcategories: ["couch", "tables", "chairs", "beds", "customfurniture"],
  },
  {
    value: "fashion",
    label: "Fashion",
    subcategories: [
      "clothes",
      "shoes",
      "accessories",
      "beautyproducts",
      "jewelry",
    ],
  },
  {
    value: "kids",
    label: "Kids",
    subcategories: [
      "health",
      "toys",
      "transport",
      "accessories",
      "classes",
      "babysitter",
      "daycare",
      "schooloffices",
      "afterschoolprogram",
      "activities",
    ],
  },
  {
    value: "sportsandhobby",
    label: "Sports and hobby",
    subcategories: [
      "sportsequipment",
      "musicalinstruments",
      "collecteditems",
      "games",
      "camping",
      "outdooractivities",
    ],
  },
];

const AddNewBusiness = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const { isLoaded: mapLoaded } = useGoogleMaps();
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const imagesInputRef = useRef(null);
  const formikRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [logoPreview, bannerPreview, imagePreviews]);

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
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBannerSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleImagesSelected = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return files.map((file) => URL.createObjectURL(file));
    });
  };

  const fallbackCoordinates = {
    lat: coordinates.lat ?? 37.7749, // Default to San Francisco lat
    lng: coordinates.lng ?? -122.4194, // Default to San Francisco lng
  };

  // Formik setup
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
      business_number: Yup.string()
        .trim()
        .required("Business number is required")
        .matches(
          /^[\d+\s().-]+$/,
          "Use only digits, spaces, +, parentheses, or hyphens"
        )
        .test(
          "phone-digits",
          "Enter a valid phone number (8–15 digits, include country code if needed)",
          (value) => {
            if (!value) return false;
            const digits = value.replace(/\D/g, "");
            return digits.length >= 8 && digits.length <= 15;
          }
        ),
      business_email: Yup.string()
        .trim()
        .required("Business email is required")
        .max(254, "Email is too long")
        .email("Enter a valid email address"),
      business_website: Yup.string()
        .trim()
        .max(500, "URL is too long")
        .test(
          "website-url",
          "Enter a valid URL (e.g. https://example.com)",
          (value) => {
            if (!value || value.length === 0) return true;
            const normalized = /^https?:\/\//i.test(value)
              ? value
              : `https://${value}`;
            try {
              const u = new URL(normalized);
              const host = u.hostname;
              if (!host) return false;
              if (host === "localhost") return true;
              return host.includes(".");
            } catch {
              return false;
            }
          }
        ),
      business_goals: Yup.string(),
      business_category: Yup.string().required("Business Category is required"),
      business_subcategory: Yup.string().required(
        "Business Subcategory is required"
      ),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to continue.");
          router.push("/login");
          return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("business_name", values.business_name);
        if (values.business_logo) {
          formData.append("business_logo", values.business_logo);
        }
        formData.append("business_address", values.business_address);
        formData.append("business_number", values.business_number.trim());
        formData.append("business_email", values.business_email.trim());
        const rawWebsite = values.business_website?.trim() ?? "";
        const websiteNormalized =
          rawWebsite && !/^https?:\/\//i.test(rawWebsite)
            ? `https://${rawWebsite}`
            : rawWebsite;
        formData.append("business_website", websiteNormalized);
        formData.append("business_goals", values.business_goals);
        formData.append("business_category", values.business_category);
        formData.append("business_subcategory", values.business_subcategory);
        if (values.business_banner) {
          formData.append("business_banner", values.business_banner);
        }
        // Append each image file
        values.business_images.forEach((file) => {
          formData.append("business_images", file);
        });
        formData.append(
          "business_coordinates",
          JSON.stringify({
            type: "Point",
            coordinates: [fallbackCoordinates.lng, fallbackCoordinates.lat],
          })
        );
        formData.append("latitude", String(fallbackCoordinates.lat));
        formData.append("longitude", String(fallbackCoordinates.lng));

        const payload = await postBusiData("/auth/business", formData);

        if (isBusinessCreateSuccess(payload)) {
          toast.success(
            (typeof payload?.message === "string" && payload.message.trim()) ||
              "Business created successfully!",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          setTimeout(() => router.push("/pages/business"), 800);
        } else {
          const failure = getBusinessSaveFailure(payload);
          const msg = businessSaveErrorMessage(failure ?? payload);
          const unauthorized =
            failure?.status === 401 || payload?.status === 401;
          if (unauthorized) {
            toast.error("Session expired. Please log in again.", {
              position: "top-right",
              autoClose: 3000,
            });
            localStorage.removeItem("token");
            router.push("/login");
          } else {
            toast.error(msg, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
          console.error("Error creating business:", { payload, failure });
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        const message = getApiErrorMessage(
          err,
          "Network error. Please try again."
        );
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Network error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  formikRef.current = formik;

  // Address autocomplete (after formik + Google Maps are ready)
  useEffect(() => {
    if (!mapLoaded) return;

    const input = document.getElementById("business_address");
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["geocode"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const { lat, lng } = place.geometry.location;
      setCoordinates({
        lat: lat(),
        lng: lng(),
      });

      formikRef.current?.setFieldValue(
        "business_address",
        place.formatted_address
      );
    });

    return () => {
      if (listener && window.google?.maps?.event?.removeListener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [mapLoaded]);

  return (
    <div className="p-5">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-[#78828A] text-[24px] font-[500]">
          Add New Business
        </h1>
      </div>

      <div className="p-5">
        <form onSubmit={formik.handleSubmit}>
          <label
            htmlFor="business_name"
            className="text-[#78828A] text-[16px] font-[600]"
          >
            Business Name
          </label>
          <div>
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
              <div className="text-red-600">{formik.errors.business_name}</div>
            ) : null}
          </div>

          <div className="mt-4">
            <h6 className="text-[#78828A] text-[16px] font-[600]">
              Business Logo
            </h6>
            <div className="mt-4 flex w-full flex-col items-center overflow-hidden rounded-lg border-2 border-dotted border-gray-300 bg-neutral-50/60">
              <div className="flex min-h-[200px] max-h-[300px] w-full items-center justify-center p-3">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-h-[280px] w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Image
                      src="/b6.png"
                      alt="filesicon"
                      onClick={handleLogoClick}
                      width={50}
                      height={50}
                      className="cursor-pointer"
                    />
                    <input
                      type="file"
                      name="business_logo"
                      accept="image/*"
                      onChange={(e) => {
                        handleLogoSelected(e);
                        formik.setFieldValue(
                          "business_logo",
                          e.currentTarget.files[0]
                        );
                      }}
                      ref={logoInputRef}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center px-3 pb-4 pt-1">
                <p className="text-center text-[16px] text-[#AB9E7D]">
                  Required dimensions
                </p>
                <p className="text-center text-[16px] text-[#AB9E7D]">
                  1080x1920 pixels
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h6 className="text-[#78828A] text-[16px] font-[600]">
              Business Banner
            </h6>
            <div className="mt-4 flex w-full flex-col items-center overflow-hidden rounded-lg border-2 border-dotted border-gray-300 bg-neutral-50/60">
              <div className="flex min-h-[200px] max-h-[300px] w-full items-center justify-center p-3">
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="max-h-[280px] w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Image
                      src="/b6.png"
                      alt="filesicon"
                      onClick={handleBannerClick}
                      width={50}
                      height={50}
                      className="cursor-pointer"
                    />
                    <input
                      type="file"
                      name="business_banner"
                      accept="image/*"
                      onChange={(e) => {
                        handleBannerSelected(e);
                        formik.setFieldValue(
                          "business_banner",
                          e.currentTarget.files[0]
                        );
                      }}
                      ref={bannerInputRef}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center px-3 pb-4 pt-1">
                <p className="text-center text-[16px] text-[#AB9E7D]">
                  Required dimensions
                </p>
                <p className="text-center text-[16px] text-[#AB9E7D]">
                  1080x1920 pixels
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h6 className="text-[#78828A] text-[16px] font-[600]">
              Business Images
            </h6>
            <div className="mt-4 flex w-full flex-col items-center overflow-hidden rounded-lg border-2 border-dotted border-gray-300 bg-neutral-50/60">
              <div className="flex min-h-[200px] w-full items-start justify-center p-3">
                {imagePreviews.length > 0 ? (
                  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={preview}
                        className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-white"
                      >
                        <img
                          src={preview}
                          alt={`Business image ${index + 1}`}
                          className="max-h-full w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[200px] flex-col items-center justify-center">
                    <Image
                      src="/b6.png"
                      alt="filesicon"
                      onClick={handleImagesClick}
                      width={50}
                      height={50}
                      className="cursor-pointer"
                    />
                    <input
                      type="file"
                      name="business_images"
                      accept="image/*"
                      onChange={(e) => {
                        handleImagesSelected(e);
                        formik.setFieldValue(
                          "business_images",
                          Array.from(e.currentTarget.files)
                        );
                      }}
                      ref={imagesInputRef}
                      className="hidden"
                      multiple
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center px-3 pb-4 pt-1">
                <p className="text-center text-[16px] text-[#AB9E7D]">
                  Upload multiple images
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="business_address"
              className="text-[#78828A] text-[16px] font-[600]"
            >
              Business Address (Start typing to search)
            </label>
            <input
              id="business_address"
              name="business_address"
              placeholder="Enter business address"
              className="border p-2 rounded-lg w-full mt-2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.business_address}
            />
            {formik.touched.business_address &&
            formik.errors.business_address ? (
              <div className="text-red-600">
                {formik.errors.business_address}
              </div>
            ) : null}
            {/* {coordinates.lat && coordinates.lng && (
              <div className="text-sm text-gray-500 mt-1">
                Coordinates: {coordinates.lat.toFixed(6)},{" "}
                {coordinates.lng.toFixed(6)} 
              </div>
            )} */}
          </div>

          <div className="flex gap-4 mt-5">
            <div className="flex-1">
              <label
                htmlFor="business_number"
                className="text-[#78828A] text-[16px] font-[600]"
              >
                Business Number
              </label>
              <input
                id="business_number"
                name="business_number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+1 234 567 8900"
                className="border p-2 rounded-lg w-full mt-2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.business_number}
              />
              {formik.touched.business_number &&
              formik.errors.business_number ? (
                <div className="text-red-600">
                  {formik.errors.business_number}
                </div>
              ) : null}
            </div>

            <div className="flex-1">
              <label
                htmlFor="business_email"
                className="text-[#78828A] text-[16px] font-[600]"
              >
                Business Email
              </label>
              <input
                id="business_email"
                name="business_email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@company.com"
                className="border p-2 rounded-lg w-full mt-2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.business_email}
              />
              {formik.touched.business_email &&
              formik.errors.business_email ? (
                <div className="text-red-600">
                  {formik.errors.business_email}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex gap-4 mt-5">
            <div className="flex-1">
              <label
                htmlFor="business_website"
                className="text-[#78828A] text-[16px] font-[600]"
              >
                Business Website
              </label>
              <input
                id="business_website"
                name="business_website"
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="https://example.com (optional)"
                className="border p-2 rounded-lg w-full mt-2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.business_website}
              />
              {formik.touched.business_website &&
              formik.errors.business_website ? (
                <div className="text-red-600">
                  {formik.errors.business_website}
                </div>
              ) : null}
            </div>

            <div className="flex-1">
              <label
                htmlFor="business_category"
                className="text-[#78828A] text-[16px] font-[600]"
              >
                Business Category
              </label>
              <select
                id="business_category"
                name="business_category"
                className="border p-2 rounded-lg w-full mt-2"
                onChange={(e) => {
                  formik.setFieldValue("business_category", e.target.value);
                  formik.setFieldValue("business_subcategory", "");
                }}
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
              {formik.touched.business_category &&
              formik.errors.business_category ? (
                <div className="text-red-600">
                  {formik.errors.business_category}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex gap-4 mt-5">
            <div className="flex-1">
              <label
                htmlFor="business_subcategory"
                className="text-[#78828A] text-[16px] font-[600]"
              >
                Business Subcategory
              </label>
              <select
                id="business_subcategory"
                name="business_subcategory"
                className="border p-2 rounded-lg w-full mt-2"
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
              {formik.touched.business_subcategory &&
              formik.errors.business_subcategory ? (
                <div className="text-red-600">
                  {formik.errors.business_subcategory}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="business_goals"
              className="text-[#78828A] text-[16px] font-[600]"
            >
              Business Goals
            </label>
            <textarea
              id="business_goals"
              name="business_goals"
              placeholder="Describe your business goals..."
              className="border p-2 rounded-lg w-full h-[100px]"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.business_goals}
            />
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-[#CD9403] text-white rounded-lg disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewBusiness;