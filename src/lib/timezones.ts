export type TimezoneOption = {
  value: string;
  label: string;
  offsetMinutes: number;
};

export const DEFAULT_TIMEZONE = "America/New_York";

const FALLBACK_IANA: string[] = [
  "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos", "Africa/Nairobi",
  "America/Anchorage", "America/Argentina/Buenos_Aires", "America/Bogota",
  "America/Chicago", "America/Denver", "America/Halifax", "America/Lima",
  "America/Los_Angeles", "America/Mexico_City", "America/New_York",
  "America/Phoenix", "America/Sao_Paulo", "America/Toronto", "America/Vancouver",
  "Asia/Bangkok", "Asia/Dhaka", "Asia/Dubai", "Asia/Hong_Kong", "Asia/Jakarta",
  "Asia/Karachi", "Asia/Kolkata", "Asia/Kuala_Lumpur", "Asia/Manila",
  "Asia/Riyadh", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei",
  "Asia/Tokyo", "Australia/Brisbane", "Australia/Melbourne", "Australia/Perth",
  "Australia/Sydney", "Europe/Amsterdam", "Europe/Athens", "Europe/Berlin",
  "Europe/Dublin", "Europe/Helsinki", "Europe/Istanbul", "Europe/London",
  "Europe/Madrid", "Europe/Moscow", "Europe/Paris", "Europe/Rome",
  "Europe/Stockholm", "Europe/Warsaw", "Europe/Zurich", "Pacific/Auckland",
  "Pacific/Fiji", "Pacific/Honolulu", "UTC",
];

function getIanaZones(): string[] {
  try {
    type SupportedValuesOf = (key: "timeZone") => string[];
    const fn = (Intl as unknown as { supportedValuesOf?: SupportedValuesOf })
      .supportedValuesOf;
    if (typeof fn === "function") {
      const zones = fn("timeZone");
      if (Array.isArray(zones) && zones.length > 0) return zones;
    }
  } catch {
    // fall through
  }
  return FALLBACK_IANA;
}

function offsetMinutesFor(tz: string, at: Date = new Date()): number {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = dtf.formatToParts(at);
    const pick = (type: string) =>
      Number(parts.find((p) => p.type === type)?.value ?? "0");
    const asUtc = Date.UTC(
      pick("year"),
      pick("month") - 1,
      pick("day"),
      pick("hour") === 24 ? 0 : pick("hour"),
      pick("minute"),
      pick("second")
    );
    return Math.round((asUtc - at.getTime()) / 60000);
  } catch {
    return 0;
  }
}

function formatOffset(mins: number): string {
  const sign = mins >= 0 ? "+" : "-";
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (m === 0) return `UTC${sign}${h}`;
  return `UTC${sign}${h}:${String(m).padStart(2, "0")}`;
}

function niceLabel(tz: string): string {
  const last = tz.split("/").pop() ?? tz;
  return last.replace(/_/g, " ");
}

function buildOptions(): TimezoneOption[] {
  const now = new Date();
  const seen = new Set<string>();
  const items: TimezoneOption[] = [];
  for (const tz of getIanaZones()) {
    if (seen.has(tz)) continue;
    seen.add(tz);
    const mins = offsetMinutesFor(tz, now);
    items.push({
      value: tz,
      label: `(${formatOffset(mins)}) ${niceLabel(tz)} — ${tz}`,
      offsetMinutes: mins,
    });
  }
  items.sort((a, b) => {
    if (a.offsetMinutes !== b.offsetMinutes) {
      return a.offsetMinutes - b.offsetMinutes;
    }
    return a.value.localeCompare(b.value);
  });
  return items;
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = buildOptions();

export function isValidTimezone(tz: string): boolean {
  return TIMEZONE_OPTIONS.some((opt) => opt.value === tz);
}
