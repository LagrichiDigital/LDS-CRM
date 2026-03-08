"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { SlotBlockAppointment } from "@/components/forms/GuestBookingForm";
import { GuestBookingForm } from "@/components/forms/GuestBookingForm";
import type { Business } from "@/types/appwrite.types";
import type { Provider } from "@/types/appwrite.types";
import type { Service } from "@/types/appwrite.types";
import type { BusinessHours } from "@/lib/actions/business-hours.actions";

type BookPageContentProps = {
  business: Business;
  businessId: string;
  services: Service[];
  providers: Provider[];
  existingAppointments: SlotBlockAppointment[];
  serviceIdFromUrl: string;
  preSelectedService: Service | null;
  businessHours: BusinessHours[];
};

export function BookPageContent({
  business,
  businessId,
  services,
  providers,
  existingAppointments,
  serviceIdFromUrl,
  preSelectedService,
  businessHours,
}: BookPageContentProps) {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-dark-500 px-[5%] py-4">
        <Link href={`/b/${businessId}/services`} className="flex items-center gap-3 text-16-semibold text-dark-300 hover:underline">
          <span>←</span>
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="h-8 w-auto max-w-[180px] object-contain object-left"
            />
          ) : (
            business.name
          )}
        </Link>
      </header>
      <main className="container my-auto flex-1 px-[5%] py-10">
        <div className="sub-container mx-auto max-w-[560px]">
          <h1 className="header mb-2">{t("booking.title")}</h1>
          {preSelectedService ? (
            <p className="text-dark-700 mb-8">
              {t("booking.descriptionService", { service: preSelectedService.name })}
            </p>
          ) : (
            <p className="text-dark-700 mb-8">
              {t("booking.description")}
            </p>
          )}
          {services.length === 0 ? (
            <div className="rounded-xl border border-dark-500 bg-dark-400/50 p-8 text-center">
              <p className="text-dark-600 text-16-regular">
                {t("booking.noServices")}
              </p>
              <p className="mt-2 text-dark-600 text-14-regular">
                {t("booking.noServicesContact")}
              </p>
            </div>
          ) : (
            <GuestBookingForm
              businessId={businessId}
              services={services}
              providers={providers}
              existingAppointments={existingAppointments}
              primaryColor={business.primaryColor}
              defaultServiceId={serviceIdFromUrl && services.some((s) => s.$id === serviceIdFromUrl) ? serviceIdFromUrl : undefined}
              businessHours={businessHours}
              leadTimeMinutes={120}
              maxDaysAhead={30}
            />
          )}
        </div>
      </main>
    </div>
  );
}
