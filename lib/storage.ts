import { Week } from "./types";
import { DAY_KEYS, createEmptyDay, generateWeekId } from "./utils";

export const STORAGE_KEY = "samafit_weeks";

function isClient(): boolean {
  return typeof window !== "undefined";
}

function toBoolean(value: unknown): boolean {
  return value === true || value === "true";
}

function normalizeWeeks(rawWeeks: unknown[]): Week[] {
  return rawWeeks.map((week) => {
    const typedWeek = week as Partial<Week>;

    const normalizedDays = DAY_KEYS.reduce(
      (acc, dayKey) => {
        const rawDay = typedWeek.days?.[dayKey] as
          | Partial<{
              breakfast: unknown;
              lunch: unknown;
              dinner: unknown;
              snack: unknown;
              preWorkout: unknown;
              postWorkout: unknown;
              water: string;
              sleepHours: string;
              vitamins: unknown;
            }>
          | undefined;
        const fallback = createEmptyDay();

        acc[dayKey] = {
          breakfast: toBoolean(rawDay?.breakfast),
          lunch: toBoolean(rawDay?.lunch),
          dinner: toBoolean(rawDay?.dinner),
          snack: toBoolean(rawDay?.snack),
          preWorkout: toBoolean(rawDay?.preWorkout),
          postWorkout: toBoolean(rawDay?.postWorkout),
          water: rawDay?.water ?? fallback.water,
          sleepHours: rawDay?.sleepHours ?? fallback.sleepHours,
          vitamins: toBoolean(rawDay?.vitamins),
        };

        return acc;
      },
      {} as Week["days"],
    );

    return {
      id: typedWeek.id ?? "",
      startDate: typedWeek.startDate ?? "",
      endDate: typedWeek.endDate ?? "",
      days: normalizedDays,
      workoutSessions: Array.isArray(typedWeek.workoutSessions)
        ? typedWeek.workoutSessions.map((value) => value === true)
        : Array(8).fill(false),
      cardioSessions: Array.isArray(typedWeek.cardioSessions)
        ? typedWeek.cardioSessions.map((value) => value === true)
        : Array(8).fill(false),
      notes: typedWeek.notes ?? "",
    };
  });
}

export function getAllWeeks(): Week[] {
  if (!isClient()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return normalizeWeeks(parsed);
  } catch {
    return [];
  }
}

export function saveWeek(week: Week): void {
  if (!isClient()) {
    return;
  }

  const weeks = getAllWeeks();
  const index = weeks.findIndex((item) => item.id === week.id);

  if (index === -1) {
    weeks.push(week);
  } else {
    weeks[index] = week;
  }

  weeks.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
}

export function getWeekById(id: string): Week | null {
  const week = getAllWeeks().find((item) => item.id === id);
  return week ?? null;
}

export function createNewWeek(startDate: Date): Week {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const days = DAY_KEYS.reduce(
    (acc, dayKey) => {
      acc[dayKey] = createEmptyDay();
      return acc;
    },
    {} as Week["days"],
  );

  return {
    id: generateWeekId(start),
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    days,
    workoutSessions: Array(8).fill(false),
    cardioSessions: Array(8).fill(false),
    notes: "",
  };
}
