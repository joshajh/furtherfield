import type { Event, EventDate } from "./cms";

export type NextOccurringDate = {
  date: string;
  time: string | null;
  isQualitative?: boolean;
  qualitativeText?: string | null;
};

/**
 * Returns the date to display for an event, given that an event may be a series
 * of several dates. Prefers the next upcoming occurrence (an event spanning a
 * date range counts as upcoming until its endDate has passed), falling back to
 * the most recent past date once a series has finished, then to the legacy
 * single `date` field.
 *
 * Qualitative dates (stored with the 9999-12-31 placeholder, e.g. "Last Sunday
 * of Every Month") are always considered upcoming, but sort after real dates so
 * a concrete next occurrence wins.
 *
 * Kept free of database imports so client components can use it too.
 */
export function getNextOccurringDate(
  event: Pick<Event, "dates" | "date" | "time">
): NextOccurringDate | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isUpcoming = (d: EventDate) => {
    if (d.isQualitative) return true;
    const eventDate = new Date(d.endDate || d.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  const toResult = (d: EventDate): NextOccurringDate => ({
    date: d.date,
    time: d.time || event.time,
    isQualitative: d.isQualitative,
    qualitativeText: d.qualitativeText,
  });

  // Soonest upcoming date, with qualitative ("TBC"-style) dates ranked last.
  const upcoming = event.dates.filter(isUpcoming).sort((a, b) => {
    if (a.isQualitative && b.isQualitative) return 0;
    if (a.isQualitative) return 1;
    if (b.isQualitative) return -1;
    return (
      new Date(a.endDate || a.date).getTime() -
      new Date(b.endDate || b.date).getTime()
    );
  });
  if (upcoming.length > 0) return toResult(upcoming[0]);

  // Series has finished: show the most recent past date.
  const past = event.dates
    .filter((d) => !d.isQualitative)
    .sort(
      (a, b) =>
        new Date(b.endDate || b.date).getTime() -
        new Date(a.endDate || a.date).getTime()
    );
  if (past.length > 0) return toResult(past[0]);

  // Fallback to legacy single-date field.
  if (event.date) return { date: event.date, time: event.time };

  return null;
}
