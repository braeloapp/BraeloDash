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
      <div className="flex h-screen z-10">
        <div className="">
          <Sidebar />
        </div>

        <div className="  w-[calc(100%-256px)] h-full flex flex-col border rounded-l-[50px] bg-white z-50">
          <NavBar />
          <div className="p-5 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
    </AuthGate>
  );
};

export default Layout;
