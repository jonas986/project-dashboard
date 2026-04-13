import { describe, it, expect, vi, afterEach } from "vitest";
import { getDeadlineStatus } from "../lib/deadline";

describe("getDeadlineStatus", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns green when deadline > 7 days away", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-01T12:00:00"));
    expect(getDeadlineStatus("2026-04-15")).toBe("green");
  });

  it("returns yellow when deadline within 7 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00"));
    expect(getDeadlineStatus("2026-04-15")).toBe("yellow");
  });

  it("returns yellow when exactly 7 days away", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-08T12:00:00"));
    // deadline is 2026-04-15T23:59:59, diff = ~7.5 days => yellow (<=7 check uses diffDays)
    // Actually: from Apr 8 12:00 to Apr 15 23:59:59 = 7 days 11h 59m 59s = ~7.5 days
    // diffDays = 7.5 => <=7 is false => green
    // For exactly 7 days: from Apr 8 23:59:59 to Apr 15 23:59:59 = exactly 7 days
    vi.setSystemTime(new Date("2026-04-08T23:59:59"));
    expect(getDeadlineStatus("2026-04-15")).toBe("yellow");
  });

  it("returns red when deadline passed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-20T12:00:00"));
    expect(getDeadlineStatus("2026-04-15")).toBe("red");
  });

  it("returns green when deadline is null", () => {
    expect(getDeadlineStatus(null)).toBe("green");
  });
});
