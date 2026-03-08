import Link from "next/link";

import { AdminPageHeader } from "../../AdminPageHeader";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";
import { getClient } from "@/lib/actions/client.actions";
import { getAppointmentListByBusiness } from "@/lib/actions/appointment.actions";
import { getServicesByBusiness } from "@/lib/actions/service.actions";
import { hasBusinessAdminAccess } from "@/lib/actions/admin-auth.actions";
import { canUseClientProfiles } from "@/lib/plan";
import { formatDateTime } from "@/lib/utils";
import { ClientProfileContent } from "./ClientProfileContent";

export default async function AdminClientProfilePage({
  params: { businessId, clientId },
}: SearchParamProps) {
  const business = await getBusinessBySlugOrId(businessId);
  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-dark-700">Business not found.</p>
      </div>
    );
  }

  if (!canUseClientProfiles(business)) {
    return (
      <AdminPageHeader
        businessId={businessId}
        businessName={business.name}
        pageTitle="admin.clientsTitle"
        pageSubtitle="admin.clientsSubtitle"
      >
        <div className="rounded-2xl border border-dark-500 bg-dark-400/70 p-6">
          <p className="text-dark-700">Client profiles are available on the Business plan.</p>
          <Link
            href={`/b/${businessId}/admin`}
            className="mt-4 inline-block text-green-500 hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      </AdminPageHeader>
    );
  }

  const [client, appointmentData, services] = await Promise.all([
    getClient(clientId),
    getAppointmentListByBusiness(business.$id),
    getServicesByBusiness(business.$id),
  ]);

  if (!client || client.businessId !== business.$id) {
    return (
      <AdminPageHeader
        businessId={businessId}
        businessName={business.name}
        pageTitle="admin.clientsTitle"
        pageSubtitle="admin.clientsSubtitle"
      >
        <div className="rounded-2xl border border-dark-500 bg-dark-400/70 p-6">
          <p className="text-dark-700">Client not found.</p>
          <Link
            href={`/b/${businessId}/admin/clients`}
            className="mt-4 inline-block text-green-500 hover:underline"
          >
            Back to clients
          </Link>
        </div>
      </AdminPageHeader>
    );
  }

  const timezone = business.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const clientAppointments = (appointmentData.documents ?? []).filter(
    (a: { clientId?: string | null }) => a.clientId === clientId
  );
  const guestAppointments = (appointmentData.documents ?? []).filter(
    (a: { guestEmail?: string; clientId?: string | null }) =>
      !a.clientId && a.guestEmail?.toLowerCase() === client.email?.toLowerCase()
  );
  const allRelevantAppointments = [...clientAppointments, ...guestAppointments];

  return (
    <AdminPageHeader
      businessId={businessId}
      businessName={business.name}
      pageTitle="admin.clientProfileTitle"
      pageSubtitle="admin.clientProfileSubtitle"
    >
      <ClientProfileContent
        businessId={businessId}
        client={client}
        appointments={allRelevantAppointments}
        services={services}
        timezone={timezone}
      />
    </AdminPageHeader>
  );
}
