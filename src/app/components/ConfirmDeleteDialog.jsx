"use client";

import React from "react";
import ConfirmDialog from "./ux/ConfirmDialog";

/**
 * Shared delete/destructive confirmation — branded ConfirmDialog wrapper.
 * Kept for existing imports across the admin panel.
 */
export default function ConfirmDeleteDialog(props) {
  return <ConfirmDialog confirmVariant="danger" {...props} />;
}
