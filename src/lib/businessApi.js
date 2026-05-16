function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/** API may return HTTP 200 with { status: 400, message, error } on root or under data */
export function getBusinessSaveFailure(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const candidates = [payload, payload.data].filter(
    (x) => x && typeof x === "object" && !Array.isArray(x)
  );

  for (const obj of candidates) {
    const status = hasOwn(obj, "status") ? obj.status : undefined;
    if (typeof status === "number" && status >= 400) return obj;
    if (typeof status === "string") {
      const n = Number(status);
      if (!Number.isNaN(n) && n >= 400) return obj;
    }
    if (hasOwn(obj, "error") && typeof obj.error === "string" && obj.error.trim()) {
      return obj;
    }
    if (hasOwn(obj, "success") && obj.success === false) return obj;
  }

  return null;
}

export function isBusinessCreateSuccess(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }
  if (getBusinessSaveFailure(payload)) return false;

  if (hasOwn(payload, "success") && payload.success === true) return true;

  const status = hasOwn(payload, "status") ? Number(payload.status) : NaN;
  if (status === 200 || status === 201) return true;

  const data = payload.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (hasOwn(data, "success") && data.success === true) return true;
    if (data.id != null || data.business_id != null) return true;
    if (typeof data.business_name === "string" && data.business_name.trim()) {
      return true;
    }
  }

  if (payload.id != null || payload.business_id != null) return true;

  const message = payload.message;
  if (typeof message === "string" && /created|success/i.test(message)) {
    return true;
  }

  return false;
}

export function businessSaveErrorMessage(obj) {
  if (!obj || typeof obj !== "object") {
    return "Could not create business. Please check required fields and try again.";
  }

  if (typeof obj.error === "string" && obj.error.trim()) return obj.error.trim();
  if (typeof obj.message === "string" && obj.message.trim()) return obj.message.trim();
  if (typeof obj.detail === "string" && obj.detail.trim()) return obj.detail.trim();

  if (Array.isArray(obj.detail) && obj.detail.length > 0) {
    const first = obj.detail[0];
    if (typeof first === "string") return first;
    if (first?.msg) return String(first.msg);
  }

  if (obj.errors && typeof obj.errors === "object") {
    const key = Object.keys(obj.errors)[0];
    if (key) {
      const val = obj.errors[key];
      if (Array.isArray(val) && val[0]) return String(val[0]);
      if (typeof val === "string") return val;
    }
  }

  if (Object.keys(obj).length === 0) {
    return "Could not create business. The server returned no details — check logo, banner, and address, then try again.";
  }

  return "Could not create business. Please check required fields and try again.";
}
