/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled" | "completed";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

declare interface GuestBookingParams {
  businessId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  serviceId: string;
  providerId?: string | null;
  schedule: string;
  note?: string;
}

declare type CreateAppointmentParams = GuestBookingParams & { status: Status };

declare type UpdateAppointmentParams = {
  appointmentId: string;
  businessId: string;
  timeZone: string;
  appointment: Appointment;
  type: "schedule" | "cancel" | "complete";
};
