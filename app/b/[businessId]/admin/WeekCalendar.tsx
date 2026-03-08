"use client";

import { useMemo } from "react";

import { formatDateTime, getWeekDateStrings, isScheduleOnDate } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { Service } from "@/types/appwrite.types";

type StatusFilter = "scheduled" | "pending" | "completed";

type WeekCalendarProps = {
  selectedDate: string;
  timezone: string;
  /** Show only appointments with this status in the week view. */
  statusFilter: StatusFilter;
  appointments: Appointment[];
  services: Service[];
  onSelectDate: (dateStr: string) => void;
};

export function WeekCalendar({
  selectedDate,
  timezone,
  statusFilter,
  appointments,
  services,
  onSelectDate,
}: WeekCalendarProps) {
  const weekDays = useMemo(
    () => getWeekDateStrings(selectedDate, timezone),
    [selectedDate, timezone]
  );

  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const dateStr of weekDays) {
      map[dateStr] = appointments
        .filter(
          (a) =>
            a.status === statusFilter &&
            isScheduleOnDate(a.schedule, dateStr, timezone)
        )
        .sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime());
    }
    return map;
  }, [appointments, timezone, weekDays, statusFilter]);

  const getServiceName = (serviceId: string) =>
    services.find((s) => s.$id === serviceId)?.name ?? serviceId;

  return (
    <div className="rounded-2xl border border-dark-500 bg-dark-400/60 overflow-hidden">
      {/* Mobile view: Stacked list */}
      <div className="block sm:hidden divide-y divide-dark-500">
        {weekDays.map((dateStr) => {
          const d = new Date(dateStr + "T12:00:00");
          const isSelected = dateStr === selectedDate;
          const dayName = d.toLocaleDateString("en-US", { weekday: "long", timeZone: timezone });
          const dayNum = d.toLocaleDateString("en-US", { day: "numeric", month: "short", timeZone: timezone });
          const dayAppointmentsList = appointmentsByDay[dateStr] ?? [];

          return (
            <div key={dateStr} className={`p-4 ${isSelected ? "bg-green-500/5" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <span className={`text-14-semibold ${isSelected ? "text-green-500" : "text-white"}`}>
                    {dayName}
                  </span>
                  <span className="text-12-regular text-dark-600">{dayNum}</span>
                </div>
                {dayAppointmentsList.length > 0 && (
                  <span className="rounded-full bg-dark-500 px-2 py-0.5 text-12-medium text-dark-700">
                    {dayAppointmentsList.length}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {dayAppointmentsList.length === 0 ? (
                  <p className="text-12-regular text-dark-600 italic py-1">No appointments</p>
                ) : (
                  dayAppointmentsList.map((a) => (
                    <div
                      key={a.$id}
                      className="rounded-xl border border-dark-500 bg-dark-300/80 p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-14-semibold text-white">
                          {formatDateTime(a.schedule, timezone).timeOnly}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-10-medium uppercase tracking-wider ${
                            a.status === "pending"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-green-500/20 text-green-500"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <p className="text-14-medium text-white">{a.guestName}</p>
                      <p className="text-12-regular text-dark-600">
                        {getServiceName(a.serviceId)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop view: Horizontal grid */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="grid grid-cols-7 min-w-[700px] border-b border-dark-500">
          {weekDays.map((dateStr) => {
            const d = new Date(dateStr + "T12:00:00");
            const isSelected = dateStr === selectedDate;
            const dayName = d.toLocaleDateString("en-US", { weekday: "short", timeZone: timezone });
            const dayNum = d.toLocaleDateString("en-US", { day: "numeric", timeZone: timezone });
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => onSelectDate(dateStr)}
                className={`
                  min-w-0 p-3 text-center border-r border-dark-500 last:border-r-0
                  transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset
                  ${isSelected ? "bg-green-500/20 text-green-500 font-semibold" : "text-dark-700 hover:bg-dark-500/50"}
                `}
              >
                <span className="block text-12-regular uppercase">{dayName}</span>
                <span className="block text-16-semibold">{dayNum}</span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-7 min-w-[700px] min-h-[300px]">
          {weekDays.map((dateStr) => (
            <div
              key={dateStr}
              className="border-r border-dark-500 last:border-r-0 p-2 min-h-[200px] overflow-y-auto"
            >
              {(appointmentsByDay[dateStr] ?? []).map((a) => (
                <div
                  key={a.$id}
                  className="mb-2 rounded border border-dark-500 bg-dark-300/80 px-2 py-1.5 text-left shadow-sm"
                >
                  <p className="text-12-regular text-dark-600 truncate">
                    {formatDateTime(a.schedule, timezone).timeOnly}
                  </p>
                  <p className="text-14-medium text-white truncate">{a.guestName}</p>
                  <p className="text-12-regular text-dark-600 truncate">
                    {getServiceName(a.serviceId)}
                  </p>
                  <span
                    className={`inline-block mt-1 rounded px-1.5 py-0.5 text-10-medium uppercase tracking-wider ${
                      a.status === "pending"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-green-500/20 text-green-500"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
