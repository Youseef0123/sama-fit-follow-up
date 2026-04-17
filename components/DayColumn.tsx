"use client";

import { DayKey, MealDay } from "@/lib/types";

interface DayColumnProps {
  dayKey: DayKey;
  dayLabel: string;
  dayData: MealDay;
  onChange: (
    dayKey: DayKey,
    field: keyof MealDay,
    value: MealDay[keyof MealDay],
  ) => void;
}

const FIELD_STYLES =
  "w-full border-0 border-b border-[--color-border] bg-transparent px-0 py-1 text-[13px] text-[--color-text] outline-none transition focus:border-[--color-accent] focus:bg-slate-100";

function MealToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] py-2">
      <div
        role="checkbox"
        tabIndex={0}
        aria-checked={checked}
        onClick={() => onToggle(!checked)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle(!checked);
          }
        }}
        className={`h-7 w-7 shrink-0 cursor-pointer rounded-md border-2 flex items-center justify-center transition-all duration-200 ease-in-out ${
          checked
            ? "bg-[#1E3A5F] border-[#1E3A5F]"
            : "bg-white border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#EFF6FF] hover:scale-105"
        }`}
      >
        {checked && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 8L6.5 11.5L13 4.5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-[#64748B]">{label}</span>
    </div>
  );
}

export default function DayColumn({
  dayKey,
  dayLabel,
  dayData,
  onChange,
}: DayColumnProps) {
  return (
    <section className="border border-[--color-border] bg-[--color-card] p-3">
      <div className="mb-3 border-b border-[--color-border] pb-2 text-center text-sm font-extrabold text-[--color-primary]">
        {dayLabel}
      </div>

      <div className="space-y-2.5">
        <MealToggleRow
          label="فطار"
          checked={dayData.breakfast}
          onToggle={(checked) => onChange(dayKey, "breakfast", checked)}
        />

        <MealToggleRow
          label="غداء"
          checked={dayData.lunch}
          onToggle={(checked) => onChange(dayKey, "lunch", checked)}
        />

        <MealToggleRow
          label="عشاء"
          checked={dayData.dinner}
          onToggle={(checked) => onChange(dayKey, "dinner", checked)}
        />

        <MealToggleRow
          label="سناك"
          checked={dayData.snack}
          onToggle={(checked) => onChange(dayKey, "snack", checked)}
        />

        <MealToggleRow
          label="قبل التمرين"
          checked={dayData.preWorkout}
          onToggle={(checked) => onChange(dayKey, "preWorkout", checked)}
        />

        <MealToggleRow
          label="بعد التمرين"
          checked={dayData.postWorkout}
          onToggle={(checked) => onChange(dayKey, "postWorkout", checked)}
        />

        <div>
          <label className="mb-1 block text-right text-[11px] text-[--color-muted]">
            المياه قد ايه؟
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={dayData.water}
              onChange={(event) =>
                onChange(dayKey, "water", event.target.value)
              }
              className={FIELD_STYLES}
              min="0"
              step="0.5"
            />
            <span className="text-xs text-[--color-muted]">لتر</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-right text-[11px] text-[--color-muted]">
            مدة النوم
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={dayData.sleepHours}
              onChange={(event) =>
                onChange(dayKey, "sleepHours", event.target.value)
              }
              className={FIELD_STYLES}
              placeholder="٠"
              min="0"
              max="24"
            />
            <span className="text-xs text-[--color-muted]">ساعة</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-right text-[11px] text-[--color-muted]">
            الفيتامينات
          </label>
          <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] py-2">
            <div
              role="checkbox"
              tabIndex={0}
              aria-checked={dayData.vitamins}
              onClick={() => onChange(dayKey, "vitamins", !dayData.vitamins)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onChange(dayKey, "vitamins", !dayData.vitamins);
                }
              }}
              className={`h-7 w-7 shrink-0 cursor-pointer rounded-md border-2 flex items-center justify-center transition-all duration-200 ease-in-out ${
                dayData.vitamins
                  ? "bg-[#1E3A5F] border-[#1E3A5F]"
                  : "bg-white border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#EFF6FF] hover:scale-105"
              }`}
            >
              {dayData.vitamins && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 8L6.5 11.5L13 4.5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-[#64748B]">تم أخذ الفيتامينات</span>
          </div>
        </div>
      </div>
    </section>
  );
}
