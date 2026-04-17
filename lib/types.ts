export interface MealDay {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  snack: boolean;
  preWorkout: boolean;
  postWorkout: boolean;
  water: string;
  sleepHours: string;
  vitamins: boolean;
}

export type DayKey =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export interface Week {
  id: string;
  startDate: string;
  endDate: string;
  days: Record<DayKey, MealDay>;
  workoutSessions: boolean[];
  cardioSessions: boolean[];
  notes: string;
}
