"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { Service } from "@/types/appwrite.types";
import { createClientFromAppointment } from "@/lib/actions/client.actions";
import { StatusBadge } from "./StatusBadge";

type GuestHistoryModalProps = {
  appointment: Appointment;
  allAppointments: Appointment[];
  services: Service[];
  businessId: string;
  timezone: string;
  canUseClientProfiles?: boolean;
};

export function GuestHistoryModal({
  appointment,
  allAppointments,
  services,
  businessId,
  timezone,
  canUseClientProfiles = false,
}: GuestHistoryModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const guestAppointments = useMemo(() => {
    const match = allAppointments.filter(
      (a) =>
        a.guestEmail === appointment.guestEmail ||
        a.guestPhone === appointment.guestPhone
    );
    return [...match].sort(
      (a, b) => new Date(b.schedule).getTime() - new Date(a.schedule).getTime()
    );
  }, [allAppointments, appointment.guestEmail, appointment.guestPhone]);

  const getServiceName = (serviceId: string) =>
    services.find((s) => s.$id === serviceId)?.name ?? serviceId;

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateClient = async () => {
    if (!appointment.guestName || !appointment.guestEmail || !appointment.guestPhone) return;
    setIsCreating(true);
    const client = await createClientFromAppointment({
      businessId,
      name: appointment.guestName,
      email: appointment.guestEmail,
      phone: appointment.guestPhone,
    });
    setIsCreating(false);
    if (client) {
      router.push(`/b/${businessId}/admin/clients/${client.$id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-left text-14-medium text-green-500 hover:underline"
        >
          {appointment.guestName}
        </button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Guest history</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="space-y-1.5 text-14-regular">
            <p>
              <span className="text-dark-600">Name: </span>
              <span className="text-white">{appointment.guestName}</span>
            </p>
            {appointment.guestEmail && (
              <p>
                <span className="text-dark-600">Email: </span>
                <span className="text-white break-all">{appointment.guestEmail}</span>
              </p>
            )}
            <p>
              <span className="text-dark-600">Appointments: </span>
              <span className="text-white">{guestAppointments.length}</span>
            </p>
          </div>
          {canUseClientProfiles && (
            <div className="border-t border-dark-500 pt-4">
              <button
                type="button"
                onClick={handleCreateClient}
                disabled={isCreating}
                className="shad-primary-btn w-full rounded-lg px-4 py-2 text-14-semibold"
              >
                {isCreating ? "Creating..." : "Create client profile"}
              </button>
            </div>
          )}
          <div className="border-t border-dark-500 pt-4">
            <h3 className="text-14-semibold text-dark-700 mb-2">
              Appointment details
            </h3>
            <ul className="space-y-2 overflow-y-auto pr-1 -mr-1 max-h-[40vh]">
              {guestAppointments.map((a) => (
                <li
                  key={a.$id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-dark-500 bg-dark-400/50 p-3 text-14-regular"
                >
                  <span className="text-dark-600 min-w-[7rem]">
                    {formatDateTime(a.schedule, timezone).dateTime}
                  </span>
                  <span>{getServiceName(a.serviceId)}</span>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
