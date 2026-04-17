"use client";

interface BottomRowProps {
  notes: string;
  onChange: (value: string) => void;
}

const FIELD_STYLES =
  "w-full border-0 border-b border-[--color-border] bg-transparent px-0 py-1 text-[13px] text-[--color-text] outline-none transition focus:border-[--color-accent] focus:bg-slate-100";

export default function BottomRow({ notes, onChange }: BottomRowProps) {
  return (
    <section className="mt-4">
      <div className="border border-[--color-border] bg-[--color-card] p-3">
        <label className="mb-2 block text-sm font-bold text-[--color-primary]">
          ملاحظات
        </label>
        <textarea
          value={notes}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className={FIELD_STYLES}
        />
      </div>
    </section>
  );
}
