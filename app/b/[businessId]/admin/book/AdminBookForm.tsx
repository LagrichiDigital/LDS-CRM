"use client";

import { GuestBookingForm } from "@/components/forms/GuestBookingForm";
import type { SlotBlockAppointment } from "@/components/forms/GuestBookingForm";
import type { Service } from "@/types/appwrite.types";
import type { Provider } from "@/types/appwrite.types";

type AdminBookFormProps = {
  businessId: string;
  services: Service[];
  providers: Provider[];
  existingAppointments: SlotBlockAppointment[];
  primaryColor?: string;
};

export function AdminBookForm({
  businessId,
  services,
  providers,
  existingAppointments,
  primaryColor,
}: AdminBookFormProps) {
  return (
    <GuestBookingForm
      businessId={businessId}
      services={services}
      providers={providers}
      existingAppointments={existingAppointments}
      primaryColor={primaryColor}
      createdByAdmin
    />
  );
}
