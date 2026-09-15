"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiMoreHorizontal } from "react-icons/fi";

export default function ActionMenu({ items = [], disabled = false, label = "Actions" }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    const node = buttonRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const menuWidth = 176;
    const estimatedHeight = items.length * 40 + 12;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow < estimatedHeight + 12
        ? Math.max(12, rect.top - estimatedHeight - 8)
        : rect.bottom + 8;
    const left = Math.min(
      Math.max(12, rect.right - menuWidth),
      window.innerWidth - menuWidth - 12
    );
    setCoords({ top, left });
  };

  const toggle = () => {
    if (disabled) return;
    setOpen((prev) => {
      const next = !prev;
      if (next) updatePosition();
      return next;
    });
  };

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (buttonRef.current?.contains(event.target)) return;
      if (menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  return (
    <div className="flex justify-end">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#F0E2B3] bg-[#FFF8E8] text-[#CD9403] transition hover:bg-[#FFCC35] hover:text-[#3a4248] disabled:opacity-50"
      >
        <FiMoreHorizontal size={18} />
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              className="menu-panel fixed z-[100] w-44 py-1"
              style={{ top: coords.top, left: coords.left }}
            >
              {items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  className={`menu-item ${item.danger ? "text-[#C7233F] hover:bg-red-50 hover:text-[#C7233F]" : ""}`}
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
