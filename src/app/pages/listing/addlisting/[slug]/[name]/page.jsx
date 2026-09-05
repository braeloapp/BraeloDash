"use client";
// pages/listing/addlisting/[slug]/[name]/page.jsx (Form Page)
import { loadGoogleMaps } from "@/lib/googleMaps";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import BackButton from "@/app/components/BackButton";
import { FormData as FormStructure } from "@/app/components/Listing/FormData";
import { chipFieldName, chipFieldValue } from "@/lib/listingChips";
import { postBusiData } from "@/app/API/method";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** API may return HTTP 200 with { status: 400, message, error } in body */
function getListingSaveFailure(payload) {
  if (!payload || typeof payload !== "object") return null;
  const candidates = [payload, payload.data].filter(
    (x) => x && typeof x === "object"
  );
  for (const obj of candidates) {
    const status = obj.status;
    if (typeof status === "number" && status >= 400) return obj;
    if (typeof status === "string") {
      const n = Number(status);
      if (!Number.isNaN(n) && n >= 400) return obj;
    }
    if (typeof obj.error === "string" && obj.error.trim()) return obj;
    if (obj.success === false) return obj;
  }
  return null;
}

function listingSaveErrorMessage(obj) {
  if (!obj) return "Submission failed.";
  if (typeof obj.error === "string" && obj.error.trim()) return obj.error.trim();
  if (typeof obj.message === "string" && obj.message.trim())
    return obj.message.trim();
  return "Submission failed.";
}

const toastOpts = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const Form = () => {
  const router = useRouter();
  const { slug, name } = useParams();
  const searchParams = useSearchParams();
  const endpoint = searchParams.get("endpoint");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const [commonFields, setCommonFields] = useState([]);
  const [specificFields, setSpecificFields] = useState([]);
  const [chips, setChips] = useState([]);
  const [selectedChips, setSelectedChips] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const autocompleteRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load form structure
  useEffect(() => {
    if (!slug || !name || !FormStructure[slug]) return;
    const category = FormStructure[slug];
    const subKey = Object.keys(category).find(
      (key) => key.toLowerCase() === String(name).toLowerCase()
    );
    if (!subKey) return;
    setCommonFields(category.commonFields || []);
    const subCategoryData = category[subKey] || {};
    setSpecificFields(subCategoryData.fields || []);

    const processedChips = (subCategoryData.chips || []).map((chipGroup) => ({
      ...chipGroup,
      required:
        chipGroup.label === "Condition" ||
        chipGroup.label === "condition" ||
        chipGroup.name === "condition",
    }));
    setChips(processedChips);
  }, [slug, name]);

  // Initialize Google Maps autocomplete (shared loader — one script per app)
  useEffect(() => {
    const locationField = document.getElementById("location");
    if (!locationField || autocompleteRef.current) return;

    let cancelled = false;

    function initializeAutocomplete() {
      if (cancelled || autocompleteRef.current) return;
      const input = document.getElementById("location");
      if (!input) return;

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        input,
        { types: ["geocode"], fields: ["formatted_address", "geometry"] }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          setCoordinates({
            type: "Point",
            coordinates: [
              place.geometry.location.lng(),
              place.geometry.location.lat(),
            ],
          });
          setFormErrors((prev) => ({ ...prev, location: "" }));
        }
      });
    }

    loadGoogleMaps().then(initializeAutocomplete);

    return () => {
      cancelled = true;
    };
  }, [commonFields]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const errors = {};
    if (!document.getElementById("location")?.value)
      errors.location = "Location is required";
    if (!imageFile) errors.images = "Image is required";

    chips.forEach((chipGroup) => {
      if (chipGroup.required && !selectedChips[chipGroup.label]) {
        errors[chipGroup.label] = `${chipGroup.label} is required`;
      }
    });

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("category", category);
      formPayload.append("subcategory", subcategory);

      if (coordinates) {
        formPayload.append("listing_coordinates", JSON.stringify(coordinates));
      }

      if (imageFile) {
        formPayload.append("pictures", imageFile);
      }

      [...commonFields, ...specificFields].forEach((field) => {
        const value = document.getElementById(field.name)?.value || "";
        formPayload.append(field.name, value);
      });

      chips.forEach((chipGroup) => {
        formPayload.append(
          chipFieldName(chipGroup),
          chipFieldValue(selectedChips[chipGroup.label] || "")
        );
      });

      // Backend expects exactly "True" or "False" (see validation: from_business)
      const fromBizRaw =
        searchParams.get("from_business") ??
        searchParams.get("fromBusiness") ??
        document.getElementById("from_business")?.value ??
        "";
      const fromBusiness =
        fromBizRaw === "True" ||
        fromBizRaw === "true" ||
        fromBizRaw === "1"
          ? "True"
          : "False";
      formPayload.set("from_business", fromBusiness);

      const payload = await postBusiData(
        `/listing/${endpoint}`,
        formPayload
      );

      const failure = getListingSaveFailure(payload);

      if (failure) {
        toast.error(listingSaveErrorMessage(failure), toastOpts);
      } else {
        const successMsg =
          (typeof payload?.message === "string" && payload.message.trim()) ||
          "Listing submitted successfully!";
        toast.success(successMsg, toastOpts);
        // Brief pause so the toast is visible before leaving the page
        setTimeout(() => {
          router.push("/pages/listing");
        }, 800);
      }
    } catch (error) {
      console.error("Submission error:", error);
      const d = error?.response?.data;
      const msg =
        (typeof d?.error === "string" && d.error.trim()) ||
        (typeof d?.message === "string" && d.message.trim()) ||
        error?.message ||
        "Submission failed. Please try again.";
      toast.error(msg, toastOpts);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChipSelection = (group, option) => {
    setSelectedChips((prev) => ({ ...prev, [group]: option }));
    if (formErrors[group]) {
      setFormErrors((prev) => ({ ...prev, [group]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormErrors((prev) => ({ ...prev, images: "" }));
    }
  };
  const renderField = (field) => (
    <div key={field.name} className="mb-4">
      <label htmlFor={field.name} className="block font-medium mb-1">
        {field.label}
        {(field.name === "location" || field.name === "image") && (
          <span className="text-red-500">*</span>
        )}
      </label>
      {field.type === "textarea" ? (
        <textarea id={field.name} className="w-full p-2 border rounded" />
      ) : field.type === "file" ? (
        <>
          <input
            type="file"
            id={field.name}
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          {formErrors.images && (
            <p className="text-red-500 text-sm mt-1">{formErrors.images}</p>
          )}
        </>
      ) : (
        <input
          type={field.type || "text"}
          id={field.name}
          className="w-full p-2 border rounded"
        />
      )}
      {field.name === "location" && formErrors.location && (
        <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
      )}
    </div>
  );

  const renderChipGroup = (chipGroup) => (
    <div key={chipGroup.label} className="mb-4">
      <h3 className="font-medium mb-2">
        {chipGroup.label}
        {chipGroup.required && <span className="text-red-500">*</span>}
      </h3>
      <div className="flex flex-wrap gap-2">
        {chipGroup.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleChipSelection(chipGroup.label, option)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedChips[chipGroup.label] === option
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {formErrors[chipGroup.label] && (
        <p className="text-red-500 text-sm mt-1">
          {formErrors[chipGroup.label]}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
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
      <BackButton />

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <h1 className="text-2xl font-bold mb-6">
          {slug && slug.charAt(0).toUpperCase() + slug.slice(1)} -
          {subcategory && subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
        </h1>

        {imagePreview && (
          <div className="mb-4 flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-60 rounded-md object-contain border"
            />
          </div>
        )}

        {commonFields.map(renderField)}
        {specificFields.map(renderField)}
        {chips.map(renderChipGroup)}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white font-medium rounded transition-colors ${
            isSubmitting ? "bg-[#D8B039]" : "bg-[#D8B039] hover:bg-[#dab852]"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
};

export default Form;

// "use client";
// import { useParams } from "next/navigation";
// import React, { useState, useEffect, useRef } from "react";
// import BackButton from "@/app/components/BackButton";
// import { FormData as FormStructure } from "@/app/components/Listing/FormData";
// import { postBusiData } from "@/app/API/method";

// const Form = () => {
//   const { slug, name } = useParams();
//   const [commonFields, setCommonFields] = useState([]);
//   const [specificFields, setSpecificFields] = useState([]);
//   const [chips, setChips] = useState([]);
//   const [selectedChips, setSelectedChips] = useState({});
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [coordinates, setCoordinates] = useState(null);
//   const [formErrors, setFormErrors] = useState({});
//   const autocompleteRef = useRef(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Load form structure
//   useEffect(() => {
//     if (slug && name && FormStructure[slug] && FormStructure[slug][name]) {
//       const category = FormStructure[slug];
//       setCommonFields(category.commonFields || []);
//       const subCategoryData = category[name] || {};
//       setSpecificFields(subCategoryData.fields || []);

//       // Mark required chips (like Condition)
//       const processedChips = (subCategoryData.chips || []).map(chipGroup => ({
//         ...chipGroup,
//         required: chipGroup.label === "Condition" // Mark Condition as required
//       }));
//       setChips(processedChips);
//     }
//   }, [slug, name]);

//   // Initialize Google Maps autocomplete
//   useEffect(() => {
//     const locationField = document.getElementById('location');
//     if (locationField && !autocompleteRef.current) {
//       if (!window.google) {
//         const script = document.createElement('script');
//         script.src = getGoogleMapsScriptUrl();
//         script.async = true;
//         script.defer = true;
//         script.onload = initializeAutocomplete;
//         document.head.appendChild(script);
//       } else {
//         initializeAutocomplete();
//       }
//     }

//     function initializeAutocomplete() {
//       autocompleteRef.current = new window.google.maps.places.Autocomplete(
//         document.getElementById('location'),
//         { types: ['geocode'], fields: ['formatted_address', 'geometry'] }
//       );

//       autocompleteRef.current.addListener('place_changed', () => {
//         const place = autocompleteRef.current.getPlace();
//         if (place.geometry) {
//           setCoordinates({
//             type: "Point",
//             coordinates: [place.geometry.location.lng(), place.geometry.location.lat()]
//           });
//           setFormErrors(prev => ({ ...prev, location: '' }));
//         }
//       });
//     }
//   }, [commonFields]);

//   const handleChipSelection = (group, option) => {
//     setSelectedChips(prev => ({ ...prev, [group]: option }));
//     if (formErrors[group]) {
//       setFormErrors(prev => ({ ...prev, [group]: '' }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//       setFormErrors(prev => ({ ...prev, images: '' }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate required fields
//     const errors = {};
//     if (!document.getElementById('location')?.value) errors.location = "Location is required";
//     if (!imageFile) errors.images = "Image is required";

//     // Validate required chips
//     chips.forEach(chipGroup => {
//       if (chipGroup.required && !selectedChips[chipGroup.label]) {
//         errors[chipGroup.label] = `${chipGroup.label} is required`;
//       }
//     });

//     setFormErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const formPayload = new FormData();
//       formPayload.append('category', slug);
//       formPayload.append('subcategory', name);

//       if (coordinates) {
//         formPayload.append('listing_coordinates', JSON.stringify(coordinates));
//       }

//       if (imageFile) {
//         formPayload.append('pictures', imageFile);
//       }

//       // Add all form fields
//       [...commonFields, ...specificFields].forEach(field => {
//         const value = document.getElementById(field.name)?.value || '';
//         formPayload.append(field.name, value);
//       });

//       // Add all chip selections
//       chips.forEach(chipGroup => {
//         formPayload.append(chipGroup.label, selectedChips[chipGroup.label] || '');
//       });

//       const response = await postBusiData(`/listing/${slug}`, formPayload);

//       if (response.success) {
//         alert('Listing submitted successfully!');
//         // Reset form if needed
//       } else {
//         throw new Error(response.message || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderField = (field) => (
//     <div key={field.name} className="mb-4">
//       <label htmlFor={field.name} className="block font-medium mb-1">
//         {field.label}
//         {(field.name === 'location' || field.name === 'image') && (
//           <span className="text-red-500">*</span>
//         )}
//       </label>
//       {field.type === 'textarea' ? (
//         <textarea
//           id={field.name}
//           className="w-full p-2 border rounded"
//         />
//       ) : field.type === 'file' ? (
//         <>
//           <input
//             type="file"
//             id={field.name}
//             onChange={handleImageChange}
//             className="w-full p-2 border rounded"
//             accept="image/*"
//           />
//           {formErrors.images && (
//             <p className="text-red-500 text-sm mt-1">{formErrors.images}</p>
//           )}
//         </>
//       ) : (
//         <input
//           type={field.type || 'text'}
//           id={field.name}
//           className="w-full p-2 border rounded"
//         />
//       )}
//       {field.name === 'location' && formErrors.location && (
//         <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
//       )}
//     </div>
//   );

//   const renderChipGroup = (chipGroup) => (
//     <div key={chipGroup.label} className="mb-4">
//       <h3 className="font-medium mb-2">
//         {chipGroup.label}
//         {chipGroup.required && <span className="text-red-500">*</span>}
//       </h3>
//       <div className="flex flex-wrap gap-2">
//         {chipGroup.options.map(option => (
//           <button
//             key={option}
//             type="button"
//             onClick={() => handleChipSelection(chipGroup.label, option)}
//             className={`px-3 py-1 rounded-full text-sm ${
//               selectedChips[chipGroup.label] === option
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-gray-200 hover:bg-gray-300'
//             }`}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//       {formErrors[chipGroup.label] && (
//         <p className="text-red-500 text-sm mt-1">{formErrors[chipGroup.label]}</p>
//       )}
//     </div>
//   );

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <BackButton />

//       <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
//         <h1 className="text-2xl font-bold mb-6">
//           {slug && slug.charAt(0).toUpperCase() + slug.slice(1)} -
//           {name && name.charAt(0).toUpperCase() + name.slice(1)}
//         </h1>

//         {imagePreview && (
//           <div className="mb-4 flex justify-center">
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="max-h-60 rounded-md object-contain border"
//             />
//           </div>
//         )}

//         {commonFields.map(renderField)}
//         {specificFields.map(renderField)}
//         {chips.map(renderChipGroup)}

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className={`w-full py-2 px-4 text-white font-medium rounded transition-colors ${
//             isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit Listing'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Form;
