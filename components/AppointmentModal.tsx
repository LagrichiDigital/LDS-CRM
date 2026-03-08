"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";

import { AdminAppointmentForm } from "./forms/AdminAppointmentForm";

export const AppointmentModal = ({
  businessId,
  appointment,
  type,
  title,
  description,
}: {
  businessId: string;
  appointment: Appointment;
  type: "schedule" | "cancel" | "complete";
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);
  const buttonLabel = type === "complete" ? "Complete" : type;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${(type === "schedule" || type === "complete") && "text-green-500"}`}
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{buttonLabel} appointment</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <AdminAppointmentForm
          businessId={businessId}
          appointment={appointment}
          type={type}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
