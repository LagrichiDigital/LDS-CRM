import type { Metadata } from "next";
import Link from "next/link";

import { SuccessPageContent } from "@/components/SuccessPageContent";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { getService } from "@/lib/actions/service.actions";
import { formatDateTime } from "@/lib/utils";

type Props = SearchParamProps;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await getBusinessBySlugOrId(params.businessId);
  const name = business?.name || "Business";
  return {
    title: `Booking confirmed | ${name}`,
    description: `Your booking request with ${name} has been submitted. You'll receive an SMS confirmation.`,
  };
}

export default async function BookingSuccessPage({
  params: { businessId },
  searchParams,
}: SearchParamProps) {
  const appointmentId = (searchParams?.appointmentId as string) || "";

  if (!appointmentId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-dark-700 text-center">Appointment not found.</p>
        <Link href={`/b/${businessId}`} className="text-16-semibold text-green-500 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  let business: Awaited<ReturnType<typeof getBusinessBySlugOrId>> = null;
  let appointment: Awaited<ReturnType<typeof getAppointment>> = null;
  let loadError: string | null = null;

  try {
    const [b, a] = await Promise.all([
      getBusinessBySlugOrId(businessId),
      getAppointment(appointmentId),
    ]);
    business = b;
    appointment = a;
  } catch (err) {
    console.error("Success page load error:", err);
    loadError = "We couldn't load your confirmation. Please try again.";
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-dark-700 text-center">{loadError}</p>
        <Link href={`/b/${businessId}`} className="text-16-semibold text-green-500 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  if (!appointment || !business || appointment.businessId !== business.$id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-dark-700 text-center">Appointment not found.</p>
        <Link href={`/b/${businessId}`} className="text-16-semibold text-green-500 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const service = appointment.serviceId
    ? await getService(appointment.serviceId)
    : null;

  const scheduleFormatted = formatDateTime(appointment.schedule);

  return (
    <SuccessPageContent
      business={business}
      businessId={businessId}
      serviceName={service?.name || "Service"}
      scheduleDateTime={scheduleFormatted.dateTime}
    />
  );
}
