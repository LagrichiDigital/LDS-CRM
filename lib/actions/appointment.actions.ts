"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { getBusinessBySlugOrId } from "./business.actions";
import { getService, getServicesByBusiness } from "./service.actions";
import { sendWhatsAppToPhone } from "../twilio";
import {
  sendBookingRequestEmail,
  sendBookingConfirmedEmail,
  sendBookingCancelledEmail,
} from "../email";
import { canSendWhatsApp } from "../plan";
import { formatDateTime, parseStringify } from "../utils";

function timeRangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && endA > startB;
}

export async function createAppointment(
  appointment: CreateAppointmentParams
): Promise<{ error: string } | ReturnType<typeof parseStringify>> {
  try {
    const [service, servicesList] = await Promise.all([
      getService(appointment.serviceId),
      getServicesByBusiness(appointment.businessId),
    ]);

    if (!service || service.businessId !== appointment.businessId) {
      return {
        error: "Invalid service. Please choose a service from the list and try again.",
      };
    }

    const newStart = new Date(appointment.schedule);
    const now = new Date();
    if (newStart.getTime() < now.getTime() - 60 * 1000) {
      return {
        error: "Please select a date and time in the future.",
      };
    }

    const durationMinutes = service.durationMinutes ?? 0;
    const durationByServiceId = new Map(
      servicesList.map((s) => [s.$id, s.durationMinutes])
    );
    const newEnd = new Date(
      newStart.getTime() + durationMinutes * 60 * 1000
    );

    const existing = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal("businessId", [appointment.businessId])]
    );

    const scheduledOrPending = (existing.documents as Appointment[]).filter(
      (a) => a.status === "scheduled" || a.status === "pending"
    );

    const newProvider = appointment.providerId ?? null;

    for (const existingAppt of scheduledOrPending) {
      const existingDuration =
        durationByServiceId.get(existingAppt.serviceId) ?? 0;
      const existingStart = new Date(existingAppt.schedule);
      const existingEnd = new Date(
        existingStart.getTime() + existingDuration * 60 * 1000
      );

      const providerMatch =
        newProvider === null ||
        existingAppt.providerId === null ||
        existingAppt.providerId === newProvider;

      if (
        providerMatch &&
        timeRangesOverlap(newStart, newEnd, existingStart, existingEnd)
      ) {
        return {
          error:
            "This time slot is no longer available. Please choose another time.",
        };
      }
    }

    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    revalidateTag(`appointments-${appointment.businessId}`);
    revalidatePath("/admin");
    revalidatePath(`/b/${appointment.businessId}/admin`);

    const business = await getBusinessBySlugOrId(appointment.businessId);
    const timezone = business?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const scheduleFormatted = formatDateTime(appointment.schedule, timezone).dateTime;
    const lang = business?.notificationLanguage ?? "en";
    await sendBookingRequestEmail({
      to: appointment.guestEmail,
      guestName: appointment.guestName,
      businessName: business?.name ?? "Us",
      serviceName: service.name,
      scheduleFormatted,
      accentColor: business?.primaryColor,
      language: lang,
    });

    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
    return {
      error: "We couldn't create your booking. Please try again.",
    };
  }
}

async function getAppointmentListByBusinessUncached(businessId: string) {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal("businessId", [businessId]),
        Query.orderDesc("$createdAt"),
      ]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
      completedCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
          case "completed":
            acc.completedCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    return parseStringify({
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    });
  } catch (error) {
    console.error(
      "An error occurred while retrieving appointments for business:",
      error
    );
    return {
      totalCount: 0,
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
      completedCount: 0,
      documents: [],
    };
  }
}

export async function getAppointmentListByBusiness(businessId: string) {
  return unstable_cache(
    () => getAppointmentListByBusinessUncached(businessId),
    ["appointments", businessId],
    { tags: [`appointments-${businessId}`], revalidate: 30 }
  )();
}

/** @deprecated Use getAppointmentListByBusiness. Kept for backwards compatibility. */
export const getRecentAppointmentList = getAppointmentListByBusiness;

export async function updateAppointment({
  appointmentId,
  businessId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw new Error("Update failed");

    revalidateTag(`appointments-${businessId}`);

    const business = await getBusinessBySlugOrId(businessId);
    const service = await getService(appointment.serviceId);
    const scheduleFormatted = formatDateTime(appointment.schedule, timeZone).dateTime;
    const lang = business?.notificationLanguage ?? "en";

    if (type === "schedule") {
      await sendBookingConfirmedEmail({
        to: appointment.guestEmail,
        guestName: appointment.guestName ?? "there",
        businessName: business?.name ?? "Us",
        serviceName: service?.name ?? "your service",
        scheduleFormatted,
        accentColor: business?.primaryColor,
        language: lang,
      });
      if (canSendWhatsApp(business) && appointment.guestPhone) {
        const smsConfirmed =
          lang === "fr"
            ? `Votre rendez-vous chez ${business?.name ?? "nous"} est confirmé pour le ${scheduleFormatted}. À bientôt !`
            : `Your appointment is confirmed for ${scheduleFormatted}. We'll see you then!`;
        await sendWhatsAppToPhone(appointment.guestPhone, smsConfirmed);
      }
    } else if (type === "cancel") {
      await sendBookingCancelledEmail({
        to: appointment.guestEmail,
        guestName: appointment.guestName ?? "there",
        businessName: business?.name ?? "Us",
        serviceName: service?.name ?? "your service",
        scheduleFormatted,
        cancellationReason: appointment.cancellationReason ?? null,
        accentColor: business?.primaryColor,
        language: lang,
      });
      if (canSendWhatsApp(business) && appointment.guestPhone) {
        const smsCancelled =
          lang === "fr"
            ? `Votre rendez-vous du ${scheduleFormatted} chez ${business?.name ?? "nous"} a été annulé.${appointment.cancellationReason ? ` Motif : ${appointment.cancellationReason}` : ""}`
            : `Your appointment for ${scheduleFormatted} has been cancelled.${appointment.cancellationReason ? ` Reason: ${appointment.cancellationReason}` : ""}`;
        await sendWhatsAppToPhone(appointment.guestPhone, smsCancelled);
      }
    }

    revalidatePath("/admin");
    revalidatePath(`/b/${businessId}/admin`);
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while updating appointment:", error);
  }
}

export async function getAppointment(appointmentId: string) {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.error("An error occurred while retrieving the appointment:", error);
  }
}

export async function updateAppointmentStaffNotes(
  appointmentId: string,
  businessId: string,
  staffNotes: string
) {
  try {
    const updated = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      { staffNotes: staffNotes.trim() || null }
    );
    revalidatePath(`/b/${businessId}/admin`);
    return parseStringify(updated);
  } catch (error) {
    console.error("Error updating staff notes:", error);
  }
}
