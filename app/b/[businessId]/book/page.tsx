import type { Metadata } from "next";
import Link from "next/link";

import { BookPageContent } from "@/components/BookPageContent";
import { getAppointmentListByBusiness } from "@/lib/actions/appointment.actions";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";
import { getBusinessHoursByBusiness } from "@/lib/actions/business-hours.actions";
import { getServicesByBusiness } from "@/lib/actions/service.actions";
import { Appointment } from "@/types/appwrite.types";

type Props = SearchParamProps;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await getBusinessBySlugOrId(params.businessId);
  const name = business?.name || "Business";
  return {
    title: `Book an appointment | ${name}`,
    description: `Book your appointment with ${name}. Choose a service and time. We'll confirm by SMS.`,
  };
}

export default async function BookPage({
  params: { businessId },
  searchParams,
}: SearchParamProps) {
  const serviceIdFromUrl = (searchParams?.serviceId as string) || "";
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
  let businessHours: Awaited<ReturnType<typeof getBusinessHoursByBusiness>> = [];
  let loadError: string | null = null;

  try {
    const b = await getBusinessBySlugOrId(businessId);
    business = b;
    if (b) {
      const [s, a, h] = await Promise.all([
        getServicesByBusiness(b.$id),
        getAppointmentListByBusiness(b.$id),
        getBusinessHoursByBusiness(b.$id),
      ]);
      services = s;
      appointmentData = a;
      businessHours = h;
    }
  } catch (err) {
    console.error("Book page load error:", err);
    loadError = "We couldn't load the booking form. Please try again.";
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-dark-700 text-center">{loadError}</p>
        <Link
          href={`/b/${businessId}/book`}
          className="text-16-semibold text-green-500 hover:underline"
        >
          Try again
        </Link>
      </div>
    );
  }

  const existingAppointments = (appointmentData.documents as Appointment[]).filter(
    (a) => a.status === "scheduled" || a.status === "pending"
  );

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-dark-700">Business not found.</p>
      </div>
    );
  }

  const preSelectedService = serviceIdFromUrl
    ? services.find((s) => s.$id === serviceIdFromUrl)
    : null;

  return (
    <BookPageContent
      business={business}
      businessId={business.$id}
      services={services}
      providers={[]}
      existingAppointments={existingAppointments}
      serviceIdFromUrl={serviceIdFromUrl}
      preSelectedService={preSelectedService ?? null}
      businessHours={businessHours}
    />
  );
}
