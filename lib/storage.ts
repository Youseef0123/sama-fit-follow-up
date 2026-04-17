import { fetchData, saveData } from "./api";
import { Week } from "./types";
import { DAY_KEYS, createEmptyDay, generateWeekId } from "./utils";

function toBoolean(value: unknown): boolean {
  return value === true || value === "true";
}

function normalizeWeeks(rawWeeks: unknown): Week[] {
  if (!Array.isArray(rawWeeks)) {
    return [];
  }

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

export async function getAllWeeks(): Promise<Week[]> {
  try {
    const data = await fetchData();
    return normalizeWeeks(data.weeks);
  } catch {
    return [];
  }
}

export async function saveWeek(week: Week): Promise<void> {
  const weeks = await getAllWeeks();
  const index = weeks.findIndex((item) => item.id === week.id);

  if (index === -1) {
    weeks.push(week);
  } else {
    weeks[index] = week;
  }

  weeks.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  await saveData({ weeks });
}

export async function getWeekById(id: string): Promise<Week | null> {
  const weeks = await getAllWeeks();
  const week = weeks.find((item) => item.id === id);
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
