"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

const CancelSchema = z.object({
  cancellationReason: z
    .string()
    .min(2, "Please provide a reason")
    .max(500, "Reason must be at most 500 characters"),
});

type AdminAppointmentFormProps = {
  businessId: string;
  appointment: Appointment;
  type: "schedule" | "cancel" | "complete";
  setOpen: (open: boolean) => void;
};

export function AdminAppointmentForm({
  businessId,
  appointment,
  type,
  setOpen,
}: AdminAppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof CancelSchema>>({
    resolver: zodResolver(CancelSchema),
    defaultValues: { cancellationReason: appointment.cancellationReason || "" },
  });

  const router = useRouter();

  const handleConfirm = async () => {
    if (type === "schedule") {
      setIsLoading(true);
      try {
        await updateAppointment({
          appointmentId: appointment.$id,
          businessId,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          appointment: { ...appointment, status: "scheduled" },
          type: "schedule",
        });
        setOpen(false);
        router.refresh();
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (type === "complete") {
      setIsLoading(true);
      try {
        await updateAppointment({
          appointmentId: appointment.$id,
          businessId,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          appointment: { ...appointment, status: "completed" },
          type: "complete",
        });
        setOpen(false);
        router.refresh();
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof CancelSchema>) => {
    if (type !== "cancel") return;
    setIsLoading(true);
    try {
      await updateAppointment({
        appointmentId: appointment.$id,
        businessId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        appointment: {
          ...appointment,
          status: "cancelled",
          cancellationReason: values.cancellationReason,
        },
        type: "cancel",
      });
      setOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  if (type === "schedule") {
    return (
      <div className="space-y-4">
        <p className="text-dark-700 text-sm">
          Confirm this booking? An SMS will be sent to the guest&apos;s phone.
        </p>
        <SubmitButton
          isLoading={isLoading}
          className="shad-primary-btn w-full"
          onClick={handleConfirm}
          type="button"
        >
          Confirm booking
        </SubmitButton>
      </div>
    );
  }

  if (type === "complete") {
    return (
      <div className="space-y-4">
        <p className="text-dark-700 text-sm">
          Mark this appointment as completed? No notification will be sent.
        </p>
        <SubmitButton
          isLoading={isLoading}
          className="shad-primary-btn w-full"
          onClick={handleComplete}
          type="button"
        >
          Mark as completed
        </SubmitButton>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="cancellationReason"
          label="Reason for cancellation"
          placeholder="e.g. Guest requested to cancel"
        />
        <SubmitButton
          isLoading={isLoading}
          className="shad-danger-btn w-full"
        >
          Cancel appointment
        </SubmitButton>
      </form>
    </Form>
  );
}
