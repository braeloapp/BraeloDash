/**
 * Google Maps JavaScript API — single shared loader for the whole app.
 * Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local (see .env.example).
 */

const SCRIPT_ID = "google-maps-js-api";

let loadPromise = null;

export function getGoogleMapsScriptUrl() {
  const key =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    "";
  return `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
    key
  )}&libraries=places`;
}

function isGoogleMapsReady() {
  return (
    typeof window !== "undefined" &&
    window.google?.maps?.places != null
  );
}

/**
 * Loads the Maps JS API once per page session. Safe to call from many components.
 * @returns {Promise<void>}
 */
export function loadGoogleMaps() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (isGoogleMapsReady()) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const onReady = () => {
      if (isGoogleMapsReady()) {
        resolve();
      } else {
        loadPromise = null;
        reject(new Error("Google Maps loaded but API is unavailable"));
      }
    };

    const onError = () => {
      loadPromise = null;
      reject(new Error("Failed to load Google Maps JavaScript API"));
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", onReady, { once: true });
      existing.addEventListener("error", onError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = getGoogleMapsScriptUrl();
    script.async = true;
    script.defer = true;
    script.onload = onReady;
    script.onerror = onError;
    document.head.appendChild(script);
  });

  return loadPromise;
}
