"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

/**
 * Premium edit-listing overlay. Portaled to body so page-shell overflow
 * cannot clip the dimmed backdrop.
 */
export default function ListingEditShell({
  open,
  title,
  onClose,
  children,
  disabled = false,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape" && !disabled) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, disabled]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="listing-edit-mask"
      role="presentation"
      onClick={() => {
        if (!disabled) onClose?.();
      }}
    >
      <div
        className="listing-edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-edit-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="listing-edit-header">
          <div>
            <p className="listing-edit-kicker">Edit listing</p>
            <h2 id="listing-edit-title" className="listing-edit-title">
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="listing-edit-close"
            aria-label="Close"
            disabled={disabled}
            onClick={onClose}
          >
            <FiX size={16} />
          </button>
        </header>
        <div className="listing-edit-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
