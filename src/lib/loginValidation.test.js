const { test } = require("node:test");
const assert = require("node:assert/strict");
const { validateLoginForm } = require("./loginValidation");

test("rejects empty email", () => {
  assert.equal(validateLoginForm("", "secret").ok, false);
});

test("rejects invalid email", () => {
  assert.equal(validateLoginForm("not-an-email", "secret").ok, false);
});

test("rejects missing password", () => {
  const result = validateLoginForm("admin@example.com", "");
  assert.equal(result.ok, false);
  assert.match(result.message, /Password/);
});

test("accepts a valid login payload", () => {
  assert.equal(validateLoginForm("admin@example.com", "secret").ok, true);
});
