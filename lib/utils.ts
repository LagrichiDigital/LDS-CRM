import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date | string, timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    // weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    year: "numeric", // numeric year (e.g., '2023')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false),
    timeZone: timeZone, // use the provided timezone
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
    timeZone: timeZone, // use the provided timezone
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
    timeZone: timeZone, // use the provided timezone
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    timeZone: timeZone, // use the provided timezone
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

/** Get YYYY-MM-DD for a date in the given timezone (for date filtering). */
export function getDateStringInTimezone(
  date: Date,
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): string {
  return date.toLocaleDateString("en-CA", { timeZone: timezone }); // en-CA gives YYYY-MM-DD
}

/** Get today's date string (YYYY-MM-DD) in the given timezone. */
export function getTodayDateStringInTimezone(
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): string {
  return getDateStringInTimezone(new Date(), timezone);
}

/** True if the ISO schedule string falls on the given date (YYYY-MM-DD) in the given timezone. */
export function isScheduleOnDate(
  scheduleIso: string,
  dateStr: string,
  timezone: string
): boolean {
  const date = new Date(scheduleIso);
  const scheduleDateStr = getDateStringInTimezone(date, timezone);
  return scheduleDateStr === dateStr;
}

/** Get the 7 date strings (YYYY-MM-DD) for the week containing the given dateStr, in timezone. Week starts Monday. */
export function getWeekDateStrings(
  dateStr: string,
  timezone: string
): string[] {
  const date = new Date(dateStr + "T12:00:00");
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short" });
  const weekday = weekdayFormatter.format(date);
  const dayIndex = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(weekday);
  const daysBackToMonday = dayIndex >= 0 ? dayIndex : 0;
  let monday = dateStr;
  for (let back = 0; back < daysBackToMonday; back++) {
    const d = new Date(monday + "T12:00:00");
    d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
    monday = getDateStringInTimezone(d, timezone);
  }
  const out: string[] = [monday];
  let current = monday;
  for (let i = 1; i < 7; i++) {
    const d = new Date(current + "T12:00:00");
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    current = getDateStringInTimezone(d, timezone);
    out.push(current);
  }
  return out;
}

/** Format a number as currency. Use business.currency (e.g. GBP, USD, EUR, MAD, AED) or default "USD". */
export function formatCurrency(
  amount: number,
  currencyCode: string = "USD"
): string {
  const code = typeof currencyCode === "string" && currencyCode.length === 3
    ? currencyCode.toUpperCase()
    : "USD";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(amount);
}

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
