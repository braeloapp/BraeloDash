import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getData,
  postData,
  updateListData,
  deleteData,
} from "@/app/API/method"
import { formatListingPrice } from "@/lib/listingCards";
import { patchListingCardActive } from "@/lib/patchListingCardActive";
import { postListingFlipStatus } from "@/lib/postListingFlipStatus";
import CardToggle from "./CardToggle";
import ListingCard from "./LisitngCard";
import ListingEmptyState from "./ListingEmptyState";
import ListingDetailModal from "./ListingDetailModal";
import ListingEditShell from "./ListingEditShell";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";
import AppLoader from "@/app/components/ux/AppLoader";

function getVehicleFormFields(subcategory) {
  const sub = String(subcategory || "").toLowerCase();
  return [
    { name: "category", label: "Category", type: "text", required: true },
    { name: "subcategory", label: "Subcategory", type: "text", required: true },
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    { name: "make", label: "Make", type: "text", required: true },
    { name: "model", label: "Model", type: "text", required: true },
    { name: "year", label: "Year", type: "number", required: true },
    { name: "color", label: "Color", type: "text", required: true },
    { name: "mileage", label: "Mileage", type: "number", required: true },
    { name: "fuel_type", label: "Fuel Type", type: "text", required: true },
    { name: "price", label: "Price", type: "number", required: true },
    ...(sub === "truck"
      ? [
          {
            name: "Load_capacity",
            label: "Load Capacity",
            type: "number",
            required: true,
          },
        ]
      : []),
    ...(sub === "bike"
      ? [{ name: "bike_type", label: "Bike Type", type: "text", required: true }]
      : []),
    ...(sub === "boat"
      ? [
          {
            name: "boat_length",
            label: "Boat Length",
            type: "number",
            required: true,
          },
        ]
      : []),
    ...(sub === "van"
      ? [
          {
            name: "passenger_capacity",
            label: "Passenger Capacity",
            type: "number",
            required: true,
          },
        ]
      : []),
    ...(sub === "partsandaccessories"
      ? [
          {
            name: "part_name",
            label: "Part Name",
            type: "text",
            required: true,
          },
        ]
      : []),
    ...(sub === "rentals"
      ? [
          {
            name: "vehicle_type",
            label: "Vehicle Type",
            type: "text",
            required: true,
          },
          {
            name: "rental_duration",
            label: "Rental Duration",
            type: "text",
            required: true,
          },
        ]
      : []),
    ...(sub !== "partsandaccessories"
      ? [
          {
            name: "transmission",
            label: "Transmission",
            type: "select",
            options: ["MANUAL", "AUTOMATIC"],
            required: true,
          },
          {
            name: "purpose",
            label: "Purpose",
            type: "select",
            options: ["SALE", "RENTAL"],
            required: true,
          },
        ]
      : []),
    ...(sub === "cars"
      ? [
          {
            name: "number_of_doors",
            label: "Number of Doors",
            type: "select",
            options: ["1/3", "4/5"],
            required: true,
          },
        ]
      : []),
    ...(sub === "rentals"
      ? [
          {
            name: "for_sale",
            label: "For Sale",
            type: "select",
            options: ["YES", "NO"],
            required: true,
          },
          {
            name: "rentals",
            label: "Rentals",
            type: "select",
            options: ["YES", "NO"],
            required: true,
          },
        ]
      : []),
    {
      name: "negotiable",
      label: "Negotiable",
      type: "select",
      options: ["YES", "NO"],
      required: true,
    },
    {
      name: "condition",
      label: "Condition",
      type: "select",
      options: ["NEW", "USED"],
      required: true,
    },
    {
      name: "keywords",
      label: "Keywords (comma separated)",
      type: "text",
      required: false,
    },
  ];
}

const Vehicles = () => {
  // State management
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded: mapLoaded } = useGoogleMaps();


  useEffect(() => {
    fetchData();

    return () => {
      // Clean up image preview URLs
      imagePreviews.forEach((preview) => {
        if (preview.isNew) {
          URL.revokeObjectURL(preview.preview);
        }
      });
    };
  }, []);

  // Fetch data with pagination
  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getData(`/listing/paginate/vehicles?page=${page}`);

      if (response?.data) {
        setData(
          response.data.results.map((item) => ({
            image: item.pictures?.[0] || "/img1.png",
            icons: ["/g1.png", "/g2.png", "/g3.png"],
            title: item.title || "No Title",
            description: `Listing ID ${
              item?.id?.substring?.(0, 8)?.toUpperCase() || "N/A"
            } ${
              item?.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : ""
            }`,
            price: formatListingPrice(item) || "$0",
            status: item.is_active ? "active" : "inactive",
            originalData: item,
          }))
        );

        setPagination({
          currentPage: page,
          totalPages: Math.ceil(response.data.count / 10),
          hasNext: !!response.data.next,
          hasPrev: !!response.data.previous,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Failed to load listings");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (coordinates) => {
    if (!mapLoaded || !window.google) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = {
        lat: coordinates[1],
        lng: coordinates[0],
      };

      return new Promise((resolve) => {
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return null;
    }
  };

  // Handle edit click
  const handleEditClick = async (card) => {
    setSelectedCard(card);
    const originalData = card.originalData || {};

    // Parse coordinates
    let coordinates = { type: "Point", coordinates: [74.284469, 31.4494997] };
    try {
      if (originalData.listing_coordinates) {
        coordinates =
          typeof originalData.listing_coordinates === "string"
            ? JSON.parse(originalData.listing_coordinates)
            : originalData.listing_coordinates;
      }
    } catch (e) {
      console.error("Error parsing coordinates:", e);
    }

    // Prefer API human-readable location; only reverse-geocode as fallback
    let address = String(originalData.location || "").trim();
    if (
      !address &&
      coordinates.coordinates &&
      coordinates.coordinates.length === 2
    ) {
      const geocodedAddress = await reverseGeocode(coordinates.coordinates);
      if (geocodedAddress) {
        address = geocodedAddress;
      }
    }

    setFormData({
      ...originalData,
      negotiable: originalData?.negotiable || "NO",
      condition: originalData?.condition || "USED",
      category: originalData?.category || "Vehicles",
      subcategory: originalData?.subcategory || "Cars",
      make: originalData?.make || "",
      model: originalData?.model || "",
      year: originalData?.year || "",
      color: originalData?.color || "",
      mileage: originalData?.mileage ?? "",
      fuel_type: originalData?.fuel_type || "",
      transmission: originalData?.transmission || "",
      purpose: originalData?.purpose || "",
      number_of_doors: originalData?.number_of_doors || "",
      Load_capacity: originalData?.Load_capacity ?? "",
      bike_type: originalData?.bike_type || "",
      boat_length: originalData?.boat_length ?? "",
      passenger_capacity: originalData?.passenger_capacity ?? "",
      part_name: originalData?.part_name || "",
      vehicle_type: originalData?.vehicle_type || "",
      rental_duration: originalData?.rental_duration || "",
      for_sale: originalData?.for_sale || "",
      rentals: originalData?.rentals || "",
      listing_coordinates: JSON.stringify(coordinates),
      location: address,
    });

    // Handle image previews
    if (originalData.pictures && originalData.pictures.length > 0) {
      setImagePreviews(
        originalData.pictures.map((pic) => ({
          url: pic,
          isNew: false,
        }))
      );
    } else {
      setImagePreviews([]);
    }

    setIsEditModalOpen(true);

    // Initialize Google Maps autocomplete after a slight delay
    setTimeout(() => {
      if (mapLoaded && typeof window.google !== "undefined") {
        const input = document.getElementById("location-autocomplete");
        if (input) {
          const autocomplete = new window.google.maps.places.Autocomplete(
            input,
            {
              types: ["geocode"],
            }
          );
          setAutocomplete(autocomplete);

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
              toast.warning("No details available for this location");
              return;
            }

            const location = place.formatted_address;
            const coordinates = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            setFormData((prev) => ({
              ...prev,
              location,
              listing_coordinates: JSON.stringify({
                type: "Point",
                coordinates: [coordinates.lng, coordinates.lat],
              }),
            }));
          });
        }
      }
    }, 500);
  };

  // Modal handlers
  const handleOpenDetail = (card) => {
    setSelectedCard(card.originalData || card);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (card) => {
    setSelectedCard(card);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCard(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCard(null);
    setFormData({});
    setImagePreviews([]);
    setAutocomplete(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCard(null);
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValidImage = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const validTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!validTypes.includes(file.type)) {
      toast.error(`Invalid file type: ${file.type}`);
      return false;
    }

    if (file.size > MAX_SIZE) {
      toast.error(
        `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB (max 5MB)`
      );
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_IMAGES = 10;

    if (files.length + imagePreviews.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const validFiles = files.filter((file) => isValidImage(file));

    if (validFiles.length > 0) {
      const newImagePreviews = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      }));

      setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index].isNew) {
        URL.revokeObjectURL(newPreviews[index].preview);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  // API operations
  const handleUpdateListing = async (e) => {
    e.preventDefault();
    if (!selectedCard) return;

    try {
      setIsUpdating(true);
      const listingId = selectedCard.originalData?.id || selectedCard.id;

      if (!listingId) {
        toast.error("Invalid listing ID");
        return;
      }

      const fields = getVehicleFormFields(formData.subcategory);
      const missing = fields
        .filter((field) => field.required)
        .find((field) => {
          const value = formData[field.name];
          return value === undefined || value === null || String(value).trim() === "";
        });
      if (missing) {
        toast.error(`${missing.label} is required`);
        setIsUpdating(false);
        return;
      }

      const form = new FormData();

      // Append all form data
      form.append("category", formData.category || "Vehicles");
      form.append("subcategory", formData.subcategory || "Cars");
      form.append("title", formData.title || "");
      form.append("description", formData.description || "");
      form.append("location", formData.location || "");
      form.append("make", formData.make || "");
      form.append("model", formData.model || "");
      form.append("year", formData.year || "");
      form.append("color", formData.color || "");
      form.append(
        "mileage",
        formData.mileage === "" || formData.mileage == null
          ? ""
          : String(formData.mileage)
      );
      form.append("fuel_type", formData.fuel_type || "");
      form.append("transmission", formData.transmission || "");
      form.append("purpose", formData.purpose || "");
      if (formData.number_of_doors) {
        form.append("number_of_doors", formData.number_of_doors);
      }
      [
        "Load_capacity",
        "bike_type",
        "boat_length",
        "passenger_capacity",
        "part_name",
        "vehicle_type",
        "rental_duration",
        "for_sale",
        "rentals",
      ].forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
          form.append(key, String(formData[key]));
        }
      });
      form.append("price", String(formData.price || 0));
      form.append("negotiable", formData.negotiable || "NO");
      form.append("condition", formData.condition || "USED");
      form.append(
        "listing_coordinates",
        formData.listing_coordinates ||
          '{"type":"Point","coordinates":[74.284469,31.4494997]}'
      );

      // Handle keywords
      if (formData.keywords) {
        form.append(
          "keywords",
          Array.isArray(formData.keywords)
            ? formData.keywords.join(",")
            : formData.keywords
        );
      }

      // Handle images
      imagePreviews.forEach((img, index) => {
        if (img.isNew) {
          form.append(`pictures`, img.file);
        } else {
          form.append(`existingPictures[${index}]`, img.url);
        }
      });

      await updateListData(`/admin-panel/vehicles/${listingId}`, form);

      toast.success("Listing updated successfully!");
      await fetchData(pagination.currentPage);
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating listing:", error);
      let errorMsg = "Failed to update listing";

      if (error.response) {
        if (error.response.status === 404) {
          errorMsg = "Resource not found (404) - please check the endpoint";
        } else if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data?.errors) {
          errorMsg = Object.values(error.response.data.errors).join(", ");
        }
      }

      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteListing = async () => {
    const listingData = selectedCard?.originalData || selectedCard;
    if (!listingData) return;

    try {
      const form = new FormData();
      form.append("listing_id", listingData.id || "");
      form.append("category", "Vehicles");

      await deleteData("/admin-panel/delete", form);

      await fetchData(pagination.currentPage);
      toast.success("Listing deleted successfully!");
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error(error.response?.data?.message || "Failed to delete listing");
    }
  };

  const handleToggleStatus = async (card, nextActive) => {
    const od = card.originalData || {};
    const listingId = od.listing_id || od.id;
    if (!listingId) {
      toast.error("Invalid listing ID");
      return;
    }
    try {
      setIsUpdating(true);
      await postListingFlipStatus(listingId, nextActive, "Vehicles");
      toast.success(nextActive ? "Listing activated" : "Listing deactivated");
      patchListingCardActive(setData, listingId, nextActive, "string");
      await fetchData(pagination.currentPage);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update listing status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const formFields = getVehicleFormFields(formData.subcategory);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <div className="space-y-4">
        {/* Pagination Controls */}
        {/* <div className="flex justify-between items-center">
          <button
            onClick={() => fetchData(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev || loading}
            className={`px-4 py-2 rounded-md ${pagination.hasPrev && !loading ? 'bg-[#CD9403] text-white hover:bg-[#b37f02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchData(pagination.currentPage + 1)}
            disabled={!pagination.hasNext || loading}
            className={`px-4 py-2 rounded-md ${pagination.hasNext && !loading ? 'bg-[#CD9403] text-white hover:bg-[#b37f02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div> */}

        {/* Vehicle Listings */}
        {data.length === 0 ? (
          <ListingEmptyState />
        ) : (
          <div className="listing-card-grid">
            {data.map((card, index) => (
              <ListingCard
                key={index}
                image={card.image}
                icons={card.icons}
                price={card.price}
                title={card.title}
                description={card.description}
                toggle={
                  <CardToggle
                    status={card.status === "active"}
                    onToggle={(next) => handleToggleStatus(card, next)}
                    disabled={isUpdating}
                  />
                }
                onIconClick={(icon) => {
                  if (icon === "/g1.png") handleEditClick(card);
                  if (icon === "/g2.png") handleDeleteClick(card);
                  if (icon === "/g3.png") handleOpenDetail(card);
                }}
              />
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <ListingDetailModal
          open={isDetailModalOpen}
          listing={selectedCard}
          onClose={handleCloseDetailModal}
        />

        <ConfirmDeleteDialog
          visible={isDeleteModalOpen}
          onHide={handleCloseDeleteModal}
          onConfirm={handleDeleteListing}
          title="Are you sure you want to delete this vehicle listing?"
        />

        {/* Edit Modal */}
        <ListingEditShell
          open={isEditModalOpen}
          title="Edit Vehicle Listing"
          onClose={handleCloseEditModal}
          disabled={isUpdating}
        >
          <form onSubmit={handleUpdateListing}>
            <div className="mb-6">
              <label className="field-label">Vehicle Images</label>
              <div className="mb-4 flex flex-wrap gap-3">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="listing-edit-thumb group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.preview || img.url} alt={`Preview ${index}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-danger)] text-xs text-white opacity-0 transition group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <label className="listing-edit-upload">
                <svg
                  className="mb-2 h-8 w-8 text-[var(--color-text-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  Click to upload images
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                />
              </label>
              <p className="field-hint">
                Upload high-quality images of your vehicle (max 10 images)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={field.type === "textarea" ? "md:col-span-2" : ""}
                >
                  <label className="field-label" htmlFor={`edit-${field.name}`}>
                    {field.label}
                    {field.required ? (
                      <span className="text-red-500"> *</span>
                    ) : null}
                  </label>

                  {field.type === "select" ? (
                    <select
                      id={`edit-${field.name}`}
                      name={field.name}
                      value={Array.isArray(formData[field.name]) ? formData[field.name].join(", ") : (formData[field.name] ?? "")}
                      onChange={handleFormChange}
                      required={field.required}
                      className="field-control"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      id={`edit-${field.name}`}
                      name={field.name}
                      value={Array.isArray(formData[field.name]) ? formData[field.name].join(", ") : (formData[field.name] ?? "")}
                      onChange={handleFormChange}
                      required={field.required}
                      className="field-control"
                      rows={3}
                    />
                  ) : field.type === "checkbox" ? (
                    <input
                      id={`edit-${field.name}`}
                      type="checkbox"
                      name={field.name}
                      checked={formData[field.name] || false}
                      onChange={handleFormChange}
                      className="h-4 w-4 rounded border-gray-300 text-[#CD9403] focus:ring-[#CD9403]"
                    />
                  ) : (
                    <input
                      id={`edit-${field.name}`}
                      type={field.type}
                      name={field.name}
                      value={Array.isArray(formData[field.name]) ? formData[field.name].join(", ") : (formData[field.name] ?? "")}
                      onChange={handleFormChange}
                      required={field.required}
                      className="field-control"
                    />
                  )}
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="field-label" htmlFor="location-autocomplete">
                  Location
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  id="location-autocomplete"
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleFormChange}
                  required
                  className="field-control"
                  placeholder="e.g. Lahore, Pakistan"
                  autoComplete="off"
                />
                <p className="field-hint">
                  Uses the listing location from the API. Start typing to pick a
                  new place from Google Maps.
                </p>
              </div>
            </div>

            <div className="listing-edit-footer">
              <button
                type="button"
                onClick={handleCloseEditModal}
                disabled={isUpdating}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="btn-primary"
              >
                {isUpdating ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </ListingEditShell>
        {data.length > 0 && (
          <div className="flex justify-end items-center mt-4">
            <div className="flex space-x-2 items-center justify-ends">
              {/* Prev Button */}
              <button
                onClick={() => fetchData(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev || loading}
                className={`p-3 rounded-md ${
                  pagination.hasPrev && !loading
                    ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <img src="/left.png" alt="" />
              </button>
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchData(page)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors
                    ${
                      page === pagination.currentPage
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => fetchData(pagination.currentPage + 1)}
                disabled={!pagination.hasNext || loading}
                className={`p-3 rounded-md ${
                  pagination.hasNext && !loading
                    ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <img src="/right.png" alt="" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};



export default Vehicles;
