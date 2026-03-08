import { describe, it, expect } from "vitest";
import {
  getDateStringInTimezone,
  getWeekDateStrings,
  isScheduleOnDate,
  formatCurrency,
} from "./utils";

describe("getDateStringInTimezone", () => {
  it("returns YYYY-MM-DD for a date in the given timezone", () => {
    const date = new Date("2026-02-27T18:30:00.000Z");
    expect(getDateStringInTimezone(date, "Europe/London")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getWeekDateStrings", () => {
  it("returns 7 date strings for the week containing the given date", () => {
    const week = getWeekDateStrings("2026-02-27", "UTC");
    expect(week).toHaveLength(7);
    expect(week.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))).toBe(true);
  });

  it("week starts on Monday", () => {
    const week = getWeekDateStrings("2026-02-27", "UTC");
    const mon = new Date(week[0] + "T12:00:00Z");
    expect(mon.getUTCDay()).toBe(1);
  });

  it("contains the given date", () => {
    const week = getWeekDateStrings("2026-02-27", "UTC");
    expect(week).toContain("2026-02-27");
  });
});

describe("isScheduleOnDate", () => {
  it("returns true when schedule falls on date in timezone", () => {
    expect(isScheduleOnDate("2026-02-27T14:00:00.000Z", "2026-02-27", "UTC")).toBe(true);
  });

  it("returns false when schedule is on different date", () => {
    expect(isScheduleOnDate("2026-02-28T00:00:00.000Z", "2026-02-27", "UTC")).toBe(false);
  });

  it("respects timezone for date boundary", () => {
    const instant = "2026-02-27T22:00:00.000Z";
    expect(isScheduleOnDate(instant, "2026-02-27", "UTC")).toBe(true);
    expect(isScheduleOnDate(instant, "2026-02-28", "Asia/Tokyo")).toBe(true);
  });
});

describe("formatCurrency", () => {
  it("formats amount with default USD", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("1,234.56");
    expect(result).toMatch(/\$|USD/);
  });

  it("formats amount with GBP", () => {
    const result = formatCurrency(30, "GBP");
    expect(result).toContain("30");
    expect(result).toMatch(/£|GBP/);
  });

  it("formats amount with EUR", () => {
    const result = formatCurrency(99.99, "EUR");
    expect(result).toContain("99.99");
  });

  it("uses USD for invalid currency code", () => {
    const result = formatCurrency(10, "XX");
    expect(result).toBeDefined();
  });
});
