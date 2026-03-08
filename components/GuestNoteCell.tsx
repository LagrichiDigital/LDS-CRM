"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";

type GuestNoteCellProps = {
  appointment: Appointment;
};

export function GuestNoteCell({ appointment }: GuestNoteCellProps) {
  const [open, setOpen] = useState(false);
  const note = appointment.note?.trim() || "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-14-medium text-green-500 hover:underline"
          title={note || "View guest note"}
        >
          View
        </button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guest note</DialogTitle>
          <p className="text-dark-600 text-sm">
            What the guest wrote when booking.
          </p>
        </DialogHeader>
        <p className="text-14-regular min-h-[60px] whitespace-pre-wrap rounded border border-dark-500 bg-dark-400/50 p-3">
          {note || "No note from guest."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
