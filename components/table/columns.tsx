"use client";

import { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { Service } from "@/types/appwrite.types";

import { AppointmentModal } from "../AppointmentModal";
import { GuestHistoryModal } from "../GuestHistoryModal";
import { GuestNoteCell } from "../GuestNoteCell";
import { StaffNotesCell } from "../StaffNotesCell";
import { StatusBadge } from "../StatusBadge";

/** Build admin table columns for a given business (tenant). */
export function getAdminColumns(
  businessId: string,
  services: Service[] = [],
  allAppointments: Appointment[] = [],
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
  canUseClientProfiles: boolean = false
): ColumnDef<Appointment>[] {
  return [
    {
      header: "#",
      cell: ({ row }) => (
        <p className="text-14-medium">{row.index + 1}</p>
      ),
    },
    {
      accessorKey: "guestName",
      header: "Guest",
      cell: ({ row }) => {
        const a = row.original;
        return (
          <GuestHistoryModal
            appointment={a}
            allAppointments={allAppointments}
            services={services}
            businessId={businessId}
            timezone={timezone}
            canUseClientProfiles={canUseClientProfiles}
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="min-w-[115px]">
          <StatusBadge status={row.original.status} />
        </div>
      ),
    },
    {
      accessorKey: "schedule",
      header: "Date & time",
      cell: ({ row }) => (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(row.original.schedule).dateTime}
        </p>
      ),
    },
    {
      accessorKey: "serviceId",
      header: "Service",
      cell: ({ row }) => {
        const service = services.find((s) => s.$id === row.original.serviceId);
        return (
          <p className="text-14-regular">
            {service?.name ?? row.original.serviceId}
          </p>
        );
      },
    },
    {
      accessorKey: "note",
      header: "Guest note",
      cell: ({ row }) => <GuestNoteCell appointment={row.original} />,
    },
    {
      accessorKey: "staffNotes",
      header: "Staff note",
      cell: ({ row }) => (
        <StaffNotesCell
          appointment={row.original}
          businessId={businessId}
        />
      ),
    },
    {
      id: "actions",
      header: () => <div className="pl-4">Actions</div>,
      cell: ({ row }) => {
        const appointment = row.original;
        const isScheduled = appointment.status === "scheduled";
        const isCompleted = appointment.status === "completed";
        const isCancelled = appointment.status === "cancelled";
        return (
          <div className="flex flex-wrap items-center gap-1">
            {isCompleted && (
              <span className="text-14-regular text-dark-600">Completed</span>
            )}
            {isCancelled && (
              <span className="text-14-regular text-dark-600">Cancelled</span>
            )}
            {isScheduled && (
              <>
                <AppointmentModal
                  businessId={businessId}
                  appointment={appointment}
                  type="complete"
                  title="Mark as completed"
                  description="Mark this appointment as completed? No notification will be sent."
                />
                <AppointmentModal
                  businessId={businessId}
                  appointment={appointment}
                  type="cancel"
                  title="Cancel appointment"
                  description="Cancel this appointment? The guest will be notified by SMS."
                />
              </>
            )}
            {appointment.status === "pending" && (
              <>
                <AppointmentModal
                  businessId={businessId}
                  appointment={appointment}
                  type="schedule"
                  title="Confirm booking"
                  description="Confirm this booking? An SMS will be sent to the guest."
                />
                <AppointmentModal
                  businessId={businessId}
                  appointment={appointment}
                  type="cancel"
                  title="Cancel appointment"
                  description="Cancel this appointment? The guest will be notified by SMS."
                />
              </>
            )}
          </div>
        );
      },
    },
  ];
}
