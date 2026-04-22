export const REQUIRED_CALENDAR_SCOPE =
  "https://www.googleapis.com/auth/calendar.events";

export function hasCalendarScope(scope: string | null | undefined): boolean {
  return (scope ?? "").split(/\s+/).includes(REQUIRED_CALENDAR_SCOPE);
}
