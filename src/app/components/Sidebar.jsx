"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { sidebarGroups, sidebarItems } from "./navItems";

function isItemActive(pathname, path) {
  if (!pathname || !path) return false;
  if (pathname === path) return true;
  // Avoid /pages/users matching /pages/users/... incorrectly for siblings —
  // still allow nested routes under the same section.
  return pathname.startsWith(`${path}/`) || pathname.startsWith(`${path}?`);
}

const Sidebar = ({ open = false, onClose }) => {
  const pathname = usePathname();

  const grouped = useMemo(() => {
    return sidebarGroups
      .map((group) => ({
        group,
        items: sidebarItems.filter((item) => item.group === group),
      }))
      .filter((section) => section.items.length > 0);
  }, []);

  return (
    <aside
      className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex h-dvh w-[272px] flex-col overflow-hidden border-r border-white/5 bg-[#2f363c] transition-transform duration-300 md:translate-x-0 ${
        open ? "translate-x-0" : "max-md:-translate-x-full"
      }`}
      aria-label="Admin navigation"
    >
      {/* Brand header */}
      <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#FFCC35] via-[#F0B429] to-[#CD9403] px-5 py-4">
        <div
          className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-center justify-center">
          <Image
            src="/black logo.png"
            alt="Braelo"
            width={168}
            height={42}
            className="h-auto w-[142px] object-contain drop-shadow-sm"
            priority
          />
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-[#2f363c] transition hover:bg-black/10 md:hidden"
            aria-label="Close menu"
          >
            <FiX size={18} />
          </button>
        ) : null}
      </div>

      {/* Nav */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <nav className="flex flex-col gap-5 pb-6">
          {grouped.map((section) => (
            <div key={section.group}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                {section.group}
              </p>
              <ul className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const active = isItemActive(pathname, item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        href={item.to}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-2.5 py-2.5 text-sm transition-all duration-150 ${
                          active
                            ? "bg-gradient-to-r from-[#D8B039] to-[#CD9403] font-semibold text-white shadow-[0_10px_24px_rgba(205,148,3,0.28)]"
                            : "font-medium text-white/75 hover:bg-white/[0.07] hover:text-white"
                        }`}
                      >
                        {active ? (
                          <span
                            className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-white/90"
                            aria-hidden
                          />
                        ) : null}
                        <span
                          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                            active
                              ? "bg-white/20"
                              : "bg-white/[0.06] group-hover:bg-white/10"
                          }`}
                        >
                          <Image
                            src={item.icon}
                            alt=""
                            width={18}
                            height={18}
                            className="h-[18px] w-[18px] object-contain brightness-0 invert opacity-95"
                          />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/8 px-4 py-3">
        <div className="rounded-xl bg-white/[0.04] px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D8B039]">
            Braelo Admin
          </p>
          <p className="mt-0.5 text-[11px] text-white/40">Power console</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
