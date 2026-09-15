import React from "react";

const DeleteListingModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="app-modal-mask">
      <div className="app-modal max-w-md">
        <div className="app-modal-header">
          <h2 className="text-lg font-semibold text-[#3a4248]">Delete listing</h2>
        </div>
        <div className="app-modal-body">
          <p className="text-sm text-[#78828A]">
            Are you sure you want to delete this listing? This action cannot be
            undone.
          </p>
        </div>
        <div className="app-modal-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListingModal;
