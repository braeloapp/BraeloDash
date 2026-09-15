"use client";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { postData } from "@/app/API/method";

const EditUserdetailModal = ({ isOpen, onClose, userData }) => {
  const [formData, setFormData] = React.useState({
    user_id: userData?.id || "",
    name: userData?.name || "",
    email: userData?.email || "",
    role: userData?.role === 'admin' || userData?.role === true ? 'Admin' : 'User',
    phone_number: userData?.phone_number || "",
    is_email_verified: userData?.is_email_verified || false,
    is_phone_verified: userData?.is_phone_verified || false,
    is_active: userData?.is_active || false
  });

  React.useEffect(() => {
    if (userData) {
      setFormData({
        user_id: userData?.id || "",
        name: userData?.name || "",
        email: userData?.email || "",
        role: userData?.role === 'admin' || userData?.role === true ? 'Admin' : 'User',
        phone_number: userData?.phone_number || "",
        is_email_verified: userData?.is_email_verified || false,
        is_phone_verified: userData?.is_phone_verified || false,
        is_active: userData?.is_active || false
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_id: formData.user_id,
        name: formData.name,
        phone_number: formData.phone_number,
        is_active: formData.is_active,
        is_email_verified: formData.is_email_verified,
        is_phone_verified: formData.is_phone_verified,
        role: formData.role.toLowerCase()
      };

      if (formData.email !== userData?.email) {
        payload.email = formData.email;
      }

      // Use postData method for API call
      const response = await postData(
        "/admin-panel/user/update",
        payload,
        localStorage.getItem("token")
      );

      if (response.success) {
        toast.success("User updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: {
            background: "green",
            color: "white"
          }
        });
        onClose();
      } else {
        toast.error(response.message || "Failed to update user", {
          theme: "colored"
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "An error occurred while updating user", {
        theme: "colored"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="m-4 p-5 bg-white shadow-lg rounded-md w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#232F30] text-[20px] font-bold">
            Edit Info
          </h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="user_id" value={formData.user_id} />

          <div className="flex justify-between mb-4 gap-2">
            <div className="flex-1">
              <label className="block text-[#78828A] text-[16px] font-[600] mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-[#78828A] text-[16px] font-[600] mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                disabled={true}
                title="Email cannot be changed"
              />
            </div>
          </div>
          <div className="flex justify-between mb-4 gap-2">
            <div className="flex-1">
              <label className="block text-[#78828A] text-[16px] font-[600] mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[#78828A] text-[16px] font-[600] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Verification checkboxes */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="is_email_verified"
              name="is_email_verified"
              checked={formData.is_email_verified}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="is_email_verified" className="text-[#78828A] text-[16px] font-[600]">
              Email Verified
            </label>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="is_phone_verified"
              name="is_phone_verified"
              checked={formData.is_phone_verified}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="is_phone_verified" className="text-[#78828A] text-[16px] font-[600]">
              Phone Verified
            </label>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-[#78828A] text-[16px] font-[600]">
              Active Account
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="btn-primary"
            >
              Save
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserdetailModal;