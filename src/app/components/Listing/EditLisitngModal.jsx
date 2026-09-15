"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const EditListingModal = ({ isOpen, onClose, card }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title,
        description: card.description,
        price: card.price,
        image: card.image, // Set initial image URL
      });
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        image: imageUrl, // Set image to the new URL
      }));
    }
  };

  const handleSave = () => {
    // Implement your save logic here (e.g., API call to save changes)
    console.log("Updated Listing Data:", formData);
    onClose(); // Close the modal after saving
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white p-5 rounded-lg shadow-lg relative scroll">
        {/* Close Icon */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Listing</h2>
        <Image
          src={formData.image} // Dynamic image source from formData
          alt={formData.title} // Alt text using formData.title
          width={100} // Set a width for the image
          height={100} // Set a height for the image
          className="w-full h-40 object-cover mb-4" // Tailwind CSS classes for styling
        />

        <div className="mt-4">
          <label className="block mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2" htmlFor="image">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-4">
          <button
            className="btn-primary"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="ml-2 btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditListingModal;
