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
import ListingDetailModal from "./ListingDetailModal";
import ListingEditShell from "./ListingEditShell";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";
import AppLoader from "@/app/components/ux/AppLoader";
import { getEditFieldsForListing } from "@/lib/listingFormFields";

const Sports = () => {
  // State management
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      imagePreviews.forEach(preview => {
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
      const response = await getData(`/listing/paginate/sportshobby?page=${page}`);
      
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
            price: item.price ? `$${item.price}` : "$0",
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
        lng: coordinates[0]
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
        coordinates = typeof originalData.listing_coordinates === 'string' 
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
      condition: originalData?.condition || "NEW",
      subcategory: originalData?.subcategory || "Sports Equipment",
      category: originalData?.category || "Sports & Hobbies",
      donation: originalData?.donation || "NO",
      from_business: originalData?.from_business || "false",
      location: address,
      listing_coordinates: JSON.stringify(coordinates)
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
          const autocomplete = new window.google.maps.places.Autocomplete(input, {
            types: ["geocode"],
          });
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
            
            setFormData(prev => ({
              ...prev,
              location,
              listing_coordinates: JSON.stringify({
                type: "Point",
                coordinates: [coordinates.lng, coordinates.lat]
              })
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
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const isValidImage = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (!validTypes.includes(file.type)) {
      toast.error(`Invalid file type: ${file.type}`);
      return false;
    }
    
    if (file.size > MAX_SIZE) {
      toast.error(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB (max 5MB)`);
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
    
    const validFiles = files.filter(file => isValidImage(file));
    
    if (validFiles.length > 0) {
      const newImagePreviews = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true
      }));
      
      setImagePreviews(prev => [...prev, ...newImagePreviews]);
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => {
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


      const fields = getEditFieldsForListing(
        formData.category || "Sports & Hobby",
        formData.subcategory,
        formData
      );
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
      fields.forEach((field) => {
        const raw = formData[field.name];
        if (raw === undefined || raw === null) return;
        const value = Array.isArray(raw) ? raw.join(",") : String(raw);
        if (value === "" && !field.required) return;
        form.append(field.name, value);
      });

      form.append(
        "listing_coordinates",
        formData.listing_coordinates ||
          '{"type":"Point","coordinates":[74.284469,31.4494997]}'
      );

      imagePreviews.forEach((img, index) => {
        if (img.isNew) {
          form.append(`pictures`, img.file);
        } else {
          form.append(`existingPictures[${index}]`, img.url);
        }
      });

      await updateListData(
        `/admin-panel/sportshobby/${listingId}`,
        form
      );
      
      toast.success("Sports listing updated successfully!");
      await fetchData(pagination.currentPage);
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating listing:", error);
      let errorMsg = "Failed to update sports listing";
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMsg = "Resource not found (404) - please check the endpoint";
        } else if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data?.errors) {
          errorMsg = Object.values(error.response.data.errors).join(', ');
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
      setIsDeleting(true);
      const form = new FormData();
      form.append('listing_id', listingData.id || '');
      form.append('category', 'Sports & Hobbies');

      await deleteData("/admin-panel/delete", form);

      await fetchData(pagination.currentPage);
      toast.success("Sports listing deleted successfully!");
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error(error.response?.data?.message || "Failed to delete sports listing");
    } finally {
      setIsDeleting(false);
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
      await postListingFlipStatus(listingId, nextActive, "Sports & Hobby");
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

  // Form fields configuration
  const formFields = getEditFieldsForListing(
    formData.category || "Sports & Hobby",
    formData.subcategory,
    formData,
    { excludeLocation: true }
  );

  if (loading) {
    return <AppLoader />;
  }

  return (
    <>
      <div className="space-y-4">
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
                    disabled={isUpdating || isDeleting}
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
          title="Are you sure you want to delete this sports listing?"
          confirmLoading={isDeleting}
        />

        {/* Edit Modal */}
        <ListingEditShell
          open={isEditModalOpen}
          title="Edit Sports Listing"
          onClose={handleCloseEditModal}
          disabled={isUpdating}
        >
          <form onSubmit={handleUpdateListing}>
                {/* Image Upload Section */}
                <div className="mb-6">
                  <label className="field-label">
                    Product Images
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
                          className="absolute -top-2 -right-2 bg-brand-danger text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="listing-edit-upload">
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
                  <p className="field-hint">
                    Upload high-quality images of your product (max 10 images)
                  </p>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formFields.map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="field-label">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === "select" ? (
                        <select
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
                          name={field.name}
                          value={Array.isArray(formData[field.name]) ? formData[field.name].join(", ") : (formData[field.name] ?? "")}
                          onChange={handleFormChange}
                          required={field.required}
                          className="field-control"
                          rows={3}
                        />
                      ) : (
                        <input
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

                  {/* Location Field with Autocomplete */}
                  <div className="mb-4">
                    <label className="field-label">
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
                      className="field-control"
                      placeholder="e.g. Lahore, Pakistan"
                    />
                    <p className="field-hint">
                      Start typing to select a location from Google Maps
                    </p>
                  </div>

                  {/* Display Coordinates */}
                  {formData.listing_coordinates && (
                    <div className="mb-4 col-span-full">
                      <label className="field-label">
                        Coordinates
                      </label>
                      <div className="p-2 bg-gray-100 rounded-md">
                        <pre className="text-xs break-all">
                          {JSON.stringify(JSON.parse(formData.listing_coordinates), null, 2)}
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
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn-primary"
                  >
                    {isUpdating ? (
                      <>
                        <AppLoader size="sm" full={false} showLabel={false} tone="light" label="Saving" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
        </ListingEditShell>

        {data.length > 0 && (
          <div className="flex justify-end items-center mt-4">
            <div className="flex space-x-2 items-center justify-end">
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



export default Sports;