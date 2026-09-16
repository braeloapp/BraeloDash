"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import Button from "./Button";

/**
 * Premium confirm / destructive dialog used across the admin panel.
 * Portaled to document.body so page-shell overflow cannot clip the mask.
 */
export default function ConfirmDialog({
  visible,
  onHide,
  onConfirm,
  title,
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmLoading = false,
  confirmVariant = "danger",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape" && !confirmLoading) onHide?.();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [visible, onHide, confirmLoading]);

  if (!visible || !mounted) return null;

  const isDanger = confirmVariant === "danger";

  return createPortal(
    <div
      className="confirm-modal-mask"
      role="presentation"
      onClick={() => {
        if (!confirmLoading) onHide?.();
      }}
    >
      <div
        className={`confirm-modal ${isDanger ? "confirm-modal--danger" : "confirm-modal--brand"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="confirm-modal-close"
          aria-label="Close"
          disabled={confirmLoading}
          onClick={onHide}
        >
          <FiX size={16} />
        </button>

        <div
          className={`confirm-modal-icon ${
            isDanger ? "confirm-modal-icon--danger" : "confirm-modal-icon--brand"
          }`}
          aria-hidden
        >
          <FiAlertTriangle size={26} />
        </div>

        <h2 id="confirm-modal-title" className="confirm-modal-title">
          {title}
        </h2>
        <p id="confirm-modal-message" className="confirm-modal-message">
          {message}
        </p>

        <div className="confirm-modal-actions">
          <Button
            variant="ghost"
            onClick={onHide}
            disabled={confirmLoading}
            className="confirm-modal-cancel"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={confirmLoading}
            className="confirm-modal-confirm"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
