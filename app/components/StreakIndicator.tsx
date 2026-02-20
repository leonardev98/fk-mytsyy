"use client";

type StreakIndicatorProps = {
  days: number;
  label?: string;
  size?: "sm" | "md";
};

export function StreakIndicator({
  days,
  label = "Racha actual",
  size = "md",
}: StreakIndicatorProps) {
  const isSm = size === "sm";
  return (
    <div className="flex items-center gap-2">
      <span
        className={isSm ? "text-lg" : "text-2xl"}
        aria-hidden
      >
        🔥
      </span>
      <div>
        <p
          className={`font-semibold text-text-primary ${isSm ? "text-sm" : "text-lg"}`}
        >
          {days} {days === 1 ? "día" : "días"} construyendo
        </p>
        {label && (
          <p className={`text-text-secondary ${isSm ? "text-[10px]" : "text-xs"}`}>
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
