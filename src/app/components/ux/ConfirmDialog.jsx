"use client";

import React from "react";
import AppModal from "./AppModal";

/**
 * Destructive / confirm dialog aligned with AppModal design language.
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
  return (
    <AppModal
      open={visible}
      onClose={onHide}
      title={title}
      description={message}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onConfirm={onConfirm}
      confirmLoading={confirmLoading}
      confirmVariant={confirmVariant}
      size="sm"
      hideClose={confirmLoading}
    />
  );
}
