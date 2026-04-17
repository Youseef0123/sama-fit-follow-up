import { DayKey, MealDay, Week } from "./types";

export const DAY_KEYS: DayKey[] = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

export function getNextSaturday(from: Date): Date {
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = (6 - day + 7) % 7;
  date.setDate(date.getDate() + diff);
  return date;
}

export function formatDateArabic(date: Date): string {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatWeekRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${formatDateArabic(startDate)} - ${formatDateArabic(endDate)}`;
}

export function generateWeekId(startDate: Date): string {
  const date = new Date(startDate);
  date.setHours(0, 0, 0, 0);
  const iso = date.toISOString().slice(0, 10);
  return `week_${iso}`;
}

export function createEmptyDay(): MealDay {
  return {
    breakfast: false,
    lunch: false,
    dinner: false,
    snack: false,
    preWorkout: false,
    postWorkout: false,
    water: "",
    sleepHours: "",
    vitamins: false,
  };
}

export function isWeekComplete(week: Week): boolean {
  const completedBreakfasts = DAY_KEYS.filter((key) => {
    return week.days[key].breakfast === true;
  }).length;
  return completedBreakfasts >= 5;
}
