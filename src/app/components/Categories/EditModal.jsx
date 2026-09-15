"use client";

import React, { useState } from "react";
import Image from "next/image";

const EditModal = ({
  isOpen,
  onClose,
  subcategory,
  onSubmit,
  isSubcategoryModal,
}) => {
  // Define useState outside the conditional block
  const [formData, setFormData] = useState(subcategory);
  const [selectedImage, setSelectedImage] = useState(null);

  // Conditionally return null if the modal is not open
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      image: selectedImage
        ? URL.createObjectURL(selectedImage)
        : formData.image,
    };
    onSubmit(updatedData); // Submit updated data
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-lg w-full p-2"
            />
          </div>

          {/* Image Upload Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="image">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-lg w-full p-2"
            />
            {formData.image && (
              <Image
                src={formData.image}
                alt="Current Image"
                width={50}
                height={50}
              />
            )}
          </div>

          {/* Status Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded-lg w-full p-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Date Created (Non-Editable) */}
          {isSubcategoryModal && (
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="dateCreated"
              >
                Date Created
              </label>
              <input
                type="text"
                id="dateCreated"
                name="dateCreated"
                value={formData.Datecreated}
                className="border rounded-lg w-full p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
