"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateAppointmentStaffNotes } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

type StaffNotesCellProps = {
  appointment: Appointment;
  businessId: string;
};

export function StaffNotesCell({ appointment, businessId }: StaffNotesCellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(appointment.staffNotes ?? "");
  const [saving, setSaving] = useState(false);

  const hasNote = !!appointment.staffNotes?.trim();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAppointmentStaffNotes(
        appointment.$id,
        businessId,
        draft
      );
      setOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setDraft(appointment.staffNotes ?? ""); }}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-14-medium text-green-500 hover:underline"
          title={appointment.staffNotes ?? "Add internal note"}
        >
          {hasNote ? "Edit" : "Add"}
        </button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Internal note</DialogTitle>
          <p className="text-dark-600 text-sm">
            Staff only. Not sent to the guest.
          </p>
        </DialogHeader>
        <Textarea
          placeholder="e.g. Allergy to X, prefers morning..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="shad-textArea min-h-[100px]"
          maxLength={500}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="shad-primary-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
