"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiSettings } from "react-icons/fi";
import { getApiBaseUrl } from "@/lib/apiConfig";
import { adminRoleLabel, clearAdminSession, persistAdminSession } from "@/lib/adminAuth";

const sidebarItems = [
  { to: "/pages/dashboard", icon: "/a1.png", label: "Dashboard" },
  { to: "/pages/users", icon: "/a2.png", label: "Users" },
  { to: "/pages/business", icon: "/a3.png", label: "Business" },
  { to: "/pages/listing", icon: "/a4.png", label: "Listing" },
  { to: "/pages/categories", icon: "/a5.png", label: "Categories" },
  { to: "/pages/support", icon: "/a7.png", label: "Support" },
  { to: "/pages/notifications", icon: "/a8.png", label: "Notifications" },
  { to: "/pages/statistics", icon: "/a9.png", label: "Statistics" },
  { to: "/pages/reportedusers", icon: "/a11.png", label: "Reported Users" },
  { to: "/pages/privacypolicy", icon: "/a12.png", label: "Privacy Policy" },
  { to: "/pages/feedback", icon: "/fd.svg", label: "Feedback" },
  { to: "/pages/banners", icon: "/banner.svg", label: "Banner" },
];

const NavBar = () => {
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userName, setUserName] = useState("");
  const [roleLabel, setRoleLabel] = useState("Administrator");
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
        const response = await fetch(
          `${getApiBaseUrl()}/admin-panel/me`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
  
  const toggleSettingsDropdown = () => {
    setSettingsDropdownOpen((prev) => !prev);
  };

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
    <div className="border-b rounded-l-lg">
      <div className="grid grid-cols-12 gap-4 p-5">
        <div className="col-span-8 relative" ref={searchContainerRef}>
          <div className="flex items-center border rounded-full p-2 mt-1 bg-[#F6F8FB]">
            <Image
              src="/images/Seacrh.png"
              alt="Search Icon"
              width={24}
              height={24}
              className="mr-2"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className="w-full bg-[#F6F8FB] border-none focus:outline-none"
              placeholder="Search menu items..."
            />
          </div>

          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg z-50 mt-1 max-h-60 overflow-y-auto border border-gray-200">
              {searchSuggestions.map((item) => (
                <div
                  key={item.to}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSearchNavigation(item)}
                >
                  <div className="w-6 h-6 relative mr-3">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-gray-800">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-4">
          <div className="flex justify-end gap-2 items-center">
            <div className="relative" ref={settingsDropdownRef}>
              <div
                className="text-3xl cursor-pointer rounded-full p-2 hover:bg-gray-200"
                onClick={toggleSettingsDropdown}
              >
                <FiSettings />
              </div>
              {settingsDropdownOpen && (
                <div className="absolute top-full right-0 bg-white text-black rounded-lg shadow-lg z-50 w-48 mt-2 border border-gray-200">
                  <div
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                    onClick={() => {
                      router.push("/pages/adminprofile");
                      setSettingsDropdownOpen(false);
                    }}
                  >
                    Profile Setting
                  </div>
                  <div
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      clearAdminSession();
                      router.push("/");
                      setSettingsDropdownOpen(false);
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-full p-2 bg-red-100 w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-red-200">
              <Image
                src="/images/notification.png"
                alt="Notification Icon"
                width={24}
                height={24}
                onClick={() => router.push("/pages/notifications")}
              />
            </div>

            <div className="flex gap-5 items-center">
              <div className="w-12 h-12 relative">
                <Image
                  src="/images/profile (1).png"
                  fill
                  alt="Profile Image"
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <p className="text-custom-24.65 font-medium leading-6 tracking-custom-0.005 text-left text-[#78828A]">
                  {userName}
                </p>
                <p className="text-[11px] text-[#78828A]">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;