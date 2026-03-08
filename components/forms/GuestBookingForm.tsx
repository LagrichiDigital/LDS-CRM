"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { GuestBookingValidation } from "@/lib/validation";
import { Appointment, Service } from "@/types/appwrite.types";
import { Provider } from "@/types/appwrite.types";
import type { BusinessHours } from "@/lib/actions/business-hours.actions";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";

/** Minimal appointment data used to block time slots. */
export type SlotBlockAppointment = Pick<Appointment, "schedule" | "serviceId" | "providerId">;

type GuestBookingFormProps = {
  businessId: string;
  services: Service[];
  providers: Provider[];
  /** Scheduled/pending appointments used to block overlapping times. */
  existingAppointments?: SlotBlockAppointment[];
  primaryColor?: string;
  /** Pre-select this service when coming from the services page. */
  defaultServiceId?: string;
  /** When true, appointment is created as "scheduled" and redirect goes to admin dashboard. */
  createdByAdmin?: boolean;
  /** Weekly opening hours (0–6). */
  businessHours?: BusinessHours[];
  /** Lead time in minutes before a slot can be booked. */
  leadTimeMinutes?: number;
  /** Maximum days ahead a booking can be made. */
  maxDaysAhead?: number;
};

function isOverlapping(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && endA > startB;
}

export function GuestBookingForm({
  businessId,
  services,
  providers,
  existingAppointments = [],
  primaryColor,
  defaultServiceId,
  createdByAdmin = false,
  businessHours,
  leadTimeMinutes = 0,
  maxDaysAhead = 365,
}: GuestBookingFormProps) {
  const router = useRouter();
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof GuestBookingValidation>>({
    resolver: zodResolver(GuestBookingValidation),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      serviceId: defaultServiceId ?? "",
      providerId: null as string | null,
      schedule: undefined as Date | undefined,
      note: "",
    },
  });

  const watchedServiceId = form.watch("serviceId");
  const watchedSchedule = form.watch("schedule");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const minAllowedDateTime = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() + leadTimeMinutes * 60 * 1000);
  }, [leadTimeMinutes]);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + maxDaysAhead);
    return d;
  }, [maxDaysAhead]);

  const isSelectedDateToday =
    watchedSchedule instanceof Date &&
    watchedSchedule.getDate() === today.getDate() &&
    watchedSchedule.getMonth() === today.getMonth() &&
    watchedSchedule.getFullYear() === today.getFullYear();

  const minDate = today;

  const filterTime = useCallback(
    (candidateTime: Date) => {
      // Respect weekly opening hours, if configured
      if (businessHours && businessHours.length > 0) {
        const day = candidateTime.getDay(); // 0–6
        const rule = businessHours.find((h) => h.dayOfWeek === day);
        if (rule) {
          if (rule.isClosed) return false;

          const [openH, openM] = rule.openTime.split(":").map(Number);
          const [closeH, closeM] = rule.closeTime.split(":").map(Number);

          const open = new Date(candidateTime);
          open.setHours(openH, openM, 0, 0);
          const close = new Date(candidateTime);
          close.setHours(closeH, closeM, 0, 0);

          if (candidateTime < open || candidateTime >= close) return false;
        }
      }

      // Respect lead time / max days ahead
      if (candidateTime < minAllowedDateTime) return false;
      if (candidateTime > maxDate) return false;

      if (!watchedServiceId || existingAppointments.length === 0) return true;
      const service = services.find((s) => s.$id === watchedServiceId);
      const durationMinutes = service?.durationMinutes ?? 0;
      const candidateEnd = new Date(
        candidateTime.getTime() + durationMinutes * 60 * 1000
      );
      const chosenProvider = null;

      for (const appt of existingAppointments) {
        const apptProvider = appt.providerId ?? null;
        if (chosenProvider !== null && apptProvider !== chosenProvider)
          continue;
        const apptStart = new Date(appt.schedule);
        const apptService = services.find((s) => s.$id === appt.serviceId);
        const apptDuration = apptService?.durationMinutes ?? 0;
        const apptEnd = new Date(
          apptStart.getTime() + apptDuration * 60 * 1000
        );
        if (isOverlapping(candidateTime, candidateEnd, apptStart, apptEnd))
          return false;
      }
      return true;
    },
    [businessHours, minAllowedDateTime, maxDate, existingAppointments, watchedServiceId, services]
  );

  const onSubmit = async (values: z.infer<typeof GuestBookingValidation>) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      const rawSchedule =
        values.schedule instanceof Date ? values.schedule : new Date(values.schedule);

      if (rawSchedule < minAllowedDateTime) {
        setSubmitError("Please choose a time far enough in advance.");
        setIsLoading(false);
        return;
      }
      if (rawSchedule > maxDate) {
        setSubmitError("Please choose a date within the allowed window.");
        setIsLoading(false);
        return;
      }

      const schedule = rawSchedule.toISOString();
      const appointment = {
        businessId,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        serviceId: values.serviceId,
        providerId: null,
        schedule,
        note: values.note || "",
        status: (createdByAdmin ? "scheduled" : "pending") as Status,
      };
      const result = await createAppointment(appointment);
      if (result && "error" in result) {
        setSubmitError(result.error);
        return;
      }
      if (result?.$id) {
        form.reset();
        router.push(createdByAdmin ? `/b/${businessId}/admin` : `/b/${businessId}/book/success?appointmentId=${result.$id}`);
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        aria-label={t("booking.title")}
      >
        <section className="mb-6 space-y-4">
          <h2 className="sub-header">{t("booking.yourDetails")}</h2>
          <p className="text-dark-700 text-sm">
            {t("booking.detailsNote")}
          </p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="guestName"
          label={t("booking.fullName")}
          placeholder="Jane Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="guestEmail"
          label={t("booking.email")}
          placeholder="jane@example.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="guestPhone"
          label={t("booking.phone")}
          placeholder="+1 234 567 8900"
        />

        <section className="mb-6 space-y-4 pt-4">
          <h2 className="sub-header">{t("booking.appointment")}</h2>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="serviceId"
          label={t("booking.service")}
          placeholder={t("booking.selectService")}
        >
          {services.map((s) => (
            <SelectItem key={s.$id} value={s.$id}>
              {s.name}
              {s.durationMinutes ? ` (${s.durationMinutes} min)` : ""}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="schedule"
          label={t("booking.dateTime")}
          placeholder={t("booking.dateTimePlaceholder")}
          showTimeSelect
          dateFormat="MM/dd/yyyy  –  h:mm aa"
          filterTime={filterTime}
          filterDate={(date: Date) => {
            if (!businessHours || businessHours.length === 0) return date <= maxDate;
            const day = date.getDay();
            const rule = businessHours.find((h) => h.dayOfWeek === day);
            if (rule && rule.isClosed) return false;
            return date <= maxDate;
          }}
          minDate={minDate}
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="note"
          label={t("booking.notes")}
          placeholder={t("booking.notesPlaceholder")}
        />

        {submitError && (
          <p className="text-destructive text-sm" role="alert">
            {submitError}
          </p>
        )}
        <SubmitButton
          isLoading={isLoading}
          className="shad-primary-btn w-full"
          style={primaryColor ? { backgroundColor: primaryColor, color: "#fff" } : undefined}
        >
          {createdByAdmin ? t("admin.createAppointment") : t("booking.requestBooking")}
        </SubmitButton>
      </form>
    </Form>
  );
}
