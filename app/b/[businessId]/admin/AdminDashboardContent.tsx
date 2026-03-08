"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { canUseClientProfiles } from "@/lib/plan";
import { BusinessAdminTable } from "./BusinessAdminTable";
import { WeekCalendar } from "./WeekCalendar";
import { StatCard } from "@/components/StatCard";
import {
  cn,
  formatDateTime,
  formatCurrency,
  getTodayDateStringInTimezone,
  getWeekDateStrings,
  isScheduleOnDate,
} from "@/lib/utils";
import { Appointment, Business, Service } from "@/types/appwrite.types";

type StatusFilter = "scheduled" | "pending" | "completed";

type AdminDashboardContentProps = {
  business: Business;
  businessId: string;
  appointments: Appointment[];
  services: Service[];
};

export function AdminDashboardContent({
  business,
  businessId,
  appointments,
  services,
}: AdminDashboardContentProps) {
  const { t } = useLocale();
  const timezone = business.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [selectedDate, setSelectedDate] = useState(() =>
    getTodayDateStringInTimezone(timezone)
  );
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("scheduled");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllDatesForPending, setShowAllDatesForPending] = useState(false);
  const [showWholeWeek, setShowWholeWeek] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "week">("table");

  const { dayCounts, filtered, totalPendingCount, earningsToday, earningsNext7Days, weekDateRangeLabel } = useMemo(() => {
    const totalPending = appointments.filter((a) => a.status === "pending").length;
    const useAllDatesForPending = showAllDatesForPending && selectedStatus === "pending";
    const weekDates = getWeekDateStrings(selectedDate, timezone);
    const useWeekRange = showWholeWeek && !useAllDatesForPending;
    const day = useAllDatesForPending
      ? appointments
      : useWeekRange
        ? appointments.filter((a) =>
            weekDates.some((d) => isScheduleOnDate(a.schedule, d, timezone))
          )
        : appointments.filter((a) =>
            isScheduleOnDate(a.schedule, selectedDate, timezone)
          );
    const counts = {
      scheduled: useAllDatesForPending
        ? 0
        : day.filter((a) => a.status === "scheduled").length,
      pending: useAllDatesForPending ? totalPending : day.filter((a) => a.status === "pending").length,
      completed: useAllDatesForPending
        ? 0
        : day.filter((a) => a.status === "completed").length,
    };
    let list = day.filter((a) => a.status === selectedStatus);
    if ((useAllDatesForPending || useWeekRange) && list.length > 0) {
      list = [...list].sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime());
    }
    const weekDateRangeLabel = useWeekRange && weekDates.length === 7
      ? `${new Date(weekDates[0] + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${new Date(weekDates[6] + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
      : null;

    const todayStr = getTodayDateStringInTimezone(timezone);
    // Actual revenue: completed appointments (not scheduled/upcoming).
    const completedToday = appointments.filter(
      (a) => a.status === "completed" && isScheduleOnDate(a.schedule, todayStr, timezone)
    );
    const earningsTodaySum = completedToday.reduce((sum, a) => {
      const service = services.find((s) => s.$id === a.serviceId);
      return sum + (service?.price ?? 0);
    }, 0);

    // Earnings for the current calendar week (Monday–Sunday): completed appointments only.
    const earningsWeekDates = getWeekDateStrings(todayStr, timezone);
    const completedThisWeek = appointments.filter((a) => {
      if (a.status !== "completed") return false;
      return earningsWeekDates.some((d) => isScheduleOnDate(a.schedule, d, timezone));
    });
    const earningsWeekSum = completedThisWeek.reduce((sum, a) => {
      const service = services.find((s) => s.$id === a.serviceId);
      return sum + (service?.price ?? 0);
    }, 0);

    return {
      dayAppointments: day,
      dayCounts: counts,
      filtered: list,
      totalPendingCount: totalPending,
      earningsToday: earningsTodaySum,
      earningsNext7Days: earningsWeekSum,
      weekDateRangeLabel,
    };
  }, [appointments, selectedDate, timezone, selectedStatus, showAllDatesForPending, showWholeWeek, services]);

  const showPending = () => {
    setSelectedStatus("pending");
    setShowAllDatesForPending(true);
  };

  const onDateChange = (date: string) => {
    setSelectedDate(date);
    setShowAllDatesForPending(false);
  };

  const onStatusChange = (status: StatusFilter) => {
    setSelectedStatus(status);
    if (status !== "pending") setShowAllDatesForPending(false);
  };

  const searchLower = searchQuery.trim().toLowerCase();
  const tableData = searchLower
    ? filtered.filter(
        (a) =>
          a.guestName?.toLowerCase().includes(searchLower) ||
          a.guestEmail?.toLowerCase().includes(searchLower) ||
          a.guestPhone?.includes(searchQuery.trim())
      )
    : filtered;

  const exportCsv = () => {
    const escape = (v: string) => {
      const s = String(v ?? "");
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const headers = [
      "Guest",
      "Email",
      "Phone",
      "Date & time",
      "Service",
      "Status",
      "Guest note",
      "Staff note",
    ];
    const rows = tableData.map((a) => {
      const service = services.find((s) => s.$id === a.serviceId);
      return [
        escape(a.guestName ?? ""),
        escape(a.guestEmail ?? ""),
        escape(a.guestPhone ?? ""),
        escape(formatDateTime(a.schedule, timezone).dateTime),
        escape(service?.name ?? a.serviceId),
        escape(a.status),
        escape(a.note ?? ""),
        escape(a.staffNotes ?? ""),
      ];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      showAllDatesForPending && selectedStatus === "pending"
        ? "appointments-pending.csv"
        : `appointments-${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="flex w-full flex-wrap items-center justify-start gap-4">
        <Link
          href={`/b/${businessId}/admin/book`}
          className="shad-primary-btn inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-14-semibold"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t("admin.bookAppointment")}
        </Link>
        <Link
          href={`/b/${businessId}/admin/settings`}
          className="admin-settings-cta rounded-lg border border-dark-500 bg-dark-400 px-4 py-2 text-14-medium text-white transition hover:bg-dark-500"
        >
          {t("admin.settingsLink")}
        </Link>
        {canUseClientProfiles(business) && (
          <Link
            href={`/b/${businessId}/admin/clients`}
            className="admin-settings-cta rounded-lg border border-dark-500 bg-dark-400 px-4 py-2 text-14-medium text-white transition hover:bg-dark-500"
          >
            {t("admin.clientsLink")}
          </Link>
        )}
      </section>

      {totalPendingCount > 0 && (
        <section className="rounded-2xl border border-green-500/30 bg-dark-400/80 shadow-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <p className="text-16-semibold text-white">
                  {totalPendingCount} pending request{totalPendingCount !== 1 ? "s" : ""}
                </p>
                <p className="text-14-regular text-dark-600">{t("admin.awaitingConfirmation")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={showPending}
              className="shad-primary-btn inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-14-semibold whitespace-nowrap"
            >
              {t("admin.viewPending")}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      )}

      <section className="w-full space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-0">
              <label className="text-14-medium text-dark-700">{t("admin.date")}</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="admin-filter-control w-full rounded border border-dark-500 bg-dark-400 px-2 py-1.5 text-white sm:ml-2 sm:w-auto"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-14-medium text-dark-700">
              <input
                type="checkbox"
                checked={showWholeWeek}
                onChange={(e) => setShowWholeWeek(e.target.checked)}
                className="h-4 w-4 rounded border-dark-500 bg-dark-400 text-green-500 focus:ring-green-500"
              />
              {t("admin.showWholeWeek")}
            </label>
          </div>
          <p className="text-dark-600 text-sm">
            {showAllDatesForPending && selectedStatus === "pending" ? (
              <>All dates · {tableData.length} pending</>
            ) : showWholeWeek && weekDateRangeLabel ? (
              <>
                {weekDateRangeLabel} · {tableData.length}
                {searchLower && ` of ${filtered.length}`}{" "}
                {selectedStatus}
              </>
            ) : (
              <>
                Showing{" "}
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                · {tableData.length}
                {searchLower && ` of ${filtered.length}`}{" "}
                {selectedStatus}
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder={t("admin.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-filter-control w-full max-w-sm rounded border border-dark-500 bg-dark-400 px-3 py-2 text-14-regular text-white placeholder:text-dark-600 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={exportCsv}
            className="admin-filter-control rounded border border-dark-500 bg-dark-400 px-4 py-2 text-14-medium text-white transition hover:bg-dark-500"
          >
            {t("admin.exportCsv")}
          </button>
        </div>
      </section>

      <section className="admin-stat">
        <button
          type="button"
          onClick={() => onStatusChange("scheduled")}
          className={cn(
            "min-w-0 flex-1 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-dark-300",
            selectedStatus === "scheduled" && "ring-2 ring-green-500 ring-offset-2 ring-offset-dark-300"
          )}
        >
          <StatCard
            type="appointments"
            count={dayCounts.scheduled}
            label={t("admin.scheduled")}
            icon="/assets/icons/appointments.svg"
          />
        </button>
        <button
          type="button"
          onClick={() => (totalPendingCount > 0 ? showPending() : onStatusChange("pending"))}
          className={cn(
            "min-w-0 flex-1 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-dark-300",
            selectedStatus === "pending" && "ring-2 ring-green-500 ring-offset-2 ring-offset-dark-300"
          )}
        >
          <StatCard
            type="pending"
            count={totalPendingCount}
            label={t("admin.pending")}
            icon="/assets/icons/pending.svg"
          />
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("completed")}
          className={cn(
            "min-w-0 flex-1 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-dark-300",
            selectedStatus === "completed" && "ring-2 ring-green-500 ring-offset-2 ring-offset-dark-300"
          )}
        >
          <StatCard
            type="completed"
            count={dayCounts.completed}
            label={t("admin.completed")}
            icon="/assets/icons/check.svg"
          />
        </button>
      </section>

      <section className="admin-stat">
        <StatCard
          type="earnings"
          label={t("admin.earningsToday")}
          icon="/assets/icons/earnings.svg"
          displayValue={formatCurrency(earningsToday, business.currency)}
        />
        <StatCard
          type="earnings"
          label={t("admin.earningsNext7")}
          icon="/assets/icons/earnings.svg"
          displayValue={formatCurrency(earningsNext7Days, business.currency)}
        />
      </section>

      <section className="w-full space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "rounded-lg border px-4 py-2 text-14-medium transition",
              viewMode === "table"
                ? "border-green-500 bg-green-500/20 text-green-500"
                : "border-dark-500 bg-dark-400 text-dark-700 hover:bg-dark-500"
            )}
          >
            {t("admin.table")}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("week")}
            className={cn(
              "rounded-lg border px-4 py-2 text-14-medium transition",
              viewMode === "week"
                ? "border-green-500 bg-green-500/20 text-green-500"
                : "border-dark-500 bg-dark-400 text-dark-700 hover:bg-dark-500"
            )}
          >
            {t("admin.week")}
          </button>
        </div>
        {viewMode === "week" && (
          <WeekCalendar
            selectedDate={selectedDate}
            timezone={timezone}
            statusFilter={selectedStatus}
            appointments={appointments}
            services={services}
            onSelectDate={(dateStr) => {
              setSelectedDate(dateStr);
              setShowAllDatesForPending(false);
            }}
          />
        )}
      </section>

      {viewMode === "table" && (
      <BusinessAdminTable
        businessId={businessId}
        data={tableData}
        services={services}
        allAppointments={appointments}
        timezone={timezone}
        canUseClientProfiles={canUseClientProfiles(business)}
        emptyMessage={
          appointments.length === 0
            ? t("admin.noAppointments")
            : t("admin.noAppointmentsFilter")
        }
      />
      )}
    </>
  );
}
