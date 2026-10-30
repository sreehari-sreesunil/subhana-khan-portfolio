import { getPosition, getTimes } from "suncalc";
import { site } from "@/content/site";

const KOCHI = { lat: 9.93, lng: 76.27 };
// India has one fixed offset and no daylight saving, so the visitor's own zone never matters.
const IST_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
export const MINUTES_IN_DAY = 1440;

// Where the arc sits in its box, as fractions of its width and height.
export const ARC = { left: 0.12, right: 0.88, top: 0.13, horizon: 0.74 };

const clock = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });

export type SunDay = { start: number; sunrise: number; sunset: number };

/** Today in Kochi: its midnight, and its sunrise and sunset in minutes after midnight. */
export function kochiDay(now: number): SunDay {
  const start = Math.floor((now + IST_MS) / DAY_MS) * DAY_MS - IST_MS;
  const times = getTimes(new Date(start + DAY_MS / 2), KOCHI.lat, KOCHI.lng);
  // Null only near the poles; Kochi has a sunrise and sunset every day.
  return {
    start,
    sunrise: (times.sunrise!.getTime() - start) / 60000,
    sunset: (times.sunset!.getTime() - start) / 60000,
  };
}

/** The sun's height above the horizon, in degrees. */
export function sunAltitude(day: SunDay, minutes: number) {
  // suncalc 2 already returns degrees, though its published types still describe radians.
  return getPosition(new Date(day.start + minutes * 60000), KOCHI.lat, KOCHI.lng).altitude;
}

// Daylight takes the arc; the two nights share what's left at either end, so all 24 hours can be reached.
export function minutesToX(day: SunDay, minutes: number) {
  if (minutes < day.sunrise) return ARC.left * (minutes / day.sunrise);
  if (minutes <= day.sunset) {
    return ARC.left + (ARC.right - ARC.left) * ((minutes - day.sunrise) / (day.sunset - day.sunrise));
  }
  return ARC.right + (1 - ARC.right) * ((minutes - day.sunset) / (MINUTES_IN_DAY - day.sunset));
}

export function xToMinutes(day: SunDay, x: number) {
  const clamped = Math.min(1, Math.max(0, x));
  if (clamped < ARC.left) return (clamped / ARC.left) * day.sunrise;
  if (clamped <= ARC.right) {
    return day.sunrise + ((clamped - ARC.left) / (ARC.right - ARC.left)) * (day.sunset - day.sunrise);
  }
  return day.sunset + ((clamped - ARC.right) / (1 - ARC.right)) * (MINUTES_IN_DAY - 1 - day.sunset);
}

/** An ellipse by day; past either end it keeps falling, behind the ground. */
export function xToY(x: number) {
  const centre = (ARC.left + ARC.right) / 2;
  const u = (x - centre) / ((ARC.right - ARC.left) / 2);
  if (Math.abs(u) <= 1) return ARC.horizon - (ARC.horizon - ARC.top) * Math.sqrt(1 - u * u);
  return ARC.horizon + (Math.abs(u) - 1) * 0.5;
}

export function sunCaption(day: SunDay, minutes: number) {
  const time = clock.format(new Date(day.start + minutes * 60000)).replace(/ /g, " ");
  const { rising, high, setting, night } = site.sunPath;
  let state = night;
  if (minutes >= day.sunrise - 30 && minutes < day.sunrise + 75) state = rising;
  else if (minutes >= day.sunset - 60 && minutes < day.sunset + 30) state = setting;
  else if (minutes >= day.sunrise && minutes < day.sunset) state = high;
  return `${time} in Kochi · ${state}`;
}

const smooth = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

/** How strongly each flat sky layer shows, by the sun's height. */
export function skyLayers(altitude: number) {
  return {
    sand: 1 - smooth(2, 14, altitude),
    terracotta: 0.7 * (1 - smooth(-1, 6, altitude)),
    night: 1 - smooth(-10, -3, altitude),
  };
}
