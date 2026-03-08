import clsx from "clsx";
import Image from "next/image";

type StatCardProps = {
  type: "appointments" | "pending" | "cancelled" | "completed" | "earnings" | "week";
  count?: number;
  label: string;
  icon: string;
  /** For earnings tile: formatted currency string (e.g. "$1,234"). When set, displayed instead of count. */
  displayValue?: string;
};

export const StatCard = ({ count = 0, label, icon, type, displayValue }: StatCardProps) => {
  const isAnalytics = type === "earnings" || type === "week";
  const value = displayValue ?? String(count);

  return (
    <div
      className={clsx("stat-card", {
        "stat-card--analytics": isAnalytics,
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
        "bg-completed": type === "completed",
        "rounded-2xl border border-dark-500 bg-dark-400/90 p-6 shadow-lg": isAnalytics,
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt=""
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{value}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};
