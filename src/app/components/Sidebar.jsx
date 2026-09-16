"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiBell,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
  FiUser,
  FiX,
} from "react-icons/fi";
import { getApiBaseUrl } from "@/lib/apiConfig";
import {
  adminRoleLabel,
  clearAdminSession,
  persistAdminSession,
} from "@/lib/adminAuth";
import { getData } from "@/app/API/method";
import {
  isNotificationUnread,
  NOTIFICATIONS_CHANGED,
} from "@/lib/adminNotifications";
import { sidebarGroups, sidebarItems } from "./navItems";

const COLLAPSE_KEY = "braelo_admin_sidebar_collapsed";

function isItemActive(pathname, path) {
  if (!pathname || !path) return false;
  if (pathname === path) return true;
  return pathname.startsWith(`${path}/`) || pathname.startsWith(`${path}?`);
}

function loadCollapsed() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COLLAPSE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const Sidebar = ({ open = false, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState({});
  const [accountOpen, setAccountOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [roleLabel, setRoleLabel] = useState("Administrator");
  const [unreadCount, setUnreadCount] = useState(0);
  const accountRef = useRef(null);

  const grouped = useMemo(() => {
    return sidebarGroups
      .map((group) => ({
        group,
        items: sidebarItems.filter((item) => item.group === group),
      }))
      .filter((section) => section.items.length > 0);
  }, []);

  useEffect(() => {
    setCollapsed(loadCollapsed());
  }, []);

  useEffect(() => {
    const activeGroup = sidebarItems.find((item) =>
      isItemActive(pathname, item.to)
    )?.group;
    if (!activeGroup) return;
    setCollapsed((prev) => {
      if (!prev[activeGroup]) return prev;
      const next = { ...prev, [activeGroup]: false };
      try {
        window.localStorage.setItem(COLLAPSE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [pathname]);

  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const cachedName = localStorage.getItem("admin_name");
      const cachedRole = localStorage.getItem("admin_role");
      if (cachedName) setUserName(cachedName);
      if (cachedRole) setRoleLabel(adminRoleLabel(cachedRole));

      try {
        const response = await fetch(`${getApiBaseUrl()}/admin-panel/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) return;
        const data = await response.json();
        const profile = data?.data || data;
        setUserName(profile?.name || "Admin");
        setRoleLabel(adminRoleLabel(profile?.role));
        persistAdminSession({
          token,
          role: profile?.role,
          name: profile?.name,
        });
      } catch {
        /* keep cached */
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const data = await getData("/admin-panel/notifications?page=1");
        const results = data?.data?.results || [];
        setUnreadCount(
          results.filter((item) => isNotificationUnread(item)).length
        );
      } catch {
        setUnreadCount(0);
      }
    };

    loadUnread();
    window.addEventListener(NOTIFICATIONS_CHANGED, loadUnread);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGED, loadUnread);
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const toggleGroup = (group) => {
    setCollapsed((prev) => {
      const next = { ...prev, [group]: !prev[group] };
      try {
        window.localStorage.setItem(COLLAPSE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const goTo = (path) => {
    setAccountOpen(false);
    onClose?.();
    router.push(path);
  };

  const handleLogout = () => {
    setAccountOpen(false);
    clearAdminSession();
    router.push("/");
  };

  const initial = (userName || "A").trim().charAt(0).toUpperCase();

  return (
    <aside
      className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex h-dvh w-[280px] flex-col overflow-hidden border-r border-white/[0.06] transition-transform duration-300 md:translate-x-0 ${
        open ? "translate-x-0" : "max-md:-translate-x-full"
      }`}
      aria-label="Admin navigation"
    >
      <div className="admin-sidebar__aurora" aria-hidden />
      <div className="admin-sidebar__noise" aria-hidden />

      {/* Brand header */}
      <div className="admin-sidebar-brand relative shrink-0 overflow-hidden px-5 py-5">
        <div className="admin-sidebar-brand__glow" aria-hidden />
        <div className="admin-sidebar-brand__shine" aria-hidden />
        <div className="admin-sidebar-brand__orb admin-sidebar-brand__orb--a" aria-hidden />
        <div className="admin-sidebar-brand__orb admin-sidebar-brand__orb--b" aria-hidden />
        <div className="relative z-[1] flex items-center justify-center">
          <Image
            src="/braelo-logo.png?v=2"
            alt="braelo"
            width={200}
            height={56}
            className="h-10 w-auto object-contain drop-shadow-[0_6px_16px_rgba(80,40,0,0.28)]"
            priority
          />
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1/2 z-[2] inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/15 text-[#2a2208] transition hover:bg-black/25 md:hidden"
            aria-label="Close menu"
          >
            <FiX size={18} />
          </button>
        ) : null}
      </div>

      <div className="admin-sidebar__seam" aria-hidden />

      {/* Nav */}
      <div className="relative z-[1] min-h-0 flex-1 overflow-y-auto px-3.5 py-4">
        <nav className="flex flex-col gap-3 pb-8">
          {grouped.map((section) => {
            const isCollapsed = Boolean(collapsed[section.group]);
            const hasActive = section.items.some((item) =>
              isItemActive(pathname, item.to)
            );
            const panelId = `sidebar-panel-${section.group}`;

            return (
              <div
                key={section.group}
                className={`admin-sidebar-section ${
                  hasActive ? "admin-sidebar-section--active" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleGroup(section.group)}
                  aria-expanded={!isCollapsed}
                  aria-controls={panelId}
                  className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/[0.05]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition ${
                        hasActive
                          ? "bg-[#FFCC35] shadow-[0_0_10px_rgba(255,204,53,0.8)]"
                          : "bg-white/25 group-hover:bg-[#D8B039]/70"
                      }`}
                      aria-hidden
                    />
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                        hasActive
                          ? "text-[#FFCC35]/90"
                          : "text-white/38 group-hover:text-white/58"
                      }`}
                    >
                      {section.group}
                    </span>
                  </span>
                  <FiChevronDown
                    size={14}
                    className={`shrink-0 transition-all duration-200 ${
                      hasActive
                        ? "text-[#FFCC35]/80"
                        : "text-white/30 group-hover:text-white/50"
                    } ${isCollapsed ? "-rotate-90" : "rotate-0"}`}
                    aria-hidden
                  />
                </button>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="mt-1 flex flex-col gap-1.5 pb-1.5">
                      {section.items.map((item) => {
                        const active = isItemActive(pathname, item.to);
                        return (
                          <li key={item.to}>
                            <Link
                              href={item.to}
                              onClick={onClose}
                              aria-current={active ? "page" : undefined}
                              className={`admin-sidebar-link group relative flex items-center gap-3 overflow-hidden rounded-2xl px-2.5 py-2.5 text-sm transition-all duration-200 ${
                                active
                                  ? "admin-sidebar-link--active font-semibold"
                                  : "font-medium"
                              }`}
                            >
                              {active ? (
                                <span
                                  className="admin-sidebar-link__pulse absolute inset-0"
                                  aria-hidden
                                />
                              ) : (
                                <span
                                  className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                  style={{
                                    background:
                                      "linear-gradient(90deg, rgba(255,204,53,0.08), rgba(255,255,255,0.04) 55%, transparent)",
                                  }}
                                  aria-hidden
                                />
                              )}
                              <span
                                className={`relative z-[1] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                                  active
                                    ? "bg-white/20 shadow-inner"
                                    : "bg-white/[0.05] ring-1 ring-white/[0.06] group-hover:bg-[#CD9403]/20 group-hover:ring-[#FFCC35]/20"
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
                              <span className="admin-sidebar-link__label relative z-[1] truncate tracking-[-0.01em]">
                                {item.label}
                              </span>
                              {active ? (
                                <span
                                  className="relative z-[1] ml-auto h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                  aria-hidden
                                />
                              ) : null}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Account footer dropdown */}
      <div className="relative z-[2] shrink-0 px-3.5 pb-4 pt-1" ref={accountRef}>
        {accountOpen ? (
          <div
            className="admin-account-menu mb-2 overflow-hidden rounded-2xl"
            role="menu"
            aria-label="Account menu"
          >
            <div className="border-b border-white/10 px-3.5 py-3">
              <p className="truncate text-sm font-semibold text-white">
                {userName}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#FFCC35]/90">
                {roleLabel}
              </p>
            </div>

            <button
              type="button"
              role="menuitem"
              className="admin-account-menu__item"
              onClick={() => goTo("/pages/adminprofile")}
            >
              <FiUser size={16} />
              <span>Profile settings</span>
            </button>

            <button
              type="button"
              role="menuitem"
              className="admin-account-menu__item"
              onClick={() => goTo("/pages/notifications")}
            >
              <FiBell size={16} />
              <span className="flex-1 text-left">Notifications</span>
              {unreadCount > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#CD9403] px-1.5 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            <div className="mx-3 border-t border-white/10" />

            <button
              type="button"
              role="menuitem"
              className="admin-account-menu__item admin-account-menu__item--danger"
              onClick={handleLogout}
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : null}

        <button
          type="button"
          className={`admin-sidebar-footer group relative w-full overflow-hidden rounded-2xl px-3 py-2.5 text-left transition ${
            accountOpen ? "ring-1 ring-[#FFCC35]/40" : ""
          }`}
          aria-expanded={accountOpen}
          aria-haspopup="menu"
          onClick={() => setAccountOpen((prev) => !prev)}
        >
          <div className="admin-sidebar-footer__glow" aria-hidden />
          <div className="relative z-[1] flex items-center gap-3">
            <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#FFCC35]/55">
              <Image
                src="/images/profile (1).png"
                alt=""
                fill
                className="object-cover"
              />
              <span className="sr-only">{initial}</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {userName}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#FFCC35]/90">
                {roleLabel}
              </p>
            </div>
            <span className="relative inline-flex items-center gap-1.5">
              {unreadCount > 0 && !accountOpen ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#CD9403] px-1 text-[10px] font-semibold text-white shadow-[0_0_10px_rgba(205,148,3,0.55)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
              {accountOpen ? (
                <FiChevronUp size={16} className="text-white/70" />
              ) : (
                <FiChevronDown size={16} className="text-white/55 group-hover:text-white/80" />
              )}
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
