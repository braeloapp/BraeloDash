"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { sidebarItems } from "./navItems";

const Sidebar = ({ open = false, onClose }) => {
  const pathname = usePathname();

  const getTabClass = (path) => {
    const isActive = pathname.startsWith(path);
    return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
      isActive
        ? "bg-[#D8B039] text-white shadow-sm"
        : "text-white/90 hover:bg-white/10"
    }`;
  };

  return (
    <aside
      className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex h-dvh w-[272px] flex-col bg-[#3a4248] transition-transform duration-300 md:translate-x-0 ${
        open ? "translate-x-0" : "max-md:-translate-x-full"
      }`}
      aria-label="Admin"
    >
      <div className="relative flex h-[76px] shrink-0 items-center justify-center bg-[#FFCC35] px-6">
        <Image
          src="/black logo.png"
          alt="Braelo"
          width={168}
          height={42}
          className="h-auto w-[150px] object-contain"
          priority
        />
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#3a4248] md:hidden"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
          Platform
        </p>
        <nav className="flex flex-col gap-1 pb-8">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.to}
              className={getTabClass(item.to)}
              aria-current={pathname.startsWith(item.to) ? "page" : undefined}
              onClick={onClose}
            >
              <Image
                src={item.icon}
                alt=""
                width={22}
                height={22}
                className="h-[22px] w-[22px] object-contain"
              />
              <span className="truncate font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
