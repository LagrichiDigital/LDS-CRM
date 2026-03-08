import Link from "next/link";

import { AdminDashboardContent } from "./AdminDashboardContent";
import { AdminPageHeader } from "./AdminPageHeader";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";
import { getAppointmentListByBusiness } from "@/lib/actions/appointment.actions";
import { getServicesByBusiness } from "@/lib/actions/service.actions";
import { hasBusinessAdminAccess } from "@/lib/actions/admin-auth.actions";

export default async function BusinessAdminPage({
  params: { businessId },
}: SearchParamProps) {
  const business = await getBusinessBySlugOrId(businessId);
  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-dark-700">Business not found.</p>
      </div>
    );
  }

  let appointments: Awaited<ReturnType<typeof getAppointmentListByBusiness>> = {
    totalCount: 0,
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    completedCount: 0,
    documents: [],
  };
  let services: Awaited<ReturnType<typeof getServicesByBusiness>> = [];
  let loadError: string | null = null;

  try {
    const [a, s] = await Promise.all([
      getAppointmentListByBusiness(business.$id),
      getServicesByBusiness(business.$id),
    ]);
    appointments = a;
    services = s;
  } catch (err) {
    console.error("Admin page load error:", err);
    loadError = "We couldn't load the dashboard. Please try again.";
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-dark-700 text-center">{loadError}</p>
        <Link
          href={`/b/${businessId}/admin`}
          className="text-16-semibold text-green-500 hover:underline"
        >
          Try again
        </Link>
      </div>
    );
  }

  const documents = Array.isArray(appointments.documents)
    ? appointments.documents
    : [];

  return (
    <AdminPageHeader businessId={businessId} businessName={business.name}>
      <AdminDashboardContent
        business={business}
        businessId={businessId}
        appointments={documents}
        services={services}
      />
    </AdminPageHeader>
  );
}
