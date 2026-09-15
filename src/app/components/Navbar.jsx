"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiMenu, FiSettings } from "react-icons/fi";
import { getApiBaseUrl } from "@/lib/apiConfig";
import { adminRoleLabel, clearAdminSession, persistAdminSession } from "@/lib/adminAuth";
import { getData } from "@/app/API/method";
import { isNotificationUnread, NOTIFICATIONS_CHANGED } from "@/lib/adminNotifications";
import { sidebarItems } from "./navItems";

const NavBar = ({ onMenuClick }) => {
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userName, setUserName] = useState("");
  const [roleLabel, setRoleLabel] = useState("Administrator");
  const [unreadCount, setUnreadCount] = useState(0);
  const settingsDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        clearAdminSession();
        router.replace("/");
        return;
      }

      try {
        const response = await fetch(`${getApiBaseUrl()}/admin-panel/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          clearAdminSession();
          setUserName("Admin");
          router.replace("/");
          return;
        }

        if (!response.ok) {
          setUserName("Admin");
          return;
        }

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
        setUserName("Admin");
      }
    };

    fetchUserName();
  }, [router]);

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const data = await getData("/admin-panel/notifications?page=1");
        const results = data?.data?.results || [];
        setUnreadCount(results.filter((item) => isNotificationUnread(item)).length);
      } catch {
        setUnreadCount(0);
      }
    };

    loadUnread();
    window.addEventListener(NOTIFICATIONS_CHANGED, loadUnread);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGED, loadUnread);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredItems = sidebarItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filteredItems);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchNavigation = (item) => {
    router.push(item.to);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() && searchSuggestions.length > 0) {
      handleSearchNavigation(searchSuggestions[0]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target) &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSettingsDropdownOpen(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <div className="flex items-center gap-3 px-3 py-3 sm:px-5 sm:py-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="btn-icon md:hidden"
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>

        <div className="relative min-w-0 flex-1 md:max-w-md lg:max-w-xl" ref={searchContainerRef}>
          <div className="flex items-center rounded-full border border-[var(--color-border)] bg-brand-canvas px-3 py-2.5 transition focus-within:border-[#f0e2b3] focus-within:shadow-focus">
            <Image
              src="/images/Seacrh.png"
              alt=""
              width={18}
              height={18}
              className="mr-2 shrink-0 opacity-70"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className="w-full min-w-0 bg-transparent text-sm text-brand-ink placeholder:text-brand-faint focus:outline-none focus:ring-0 focus:shadow-none"
              placeholder="Search menu..."
              aria-label="Search menu items"
            />
          </div>

          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="menu-panel absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-y-auto">
              {searchSuggestions.map((item) => (
                <button
                  type="button"
                  key={item.to}
                  className="menu-item flex items-center gap-3"
                  onClick={() => handleSearchNavigation(item)}
                >
                  <div className="relative h-6 w-6 shrink-0">
                    <Image src={item.icon} alt="" fill className="object-contain" />
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative" ref={settingsDropdownRef}>
            <button
              type="button"
              className="btn-icon"
              onClick={() => setSettingsDropdownOpen((prev) => !prev)}
              aria-label="Settings"
            >
              <FiSettings size={20} />
            </button>
            {settingsDropdownOpen && (
              <div className="menu-panel absolute right-0 z-50 mt-2 w-48">
                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    router.push("/pages/adminprofile");
                    setSettingsDropdownOpen(false);
                  }}
                >
                  Profile Setting
                </button>
                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    clearAdminSession();
                    router.push("/");
                    setSettingsDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cream transition hover:bg-brand-bright/40"
            onClick={() => router.push("/pages/notifications")}
            aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
          >
            <Image src="/images/notification.png" alt="" width={20} height={20} />
            {unreadCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </button>

          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-brand-canvas ring-1 ring-[var(--color-border)]">
              <Image src="/images/profile (1).png" fill alt="" className="object-cover" />
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-sm font-semibold text-brand-ink">{userName}</p>
              <p className="truncate text-[11px] font-medium text-brand-muted">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
