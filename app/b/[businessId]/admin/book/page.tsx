import Link from "next/link";

import { AdminPageHeader } from "../AdminPageHeader";
import { getAppointmentListByBusiness } from "@/lib/actions/appointment.actions";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";
import { getServicesByBusiness } from "@/lib/actions/service.actions";
import { Appointment } from "@/types/appwrite.types";

import { AdminBookBackLink } from "./AdminBookBackLink";
import { AdminBookForm } from "./AdminBookForm";

export default async function AdminBookPage({
  params: { businessId },
}: SearchParamProps) {
  let business: Awaited<ReturnType<typeof getBusinessBySlugOrId>> = null;
  let services: Awaited<ReturnType<typeof getServicesByBusiness>> = [];
  let appointmentData: Awaited<ReturnType<typeof getAppointmentListByBusiness>> = {
    totalCount: 0,
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    completedCount: 0,
    documents: [],
  };
  let loadError: string | null = null;

  try {
    const b = await getBusinessBySlugOrId(businessId);
    business = b;
    if (b) {
      const [s, a] = await Promise.all([
        getServicesByBusiness(b.$id),
        getAppointmentListByBusiness(b.$id),
      ]);
      services = s;
      appointmentData = a;
    }
  } catch (err) {
    console.error("Admin book page load error:", err);
    loadError = "We couldn't load the booking form. Please try again.";
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-dark-700 text-center">{loadError}</p>
        <Link
          href={`/b/${businessId}/admin`}
          className="text-16-semibold text-green-500 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-dark-700">Business not found.</p>
      </div>
    );
  }

  const existingAppointments = (appointmentData.documents as Appointment[]).filter(
    (a) => a.status === "scheduled" || a.status === "pending"
  );

  return (
    <AdminPageHeader
      businessId={businessId}
      businessName={business.name}
      pageTitle="admin.bookAppointmentTitle"
      pageSubtitle="admin.bookAppointmentSubtitle"
    >
      <section className="w-full space-y-6">
        <AdminBookBackLink businessId={businessId} />
        <div className="max-w-[560px]">
          <AdminBookForm
            businessId={businessId}
            services={services}
            providers={[]}
            existingAppointments={existingAppointments}
            primaryColor={business.primaryColor ?? undefined}
          />
        </div>
      </section>
    </AdminPageHeader>
  );
}
