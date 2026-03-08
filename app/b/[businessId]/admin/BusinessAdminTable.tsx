"use client";

import { getAdminColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Appointment } from "@/types/appwrite.types";
import { Service } from "@/types/appwrite.types";

type BusinessAdminTableProps = {
  businessId: string;
  data: Appointment[];
  services: Service[];
  allAppointments: Appointment[];
  timezone: string;
  canUseClientProfiles?: boolean;
  emptyMessage?: string;
};

export function BusinessAdminTable({
  businessId,
  data,
  services,
  allAppointments,
  timezone,
  canUseClientProfiles = false,
  emptyMessage,
}: BusinessAdminTableProps) {
  const columns = getAdminColumns(
    businessId,
    services,
    allAppointments,
    timezone,
    canUseClientProfiles
  );
  return <DataTable columns={columns} data={data} emptyMessage={emptyMessage} />;
}
