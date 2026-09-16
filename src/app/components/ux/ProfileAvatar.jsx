"use client";

import React, { useEffect, useState } from "react";
import {
  DEFAULT_PROFILE_AVATAR,
  resolveProfileAvatar,
} from "@/lib/avatar";

/**
 * Profile image with automatic fallback to the silhouette placeholder
 * when the URL is missing or fails to load.
 */
export default function ProfileAvatar({
  src,
  alt = "",
  className = "user-detail-avatar",
  imgClassName = "user-detail-avatar__img",
  fallbackSrc = DEFAULT_PROFILE_AVATAR,
}) {
  const resolved = resolveProfileAvatar(src);
  const initial =
    resolved === DEFAULT_PROFILE_AVATAR ? fallbackSrc : resolved;
  const [currentSrc, setCurrentSrc] = useState(initial);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const next = resolveProfileAvatar(src);
    setCurrentSrc(next === DEFAULT_PROFILE_AVATAR ? fallbackSrc : next);
    setFailed(false);
  }, [src, fallbackSrc]);

  return (
    <div className={className} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={failed ? fallbackSrc : currentSrc}
        alt={alt}
        className={imgClassName}
        onError={() => {
          if (!failed) setFailed(true);
        }}
      />
    </div>
  );
}
