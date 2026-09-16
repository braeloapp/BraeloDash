"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

function classIncludes(className, token) {
  if (!className) return false;
  if (typeof className === "string") {
    return className.split(/\s+/).includes(token);
  }
  return false;
}

/**
 * Move `.listing-edit-footer` out of the scroll body so Cancel / Save sit
 * flush on the modal bottom (no sticky gap / field overlap).
 */
function splitListingEditContent(children, formId) {
  const items = React.Children.toArray(children);

  // Direct children: body bits + `.listing-edit-footer` sibling (e.g. support reply)
  if (items.length > 1) {
    const footerIndex = items.findIndex(
      (child) =>
        React.isValidElement(child) &&
        classIncludes(child.props.className, "listing-edit-footer")
    );
    if (footerIndex >= 0) {
      return {
        body: items.filter((_, index) => index !== footerIndex),
        footer: items[footerIndex],
      };
    }
  }

  if (items.length !== 1 || !React.isValidElement(items[0])) {
    return { body: children, footer: null };
  }

  const root = items[0];
  const kids = React.Children.toArray(root.props.children);
  const footerIndex = kids.findIndex(
    (child) =>
      React.isValidElement(child) &&
      classIncludes(child.props.className, "listing-edit-footer")
  );

  if (footerIndex < 0) {
    return { body: children, footer: null };
  }

  const footerNode = kids[footerIndex];
  const bodyKids = kids.filter((_, index) => index !== footerIndex);
  const resolvedFormId = root.props.id || formId;

  const body = React.cloneElement(
    root,
    {
      ...root.props,
      id: resolvedFormId,
    },
    bodyKids
  );

  const footer = React.cloneElement(
    footerNode,
    footerNode.props,
    React.Children.map(footerNode.props.children, (child) => {
      if (!React.isValidElement(child)) return child;
      if (child.props.type !== "submit") return child;
      return React.cloneElement(child, {
        form: resolvedFormId,
      });
    })
  );

  return { body, footer };
}

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
  const reactId = useId();
  const formId = `listing-edit-form-${reactId.replace(/:/g, "")}`;

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

  const { body, footer } = useMemo(
    () => splitListingEditContent(children, formId),
    [children, formId]
  );

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
        <div className="listing-edit-body">{body}</div>
        {footer}
      </div>
    </div>,
    document.body
  );
}
