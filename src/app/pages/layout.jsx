"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/Navbar";
import AuthGate from "../components/auth/AuthGate";

const Layout = ({ children }) => {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", navOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [navOpen]);

  return (
    <AuthGate>
      <div className="admin-panel admin-shell min-h-dvh">
        <div className="relative flex h-dvh overflow-hidden">
          {navOpen ? (
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-brand-ink/40 md:hidden"
              onClick={() => setNavOpen(false)}
            />
          ) : null}

          <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
          <div className="hidden w-[280px] shrink-0 md:block" aria-hidden />

          <div className="admin-main flex min-w-0 flex-1 flex-col border bg-white/95 md:mb-3 md:mr-3 md:mt-0 md:rounded-panel md:border md:shadow-panel">
            <NavBar onMenuClick={() => setNavOpen(true)} />
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-0 sm:px-5 sm:pb-5 sm:pt-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
};

export default Layout;
