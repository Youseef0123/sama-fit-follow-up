"use client";

interface SessionToggleProps {
  sessions: boolean[];
  onToggle: (index: number) => void;
  type: "workout" | "cardio";
}

export default function SessionToggle({
  sessions,
  onToggle,
  type,
}: SessionToggleProps) {
  const checkedClasses =
    type === "workout"
      ? "bg-[#1E3A5F] border-[#1E3A5F]"
      : "bg-[#F59E0B] border-[#F59E0B]";

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {sessions.map((checked, index) => (
        <div
          key={index}
          role="button"
          tabIndex={0}
          onClick={() => onToggle(index)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onToggle(index);
            }
          }}
          className={`h-11 w-11 shrink-0 cursor-pointer rounded-lg border-2 flex items-center justify-center transition-all duration-200 ease-in-out ${
            checked
              ? checkedClasses
              : "bg-white border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#EFF6FF] hover:scale-105"
          }`}
          aria-label={`session-${index + 1}`}
          aria-pressed={checked}
        >
          {checked && (
            <svg
              width="20"
              height="20"
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
      ))}
    </div>
  );
}
