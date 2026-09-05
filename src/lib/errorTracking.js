function describeError(value) {
  if (!value) return "unknown error";
  if (value instanceof Error) return value.message || value.name;
  return String(value);
}

function initErrorTracking() {
  if (typeof window === "undefined") return;
  if (window.__braeloErrorTracking) return;
  window.__braeloErrorTracking = true;

  window.addEventListener("error", (event) => {
    console.error("[braelo-admin]", describeError(event.error || event.message));
  });
  window.addEventListener("unhandledrejection", (event) => {
    console.error("[braelo-admin]", describeError(event.reason));
  });
}

function reportError(error) {
  console.error("[braelo-admin]", describeError(error));
}

module.exports = { initErrorTracking, reportError, describeError };
