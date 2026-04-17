"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomRow from "@/components/BottomRow";
import DayColumn from "@/components/DayColumn";
import SessionToggle from "@/components/SessionToggle";
import { getWeekById, saveWeek } from "@/lib/storage";
import { DayKey, MealDay, Week } from "@/lib/types";
import { formatWeekRange } from "@/lib/utils";

interface WeekFormProps {
  id: string;
}

const DAYS: Array<{ key: DayKey; label: string; short: string }> = [
  { key: "saturday", label: "السبت", short: "س" },
  { key: "sunday", label: "الأحد", short: "ح" },
  { key: "monday", label: "الإثنين", short: "ن" },
  { key: "tuesday", label: "الثلاثاء", short: "ث" },
  { key: "wednesday", label: "الأربعاء", short: "ر" },
  { key: "thursday", label: "الخميس", short: "خ" },
  { key: "friday", label: "الجمعة", short: "ج" },
];

export default function WeekForm({ id }: WeekFormProps) {
  const router = useRouter();
  const [week, setWeek] = useState<Week | null>(null);
  const [activeDay, setActiveDay] = useState<DayKey>("saturday");

  useEffect(() => {
    const foundWeek = getWeekById(id);
    if (!foundWeek) {
      router.replace("/");
      return;
    }
    setWeek(foundWeek);
  }, [id, router]);

  useEffect(() => {
    if (!week) {
      return;
    }

    const timer = window.setTimeout(() => {
      saveWeek(week);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [week]);

  const weekRange = useMemo(() => {
    if (!week) {
      return "";
    }
    return formatWeekRange(week.startDate, week.endDate);
  }, [week]);

  const handleDayChange = (
    dayKey: DayKey,
    field: keyof MealDay,
    value: MealDay[keyof MealDay],
  ) => {
    setWeek((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        days: {
          ...prev.days,
          [dayKey]: {
            ...prev.days[dayKey],
            [field]: value,
          },
        },
      };
    });
  };

  const handleNotesChange = (value: string) => {
    setWeek((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        notes: value,
      };
    });
  };

  const handleSessionToggle = (type: "workout" | "cardio", index: number) => {
    setWeek((prev) => {
      if (!prev) {
        return prev;
      }

      if (type === "workout") {
        const workoutSessions = [...prev.workoutSessions];
        workoutSessions[index] = !workoutSessions[index];
        return {
          ...prev,
          workoutSessions,
        };
      }

      const cardioSessions = [...prev.cardioSessions];
      cardioSessions[index] = !cardioSessions[index];
      return {
        ...prev,
        cardioSessions,
      };
    });
  };

  if (!week) {
    return null;
  }

  const activeDayMeta = DAYS.find((item) => item.key === activeDay) ?? DAYS[0];

  return (
    <main className="min-h-screen overflow-y-auto px-3 py-4 md:px-6 md:py-6">
      <header className="mb-4 flex items-center justify-between border border-[--color-border] bg-[--color-card] p-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm font-bold text-[--color-primary]"
        >
          <span>الرئيسية</span>
          <span aria-hidden>←</span>
        </button>

        <div className="rounded-sm bg-[--color-primary] px-4 py-1 text-sm font-extrabold text-white">
          تقرير الوجبات الأسبوعي
        </div>

        <div className="text-sm font-bold text-[--color-primary]">
          {weekRange}
        </div>
      </header>

      <section className="mb-4 md:hidden">
        <div className="mb-3 flex gap-1 border border-[--color-border] bg-white p-1">
          {DAYS.map((day) => (
            <button
              key={day.key}
              type="button"
              onClick={() => setActiveDay(day.key)}
              className={`flex-1 py-2 text-sm font-extrabold transition ${
                activeDay === day.key
                  ? "bg-[--color-primary] text-white"
                  : "bg-white text-[--color-muted]"
              }`}
            >
              {day.short}
            </button>
          ))}
        </div>

        <DayColumn
          dayKey={activeDayMeta.key}
          dayLabel={activeDayMeta.label}
          dayData={week.days[activeDayMeta.key]}
          onChange={handleDayChange}
        />
      </section>

      <section className="hidden overflow-x-auto md:block">
        <div
          className="grid gap-2"
          style={{
            minWidth: 1250,
            gridTemplateColumns:
              "repeat(7, minmax(140px, 1fr)) minmax(160px, 190px)",
          }}
        >
          {DAYS.map((day) => (
            <DayColumn
              key={day.key}
              dayKey={day.key}
              dayLabel={day.label}
              dayData={week.days[day.key]}
              onChange={handleDayChange}
            />
          ))}

          <aside className="space-y-4 border border-[--color-border] bg-[--color-card] p-3">
            <div>
              <div className="mb-2 flex items-center justify-between bg-[--color-primary] px-3 py-2 text-sm font-bold text-white">
                <span>🏋️</span>
                <span>التمرين</span>
              </div>
              <SessionToggle
                sessions={week.workoutSessions}
                onToggle={(index) => handleSessionToggle("workout", index)}
                type="workout"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between bg-[--color-accent] px-3 py-2 text-sm font-bold text-white">
                <span>🏃</span>
                <span>الكارديو</span>
              </div>
              <SessionToggle
                sessions={week.cardioSessions}
                onToggle={(index) => handleSessionToggle("cardio", index)}
                type="cardio"
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-4 md:hidden">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-[--color-border] bg-[--color-card] p-3">
            <div className="mb-2 flex items-center justify-between bg-[--color-primary] px-3 py-2 text-sm font-bold text-white">
              <span>🏋️</span>
              <span>التمرين</span>
            </div>
            <SessionToggle
              sessions={week.workoutSessions}
              onToggle={(index) => handleSessionToggle("workout", index)}
              type="workout"
            />
          </div>

          <div className="border border-[--color-border] bg-[--color-card] p-3">
            <div className="mb-2 flex items-center justify-between bg-[--color-accent] px-3 py-2 text-sm font-bold text-white">
              <span>🏃</span>
              <span>الكارديو</span>
            </div>
            <SessionToggle
              sessions={week.cardioSessions}
              onToggle={(index) => handleSessionToggle("cardio", index)}
              type="cardio"
            />
          </div>
        </div>
      </section>

      <BottomRow
        notes={week.notes}
        onChange={handleNotesChange}
      />

      <footer className="mt-6 flex items-center justify-end gap-2 pb-4 text-left text-sm font-extrabold italic text-[--color-highlight]">
        <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M19.2 1.8 6.4 18.2h7.7L12.8 30.2l12.8-16.4h-7.7z" />
        </svg>
        <span>ADVANCE LIKE LIGHTNING</span>
      </footer>
    </main>
  );
}
