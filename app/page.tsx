"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeekCard from "@/components/WeekCard";
import { createNewWeek, getAllWeeks, saveWeek } from "@/lib/storage";
import { Week } from "@/lib/types";
import { generateWeekId, getNextSaturday } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getAllWeeks()
      .then((data) => {
        if (!mounted) {
          return;
        }
        setWeeks(data);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const hasWeeks = weeks.length > 0;

  const handleCreateWeek = async () => {
    const nextSaturday = getNextSaturday(new Date());
    const nextId = generateWeekId(nextSaturday);
    const existing = weeks.find((week) => week.id === nextId);

    if (existing) {
      router.push(`/week/${existing.id}`);
      return;
    }

    const week = createNewWeek(nextSaturday);
    await saveWeek(week);
    setWeeks((prev) =>
      [week, ...prev].sort((a, b) => (a.startDate < b.startDate ? 1 : -1)),
    );
    router.push(`/week/${week.id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1E3A5F] border-t-transparent" />
        <div className="text-sm text-[#64748B]">جارٍ تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-14 md:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(37,99,235,0.06),transparent_36%),radial-gradient(circle_at_82%_88%,rgba(245,158,11,0.07),transparent_30%)]" />

      <div className="absolute left-4 top-5 z-20 text-left md:left-8 md:top-8">
        <div className="text-2xl font-extrabold tracking-[0.08em] text-[--color-primary]">
          SAMAFIT
        </div>
        <div className="text-[11px] font-bold tracking-[0.24em] text-[--color-highlight]">
          FITNESS · NUTRITION · LIFESTYLE
        </div>
      </div>

      <section className="relative z-10 w-full max-w-4xl border border-[--color-border] bg-[--color-card] p-6 shadow-[0_22px_60px_rgba(15,23,42,0.09)] md:p-10">
        <div className="mb-8 flex items-start justify-end gap-4">
          <button
            type="button"
            onClick={handleCreateWeek}
            className="border border-[--color-primary] bg-[--color-primary] px-4 py-2 text-sm font-bold text-white transition hover:bg-[--color-accent]"
          >
            + أسبوع جديد
          </button>
        </div>

        <h1 className="mb-6 text-3xl font-extrabold leading-tight text-[--color-text] md:text-4xl">
          تقارير الوجبات الأسبوعية
        </h1>

        {!hasWeeks ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-[--color-border] bg-slate-50 px-6 py-10 text-center">
            <svg
              viewBox="0 0 64 64"
              className="mb-4 h-14 w-14 text-[--color-primary]"
              fill="none"
              aria-hidden
            >
              <path
                d="M22 20a10 10 0 0 1 20 0v3h2a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8V31a8 8 0 0 1 8-8h2v-3Z"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <circle cx="24" cy="18" r="3" fill="currentColor" />
              <circle cx="40" cy="18" r="3" fill="currentColor" />
            </svg>
            <p className="text-sm font-bold text-[--color-muted]">
              لا توجد تقارير بعد — ابدأ أسبوعك الأول!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {weeks.map((week) => (
              <WeekCard
                key={week.id}
                week={week}
                onClick={() => router.push(`/week/${week.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
