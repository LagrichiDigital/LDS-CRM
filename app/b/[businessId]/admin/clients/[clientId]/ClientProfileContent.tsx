"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Client } from "@/types/appwrite.types";
import { Service } from "@/types/appwrite.types";
import { updateClientNotes } from "@/lib/actions/client.actions";
import { formatDateTime } from "@/lib/utils";

type ClientProfileContentProps = {
  businessId: string;
  client: Client;
  appointments: Array<{
    $id: string;
    schedule: string;
    serviceId: string;
    status: string;
    guestName?: string;
  }>;
  services: Service[];
  timezone: string;
};

export function ClientProfileContent({
  businessId,
  client,
  appointments,
  services,
  timezone,
}: ClientProfileContentProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(client.notes ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    await updateClientNotes(client.$id, businessId, notes);
    setIsSaving(false);
    router.refresh();
  };

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.schedule).getTime() - new Date(a.schedule).getTime()
  );

  return (
    <section className="w-full space-y-8">
      <Link
        href={`/b/${businessId}/admin/clients`}
        className="inline-flex items-center gap-2 text-14-medium text-dark-700 hover:text-white"
      >
        ← Back to clients
      </Link>

      <div className="space-y-3 rounded-2xl border border-dark-500 bg-dark-400/70 p-5 shadow-lg">
        <h2 className="sub-header">Client details</h2>
        <dl className="grid gap-3 text-14-regular text-dark-700 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-white">Name</dt>
            <dd>{client.name}</dd>
          </div>
          <div>
            <dt className="font-semibold text-white">Email</dt>
            <dd>{client.email}</dd>
          </div>
          <div>
            <dt className="font-semibold text-white">Phone</dt>
            <dd>{client.phone}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-3 rounded-2xl border border-dark-500 bg-dark-400/70 p-5 shadow-lg">
        <h2 className="sub-header">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this client..."
          className="shad-textArea w-full rounded-md px-3 py-2"
          rows={4}
        />
        <button
          type="button"
          onClick={handleSaveNotes}
          disabled={isSaving}
          className="shad-primary-btn rounded-lg px-4 py-2 text-14-semibold"
        >
          {isSaving ? "Saving..." : "Save notes"}
        </button>
      </div>

      <div className="space-y-3 rounded-2xl border border-dark-500 bg-dark-400/70 p-5 shadow-lg">
        <h2 className="sub-header">Appointment history</h2>
        {sortedAppointments.length === 0 ? (
          <p className="text-dark-700 text-sm">No appointments yet.</p>
        ) : (
          <ul className="space-y-2">
            {sortedAppointments.map((apt) => {
              const service = services.find((s) => s.$id === apt.serviceId);
              const formatted = formatDateTime(apt.schedule, timezone);
              return (
                <li
                  key={apt.$id}
                  className="flex items-center justify-between rounded-md border border-dark-500 bg-dark-300 px-3 py-2"
                >
                  <div>
                    <span className="font-medium text-white">
                      {service?.name ?? "Unknown service"}
                    </span>
                    <span className="ml-2 text-dark-600">
                      {formatted.dateTime}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      apt.status === "completed"
                        ? "bg-green-500/20 text-green-500"
                        : apt.status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-dark-500 text-dark-700"
                    }`}
                  >
                    {apt.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
