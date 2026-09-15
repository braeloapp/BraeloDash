"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { getData, postData, updateData } from "@/app/API/method";
import AppLoader from "@/app/components/ux/AppLoader";

const defaultUserData = {
  name: "",
  first_name: "",
  last_name: "",
  dob: "",
  gender: "",
  address: "",
  complement: "",
  country: "",
  state: "",
  city: "",
  zip_code: "",
  phoneNumber: "",
  email: "",
  bio: "",
  image: "/report.png",
};

const AdminCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultUserData);
  const [previewImage, setPreviewImage] = useState(defaultUserData.image);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getData("/auth/user/profile");

        if (response) {
          const userData = {
            name: response?.data?.name || "",
            first_name: response?.data?.first_name || "",
            last_name: response?.data?.last_name || "",
            dob: response?.data?.dob || "",
            gender: response?.data?.gender || "",
            address: response?.data?.address || "",
            country: response?.data?.country || "",
            state: response?.data?.state || "",
            city: response?.data?.city || "",
            zip_code: response?.data?.zip_code || "",
            phoneNumber: response?.data?.phone_number || "",
            email: response?.data?.email || "",
            bio: response?.data?.bio || "",
            image: response?.data?.image || "/report.png",
          };
          setFormData(userData);
          setPreviewImage(userData.image);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare update payload
      const updatePayload = {
        ...formData,
        ...(password && { password }),
        ...(previewImage !== "/report.png" && { image: formData.image }),
      };

      // Use postData for creating or updateData for updating
      const response = await postData("/auth/update/profile", updatePayload);

      if (response) {
        // Update local state with the response
        const updatedData = {
          ...formData,
          name: response.name || formData.name,
          first_name: response.first_name || formData.first_name,
          last_name: response.last_name || formData.last_name,
          // Include all other fields similarly
          image: response.image || previewImage,
        };
        setFormData(updatedData);
        setPreviewImage(updatedData.image);
        closeModal();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update profile"
      );
      console.error("Error updating profile:", err);
    }
  };

  if (isLoading) {
    return <AppLoader label="Loading profile data..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
          <h3 className="text-xl text-red-500 mb-4">Error Loading Profile</h3>
          <p className="text-[#78828A] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-4 sm:py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-[#EEF1F4] bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-xl text-[#78828A] font-semibold mb-6">
          Personal Information
        </h2>

        {/* Profile Header */}
        <div className="flex items-center mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
            <Image
              src={previewImage}
              alt="User Profile"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#78828A]">
              {formData.name} {formData.last_name}
            </h3>
            <p className="text-[#78828A] text-sm">{formData.email}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-[#78828A] font-medium">{formData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="text-[#78828A] font-medium">{formData.first_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="text-[#78828A] font-medium">{formData.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="text-[#78828A] font-medium">
              {formData.dob || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-[#78828A] font-medium">
              {formData.gender || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="text-[#78828A] font-medium">
              {formData.phoneNumber || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="text-[#78828A] font-medium">{formData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-[#78828A] font-medium">
              {formData.address || "Not provided"}
            </p>
          </div>
          {/* <div>
            <p className="text-sm text-gray-500">Complement</p>
            <p className="text-[#78828A] font-medium">{formData.complement || "Not provided"}</p>
          </div> */}
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="text-[#78828A] font-medium">
              {formData.country || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <p className="text-[#78828A] font-medium">
              {formData.state || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">City</p>
            <p className="text-[#78828A] font-medium">
              {formData.city || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Zip Code</p>
            <p className="text-[#78828A] font-medium">
              {formData.zip_code || "Not provided"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Bio</p>
            <p className="text-[#78828A] font-medium">
              {formData.bio || "No bio provided"}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={openModal}
          className="btn-primary w-full"
        >
          Edit Profile
        </button>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#78828A] mb-6">
                  Update Name
                </h3>

                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p>{error}</p>
                  </div>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const response = await postData("/auth/update/profile", {
                        name: formData.name,
                      });

                      if (response) {
                        setFormData((prev) => ({
                          ...prev,
                          name: response.name || prev.name,
                        }));
                        closeModal();
                      }
                    } catch (err) {
                      setError(
                        err.response?.data?.message ||
                          err.message ||
                          "Failed to update name"
                      );
                      console.error("Error updating name:", err);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#CD9403] focus:border-[#CD9403]"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCard;
