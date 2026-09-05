function validateLoginForm(email, password) {
  const trimmed = (email || "").trim();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, message: "Please enter a valid email address" };
  }
  if (!password) {
    return { ok: false, message: "Password is required" };
  }
  return { ok: true };
}

module.exports = { validateLoginForm };
