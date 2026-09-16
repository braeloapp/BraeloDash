"use client";

import React from "react";
import { FiMenu } from "react-icons/fi";

const NavBar = ({ onMenuClick }) => {
  return (
    <header className="admin-topbar sticky top-0 z-30 shrink-0 border-b backdrop-blur md:hidden">
      <div className="flex items-center px-3 py-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="btn-icon"
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>
      </div>
    </header>
  );
};

export default NavBar;
