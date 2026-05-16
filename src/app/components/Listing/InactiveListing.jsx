import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getData,
  postData,
  updateListData,
  deleteData,
} from "@/app/API/method";
import { patchListingCardActive } from "@/lib/patchListingCardActive";
import { postListingFlipStatus } from "@/lib/postListingFlipStatus";
import CardToggle from "./CardToggle";
import ListingCard from "./LisitngCard";
import ListingEmptyState from "./ListingEmptyState";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";
import { Update_data } from "./Data";

const CATEGORY_ENDPOINTS = {
  "Fashion": "fashion",
  "Sports & Hobby": "sportshobby",
  "Furniture": "furniture",
  "Electronics": "electronics",
  "Jobs": "jobs",
  "Vehicles": "vehicles",
  "Kids": "kids",
  "Events": "events",
  "Real Estate": "realestate"
};

const CoordinatesToAddress = ({ coordinates }) => {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAddressFromCoordinates = async (coords) => {
    if (!coords || coords.length !== 2 || !window.google) return null;
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = {
        lat: parseFloat(coords[1]),
        lng: parseFloat(coords[0])
      };

      return new Promise((resolve) => {
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!coordinates || coordinates.length !== 2) return;

    const convertToAddress = async () => {
      setLoading(true);
      try {
        const addr = await getAddressFromCoordinates(coordinates);
        setAddress(addr);
      } catch (error) {
        console.error('Error converting coordinates:', error);
      } finally {
        setLoading(false);
      }
    };

    convertToAddress();
  }, [coordinates]);

  return (
    <div className="mb-2">
      <span className="text-sm font-medium text-gray-500">Location: </span>
      {loading ? (
        <span className="text-sm text-gray-800">Loading address...</span>
      ) : address ? (
        <span className="text-sm text-gray-800">{address}</span>
      ) : (
        <span className="text-sm text-gray-800">
          Coordinates: {coordinates[1]?.toFixed?.(6) || 'N/A'}, {coordinates[0]?.toFixed?.(6) || 'N/A'}
        </span>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => {
  const displayValue =
    typeof value === "object" ? JSON.stringify(value) : value;

  return (
    <div className="mb-2">
      <span className="text-sm font-medium text-gray-500">{label}: </span>
      <span className="text-sm text-gray-800">{displayValue}</span>
    </div>
  );
};

const InactiveListing = ({ user_id }) => {
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
    pageSize: 10,
    totalItems: 0
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded: mapLoaded } = useGoogleMaps();
  const [currentFormFields, setCurrentFormFields] = useState([]);

  useEffect(() => {
    fetchData();

    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.isNew) {
          URL.revokeObjectURL(preview.preview);
        }
      });
    };
  }, []);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getData(
        `/admin-panel/user/all?user_id=${user_id}&is_active=false`
      );
      if (response?.data) {
        const listingsArray = Object.values(response.data);
        
        setData(
          listingsArray.map((item) => ({
            image: item.pictures?.[0] || "/img1.png",
            icons: ["/g1.png", "/g2.png", "/g3.png"],
            title: item.title || "No Title",
            description: `Listing ID: ${item?.id?.substring?.(0, 8)?.toUpperCase() || "N/A"} • ${item?.created_at ? new Date(item.created_at).toLocaleDateString() : ""}`,
            price: item.price ? `$${parseFloat(item.price).toFixed(2)}` : "",
            status: item.is_active ? true : false,
            originalData: item,
            salary: item.salary_range
          }))
        );

        setPagination({
          currentPage: page,
          totalPages: Math.ceil(listingsArray.length / 10),
          hasNext: listingsArray.length > page * 10,
          hasPrev: page > 1,
          pageSize: 10,
          totalItems: listingsArray.length
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

  const handleEditClick = async (card) => {
    setSelectedCard(card);
    const originalData = card.originalData || {};

    let coordinates = originalData.listing_coordinates || { 
      type: "Point", 
      coordinates: [-0.1275862, 51.5072178]
    };

    let address = "";
    if (coordinates.coordinates && coordinates.coordinates.length === 2) {
      const geocodedAddress = await reverseGeocode(coordinates.coordinates);
      if (geocodedAddress) {
        address = geocodedAddress;
      }
    }

    const initialFormData = {
      ...originalData,
      price: originalData.price || "0",
      keywords: Array.isArray(originalData.keywords) 
        ? originalData.keywords.join(", ") 
        : originalData.keywords || "",
      listing_coordinates: JSON.stringify(coordinates),
      location: address,
    };

    const category = originalData.category || "";
    const formFields = Update_data[category] || [];
    setCurrentFormFields(formFields);

    formFields.forEach(field => {
      if (!(field.name in initialFormData)) {
        initialFormData[field.name] = field.type === 'checkbox' ? false : '';
      }
    });

    setFormData(initialFormData);

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

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValidImage = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024;
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

  const getCategoryEndpoint = (category) => {
    const normalizedCategory = category?.toLowerCase()?.trim();
    return CATEGORY_ENDPOINTS[normalizedCategory] || normalizedCategory || "listings";
  };

  const handleUpdateListing = async (e) => {
    e.preventDefault();
    if (!selectedCard) return;

    try {
      setIsUpdating(true);
      const listingId = selectedCard.originalData?.listing_id || selectedCard.listing_id;
      console.log("Listing ID:", listingId);

      if (!listingId) {
        toast.error("Invalid listing ID");
        return;
      }

      const form = new FormData();

      currentFormFields.forEach(field => {
        const value = formData[field.name] || "";
        form.append(field.name, value);
      });

      if (formData.listing_coordinates) {
        form.append("listing_coordinates", formData.listing_coordinates);
      }

      imagePreviews.forEach((img, index) => {
        if (img.isNew) {
          form.append(`pictures`, img.file);
        } else {
          form.append(`existingPictures[${index}]`, img.url);
        }
      });

      const category = formData.category || selectedCard.originalData?.category || "";
      const categoryEndpoint = getCategoryEndpoint(category);
      
      await updateListData(`/admin-panel/${categoryEndpoint}/${listingId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
      form.append('listing_id', listingData.listing_id || '');
      form.append('category', listingData.category || '');
      console.log("Form data for deletion:", form.get("listing_id"), form.get("category"));
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
    const original = card.originalData || {};
    const listingId = original.listing_id || original.id;
    const categoryLabel = (original.category || "").trim();
    if (!listingId) {
      toast.error("Invalid listing ID");
      return;
    }
    if (!categoryLabel) {
      toast.error("Missing listing category");
      return;
    }
    try {
      setIsUpdating(true);
      await postListingFlipStatus(listingId, nextActive, categoryLabel);
      toast.success(nextActive ? "Listing activated" : "Listing deactivated");
      patchListingCardActive(setData, listingId, nextActive, "boolean");
      await fetchData(pagination.currentPage);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update listing status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const renderFormField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleFormChange}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleFormChange}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name] || false}
              onChange={handleFormChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );
      case "datetime-local":
        return (
          <input
            type="datetime-local"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleFormChange}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        );
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleFormChange}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {data.length === 0 ? (
          <ListingEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((card, index) => (
              <ListingCard
                key={index}
                image={card.image}
                icons={card.icons}
                price={card.price}
                title={card.title}
                salary={card.salary}
                description={card.description}
                toggle={
                  <CardToggle
                    status={card.status === true}
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

        {data.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} entries
          </div>

          <div className="flex space-x-2 items-center">
            <button
              onClick={() => fetchData(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev || loading}
              className={`p-3 rounded-md ${pagination.hasPrev && !loading ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <img src="/left.png" alt="" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchData(page)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors
                  ${page === pagination.currentPage
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => fetchData(pagination.currentPage + 1)}
              disabled={!pagination.hasNext || loading}
              className={`p-3 rounded-md ${pagination.hasNext && !loading ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <img src="/right.png" alt="" />
            </button>
          </div>
        </div>
        )}

        {isDetailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-xl font-semibold">Listing Details</h2>
                <button
                  onClick={handleCloseDetailModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    {selectedCard?.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Listing ID: {selectedCard?.id?.substring?.(0, 8)?.toUpperCase() || "N/A"} • 
                    {selectedCard?.created_at
                      ? ` Created: ${new Date(selectedCard.created_at).toLocaleDateString()}`
                      : ""}
                  </p>
                  <p className="text-xl font-bold text-indigo-600 mb-4">
                    {selectedCard?.price
                      ? `$${parseFloat(selectedCard.price).toFixed(2)}`
                      : "Price not set"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCard?.category && (
                      <DetailItem
                        label="Category"
                        value={selectedCard.category}
                      />
                    )}
                    {selectedCard?.subcategory && (
                      <DetailItem
                        label="Subcategory"
                        value={selectedCard.subcategory}
                      />
                    )}
                    {selectedCard?.keywords && (
                      <DetailItem
                        label="Keywords"
                        value={Array.isArray(selectedCard.keywords) 
                          ? selectedCard.keywords.join(", ") 
                          : selectedCard.keywords}
                      />
                    )}
                    {selectedCard?.listing_coordinates && (
                      <CoordinatesToAddress 
                        coordinates={
                          typeof selectedCard.listing_coordinates === "string"
                            ? JSON.parse(selectedCard.listing_coordinates)?.coordinates
                            : selectedCard.listing_coordinates?.coordinates
                        }
                      />
                    )}
                    <DetailItem
                      label="From Business"
                      value={selectedCard?.from_business ? "Yes" : "No"}
                    />
                    <DetailItem
                      label="Status"
                      value={selectedCard?.is_active ? "Active" : "Inactive"}
                    />
                    <DetailItem
                      label="Clicks"
                      value={selectedCard?.listing_clicks || 0}
                    />
                  </div>
                </div>

                {selectedCard?.pictures && selectedCard.pictures.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium mb-2">Images</h4>
                    <div className="flex flex-wrap gap-4">
                      {selectedCard.pictures.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Listing ${index}`}
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ConfirmDeleteDialog
          visible={isDeleteModalOpen}
          onHide={handleCloseDeleteModal}
          onConfirm={handleDeleteListing}
          title="Are you sure you want to delete this listing?"
        />

        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-xl font-semibold">Edit Listing</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isUpdating}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateListing} className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Images
                  </label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {imagePreviews.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.preview || img.url}
                          alt={`Preview ${index}`}
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex flex-col items-center px-4 py-6 bg-white rounded-md border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                    <svg
                      className="w-8 h-8 text-gray-400 mb-2"
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
                    <span className="text-sm text-gray-600">
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
                  <p className="mt-1 text-xs text-gray-500">
                    Upload high-quality images of your listing (max 10 images)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentFormFields.map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="location-autocomplete"
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter location"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Start typing to select a location from Google Maps
                    </p>
                  </div>

                  {formData.listing_coordinates && (
                    <div className="mb-4 col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coordinates
                      </label>
                      <div className="p-2 bg-gray-100 rounded-md">
                        <pre className="text-xs break-all">
                          {JSON.stringify(
                            JSON.parse(formData.listing_coordinates),
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    disabled={isUpdating}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
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

export default InactiveListing;