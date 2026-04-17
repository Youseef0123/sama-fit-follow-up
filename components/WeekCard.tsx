"use client";

import { Week } from "@/lib/types";
import { formatWeekRange, isWeekComplete } from "@/lib/utils";

interface WeekCardProps {
  week: Week;
  onClick: () => void;
}

export default function WeekCard({ week, onClick }: WeekCardProps) {
  const complete = isWeekComplete(week);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-[--color-border] bg-[--color-card] p-4 text-right transition hover:border-[--color-accent] hover:shadow-[0_8px_24px_rgba(30,58,95,0.08)]"
    >
      <div className="mb-2 text-sm font-bold text-[--color-primary]">
        الأسبوع من {formatWeekRange(week.startDate, week.endDate)}
      </div>
      <span
        className={`inline-flex items-center text-xs font-bold ${
          complete ? "text-[--color-highlight]" : "text-[--color-muted]"
        }`}
      >
        {complete ? "مكتمل ✓" : "جارٍ"}
      </span>
    </button>
  );
}
