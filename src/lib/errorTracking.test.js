const { test } = require("node:test");
const assert = require("node:assert/strict");
const { describeError } = require("./errorTracking");

test("describeError uses Error.message", () => {
  assert.equal(describeError(new Error("boom")), "boom");
});

test("describeError stringifies other values", () => {
  assert.equal(describeError("timeout"), "timeout");
});
