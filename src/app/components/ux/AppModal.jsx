"use client";

import React, { useEffect } from "react";
import Button from "./Button";

/**
 * Shared branded modal overlay used across the admin panel.
 */
export default function AppModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  confirmLoading = false,
  confirmVariant = "primary",
  size = "md",
  hideClose = false,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape" && !confirmLoading) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, confirmLoading]);

  if (!open) return null;

  const maxWidth =
    size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-md" : "max-w-lg";

  const defaultFooter =
    onConfirm || cancelLabel ? (
      <>
        <Button variant="ghost" onClick={onClose} disabled={confirmLoading}>
          {cancelLabel}
        </Button>
        {onConfirm ? (
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={confirmLoading}
          >
            {confirmLabel || "Confirm"}
          </Button>
        ) : null}
      </>
    ) : null;

  return (
    <div
      className="app-modal-mask"
      role="presentation"
      onClick={() => {
        if (!confirmLoading) onClose?.();
      }}
    >
      <div
        className={`app-modal ${maxWidth}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "app-modal-title" : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || !hideClose) && (
          <div className="app-modal-header">
            <div className="min-w-0">
              {title ? (
                <h2 id="app-modal-title" className="section-title">
                  {title}
                </h2>
              ) : null}
              {description ? <p className="page-desc">{description}</p> : null}
            </div>
            {!hideClose ? (
              <Button
                variant="icon"
                aria-label="Close"
                onClick={onClose}
                disabled={confirmLoading}
                className="shrink-0"
              >
                ✕
              </Button>
            ) : null}
          </div>
        )}
        <div className="app-modal-body">{children}</div>
        {(footer ?? defaultFooter) ? (
          <div className="app-modal-footer">{footer ?? defaultFooter}</div>
        ) : null}
      </div>
    </div>
  );
}
