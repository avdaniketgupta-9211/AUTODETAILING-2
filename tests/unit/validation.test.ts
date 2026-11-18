import { describe, expect, it } from "vitest";
import { isLikelySpam, MIN_FILL_MS, normalizeContact, validateContact } from "@/lib/validation";

const valid = {
  name: "Jane Driver",
  email: "Jane@Example.com ",
  phone: "(714) 555-0100",
  vehicle: "1965 El Camino",
  service: "Classic car restoration consultation",
  message: "I'd like to talk about a restoration.",
  company: "",
  startedAt: Date.now() - 10_000,
};

describe("normalizeContact", () => {
  it("trims, lowercases email and strips control characters", () => {
    const n = normalizeContact({ ...valid, name: "  Jane\u0007 " });
    expect(n.name).toBe("Jane");
    expect(n.email).toBe("jane@example.com");
  });

  it("coerces non-string fields safely", () => {
    const n = normalizeContact({ name: 42, email: null, startedAt: "abc" });
    expect(n.name).toBe("");
    expect(n.email).toBe("");
    expect(n.startedAt).toBe(0);
  });

  it("caps field lengths", () => {
    const n = normalizeContact({ ...valid, message: "x".repeat(5000) });
    expect(n.message.length).toBe(3000);
  });
});

describe("validateContact", () => {
  it("accepts a valid submission", () => {
    expect(validateContact(normalizeContact(valid))).toEqual({});
  });

  it("rejects missing and malformed fields", () => {
    const errs = validateContact(normalizeContact({ name: "J", email: "nope", phone: "abc", service: "Hack", message: "short" }));
    expect(Object.keys(errs).sort()).toEqual(["email", "message", "name", "phone", "service"]);
  });

  it("allows an empty optional phone", () => {
    expect(validateContact(normalizeContact({ ...valid, phone: "" }))).toEqual({});
  });
});

describe("isLikelySpam", () => {
  const now = Date.now();
  it("flags a filled honeypot", () => {
    expect(isLikelySpam(normalizeContact({ ...valid, company: "ACME" }), now)).toBe(true);
  });
  it("flags submissions faster than a human could type", () => {
    expect(isLikelySpam(normalizeContact({ ...valid, startedAt: now - (MIN_FILL_MS - 500) }), now)).toBe(true);
  });
  it("flags link-stuffed messages", () => {
    const msg = "see http://a.com http://b.com http://c.com";
    expect(isLikelySpam(normalizeContact({ ...valid, message: msg }), now)).toBe(true);
  });
  it("passes a normal human submission", () => {
    expect(isLikelySpam(normalizeContact(valid), now)).toBe(false);
  });
});
