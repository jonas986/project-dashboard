import { describe, it, expect, vi, afterEach } from "vitest";
import { formatRelativeTime } from "../lib/time";

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Gerade eben" for less than 1 minute ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-13T12:00:30"));
    expect(formatRelativeTime("2026-04-13T12:00:00")).toBe("Gerade eben");
  });

  it('returns "Vor 1 Minute" for exactly 1 minute ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-13T12:01:00"));
    expect(formatRelativeTime("2026-04-13T12:00:00")).toBe("Vor 1 Minute");
  });

  it('returns "Vor 15 Minuten" for 15 minutes ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-13T12:15:00"));
    expect(formatRelativeTime("2026-04-13T12:00:00")).toBe("Vor 15 Minuten");
  });

  it('returns "Vor 1 Stunde" for exactly 1 hour ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-13T13:00:00"));
    expect(formatRelativeTime("2026-04-13T12:00:00")).toBe("Vor 1 Stunde");
  });

  it('returns "Vor 3 Stunden" for 3 hours ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-13T15:00:00"));
    expect(formatRelativeTime("2026-04-13T12:00:00")).toBe("Vor 3 Stunden");
  });

  it('returns "Vor 1 Tag" for exactly 1 day ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14T12:00:00"));
    expect(formatRelativeTime("2026-04-13T12:00:00")).toBe("Vor 1 Tag");
  });

  it('returns "Vor 2 Tagen" for 2 days ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T12:00:00"));
    expect(formatRelativeTime("2026-04-13T12:00:00")).toBe("Vor 2 Tagen");
  });

  it("returns formatted date for more than 7 days ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-25T12:00:00"));
    expect(formatRelativeTime("2026-04-13T12:00:00")).toBe("13.04.2026");
  });
});
