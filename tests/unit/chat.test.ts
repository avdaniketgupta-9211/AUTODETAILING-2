import { describe, expect, it } from "vitest";
import { answerFromKnowledge, chatSystemPrompt, principlesForService } from "@/lib/chat-knowledge";
import { isLikelySpamLead, normalizeLead, validateLead } from "@/lib/validation";

const baseLead = {
  name: "Jane Doe",
  phone: "(714) 870-6900",
  email: "",
  message: "I would like an estimate for brake service please.",
  company: "",
  startedAt: Date.now() - 10_000,
};

describe("verified chat knowledge base", () => {
  it("greets with the exact welcome copy", () => {
    expect(answerFromKnowledge("hello").text).toBe("Hi! 👋 Welcome! How can we help you today?");
  });

  it("guides service questions to a real dedicated page", () => {
    const answer = answerFromKnowledge("How much are brakes?");
    expect(answer.text).toContain("Inspection, pads, rotors and complete brake jobs");
    expect(answer.links).toEqual(
      expect.arrayContaining([{ label: "Explore Brake Service", href: "/services/brakes" }]),
    );
  });

  it("lists only published services", () => {
    const answer = answerFromKnowledge("What services do you offer?");
    expect(answer.text).toContain("Engine Repair");
    expect(answer.text).toContain("Towing");
    expect(answer.links?.[0]).toEqual({ label: "View all services", href: "/services" });
  });

  it("finds a service from a keyword", () => {
    expect(answerFromKnowledge("do you do smog checks").links?.[0].href).toBe("/services/smog-check");
    expect(answerFromKnowledge("my A/C is not cold").links?.[0].href).toBe("/services/air-conditioning");
  });

  it("never invents an answer for unknown topics", () => {
    const answer = answerFromKnowledge("Do you sell winter tires at a discount?");
    expect(answer.text).toContain("I don't have verified information");
    expect(answer.text).not.toMatch(/\$\d/);
  });

  it("only reuses published principles on service pages", () => {
    expect(principlesForService("engine-repair").map((p) => p.title)).toEqual([
      "Professional diagnostics",
      "Quality materials",
      "Honesty",
    ]);
    expect(chatSystemPrompt).toContain("/services/engine-repair");
    expect(chatSystemPrompt).toContain("Never invent prices");
  });
});

describe("chat lead validation", () => {
  it("accepts an optional email and requires four useful fields", () => {
    expect(validateLead(normalizeLead(baseLead))).toEqual({});
    expect(validateLead(normalizeLead({ ...baseLead, email: "not-an-email" })).email).toBeTruthy();
    expect(validateLead(normalizeLead({ ...baseLead, phone: "123" })).phone).toBeTruthy();
    expect(validateLead(normalizeLead({ ...baseLead, message: "short" })).message).toBeTruthy();
  });

  it("drops honeypots, too-fast submissions and link stuffing", () => {
    expect(isLikelySpamLead(normalizeLead({ ...baseLead, company: "Bot Inc" }))).toBe(true);
    expect(isLikelySpamLead(normalizeLead({ ...baseLead, startedAt: Date.now() }))).toBe(true);
    expect(isLikelySpamLead(normalizeLead({ ...baseLead, message: "http://a http://b http://c http://d" }))).toBe(true);
    expect(isLikelySpamLead(normalizeLead(baseLead))).toBe(false);
  });
});
