"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

const BackButton = ({
  onBack,
  iconSize = 20,
  buttonStyle = "",
  iconStyle = "",
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      aria-label="Go back"
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-white transition hover:bg-brand-gold focus-visible:outline-none focus-visible:shadow-focus ${buttonStyle}`}
      onClick={handleBackClick}
    >
      <FiArrowLeft className={iconStyle} size={iconSize} />
    </button>
  );
};

export default BackButton;
