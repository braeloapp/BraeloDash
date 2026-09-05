"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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

const Sidebar = () => {
  const pathname = usePathname(); // Get current path

  // Function to dynamically set the active class based on the path
  const getTabClass = (path) => {
    const isActive = pathname.startsWith(path); // Check if pathname starts with the item path
    return `flex items-center mt-3 justify-start px-6 py-2 cursor-pointer hover:bg-gray-600 hover:rounded-lg ${
      isActive ? "bg-[#D8B039] rounded-lg" : "rounded-lg"
    }`;
  };

  return (
    <nav className="flex flex-col w-64 bg-[#3a4248] h-screen overflow-y-auto" aria-label="Admin">
      <div className="bg-[#3a4248] ">
        <div className="">
          {/* Logo Section */}
          <div className="bg-[#FFCC35] flex justify-center p-8">
            <Image
              src="/black logo.png"
              alt="Logo"
              width={200}
              height={50}
              className="hidden md:block"
            />
            <Image
              src="/faveicon.svg"
              alt="Favicon"
              width={24}
              height={24}
              className="block md:hidden"
            />
          </div>

          <div className="p-5">
            <h1 className="text-white text-lg font-bold">Platform</h1>
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.to}
                className={getTabClass(item.to)}
                aria-current={pathname.startsWith(item.to) ? "page" : undefined}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="text-white">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
