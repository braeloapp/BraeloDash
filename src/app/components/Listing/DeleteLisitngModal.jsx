import React from "react";

const DeleteListingModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <p>Are you sure you want to delete this listing?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListingModal;
