// src/components/Layout.jsx
"use client";
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/Navbar";
import AuthGate from "../components/auth/AuthGate";

const Layout = ({ children }) => {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <AuthGate>
    <div className="admin-panel">
      <div className="flex h-screen z-10 overflow-hidden">
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>

        <div className="w-full md:w-[calc(100%-256px)] h-full flex flex-col border md:rounded-l-[50px] bg-white z-50 min-w-0">
          <NavBar />
          <div className="p-3 sm:p-5 overflow-y-auto overflow-x-auto">{children}</div>
        </div>
      </div>
    </div>
    </AuthGate>
  );
};

export default Layout;
