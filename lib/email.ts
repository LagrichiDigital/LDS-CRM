"use server";

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

type Lang = "en" | "fr";

function emailWrapper(content: string, businessName: string, accentColor = "#b87333"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${businessName}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.07);">
          <!-- Header bar -->
          <tr>
            <td style="background:${accentColor};padding:20px 32px;">
              <p style="margin:0;font-size:18px;font-weight:600;color:#ffffff;letter-spacing:0.02em;">${businessName}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #f0f0f0;">
              <p style="margin:0;font-size:12px;color:#aaa;">${businessName} · Powered by LDS Booking</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const copy = {
  request: {
    en: {
      subject: (b: string) => `Booking request received – ${b}`,
      greeting: (n: string) => `Hi ${n},`,
      intro: (b: string) => `We've received your booking request with <strong>${b}</strong>.`,
      service: "Service",
      time: "Requested time",
      note: "You'll receive another message once your appointment is confirmed.",
      thanks: (b: string) => `Thanks,<br/><strong>${b}</strong>`,
    },
    fr: {
      subject: (b: string) => `Demande de rendez-vous reçue – ${b}`,
      greeting: (n: string) => `Bonjour ${n},`,
      intro: (b: string) => `Nous avons bien reçu votre demande de rendez-vous chez <strong>${b}</strong>.`,
      service: "Prestation",
      time: "Heure demandée",
      note: "Vous recevrez un message de confirmation dès que votre rendez-vous sera validé.",
      thanks: (b: string) => `Merci,<br/><strong>${b}</strong>`,
    },
  },
  confirmed: {
    en: {
      subject: (b: string) => `Appointment confirmed – ${b}`,
      greeting: (n: string) => `Hi ${n},`,
      intro: (b: string) => `Your appointment with <strong>${b}</strong> is confirmed!`,
      service: "Service",
      time: "Date & time",
      note: "We look forward to seeing you.",
      thanks: (b: string) => `See you soon,<br/><strong>${b}</strong>`,
    },
    fr: {
      subject: (b: string) => `Rendez-vous confirmé – ${b}`,
      greeting: (n: string) => `Bonjour ${n},`,
      intro: (b: string) => `Votre rendez-vous chez <strong>${b}</strong> est confirmé !`,
      service: "Prestation",
      time: "Date et heure",
      note: "Nous avons hâte de vous accueillir.",
      thanks: (b: string) => `À bientôt,<br/><strong>${b}</strong>`,
    },
  },
  cancelled: {
    en: {
      subject: (b: string) => `Appointment cancelled – ${b}`,
      greeting: (n: string) => `Hi ${n},`,
      intro: (b: string) => `Your appointment with <strong>${b}</strong> has been cancelled.`,
      service: "Service",
      time: "Was scheduled for",
      reason: "Reason",
      note: (b: string) => `If you have any questions, please contact ${b}.`,
      thanks: (b: string) => `Thanks,<br/><strong>${b}</strong>`,
    },
    fr: {
      subject: (b: string) => `Rendez-vous annulé – ${b}`,
      greeting: (n: string) => `Bonjour ${n},`,
      intro: (b: string) => `Votre rendez-vous chez <strong>${b}</strong> a été annulé.`,
      service: "Prestation",
      time: "Était prévu pour",
      reason: "Motif",
      note: (b: string) => `Pour toute question, veuillez contacter ${b}.`,
      thanks: (b: string) => `Cordialement,<br/><strong>${b}</strong>`,
    },
  },
};

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#888;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:14px;color:#222;font-weight:500;">${value}</td>
    </tr>`;
}

/** Send booking request confirmation (guest just submitted). */
export async function sendBookingRequestEmail({
  to,
  guestName,
  businessName,
  serviceName,
  scheduleFormatted,
  accentColor,
  language = "en",
}: {
  to: string;
  guestName: string;
  businessName: string;
  serviceName: string;
  scheduleFormatted: string;
  accentColor?: string;
  language?: Lang;
}) {
  if (!resend) {
    console.warn("Resend not configured; skipping email.");
    return;
  }
  const t = copy.request[language];
  const body = `
    <p style="margin:0 0 6px;font-size:15px;color:#333;">${t.greeting(guestName)}</p>
    <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">${t.intro(businessName)}</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
      ${row(t.service, serviceName)}
      ${row(t.time, scheduleFormatted)}
    </table>
    <div style="background:#f9f6f2;border-left:3px solid ${accentColor ?? "#b87333"};padding:12px 16px;border-radius:0 6px 6px 0;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#666;">${t.note}</p>
    </div>
    <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">${t.thanks(businessName)}</p>
  `;
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: t.subject(businessName),
      html: emailWrapper(body, businessName, accentColor),
    });
  } catch (error) {
    console.error("Resend email error:", error);
  }
}

/** Send confirmation when admin confirms the booking. */
export async function sendBookingConfirmedEmail({
  to,
  guestName,
  businessName,
  serviceName,
  scheduleFormatted,
  accentColor,
  language = "en",
}: {
  to: string;
  guestName: string;
  businessName: string;
  serviceName: string;
  scheduleFormatted: string;
  accentColor?: string;
  language?: Lang;
}) {
  if (!resend) {
    console.warn("Resend not configured; skipping email.");
    return;
  }
  const t = copy.confirmed[language];
  const body = `
    <p style="margin:0 0 6px;font-size:15px;color:#333;">${t.greeting(guestName)}</p>
    <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">${t.intro(businessName)}</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
      ${row(t.service, serviceName)}
      ${row(t.time, scheduleFormatted)}
    </table>
    <div style="background:#f9f6f2;border-left:3px solid ${accentColor ?? "#b87333"};padding:12px 16px;border-radius:0 6px 6px 0;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#666;">${t.note}</p>
    </div>
    <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">${t.thanks(businessName)}</p>
  `;
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: t.subject(businessName),
      html: emailWrapper(body, businessName, accentColor),
    });
  } catch (error) {
    console.error("Resend email error:", error);
  }
}

/** Send cancellation notice when admin cancels. */
export async function sendBookingCancelledEmail({
  to,
  guestName,
  businessName,
  serviceName,
  scheduleFormatted,
  cancellationReason,
  accentColor,
  language = "en",
}: {
  to: string;
  guestName: string;
  businessName: string;
  serviceName: string;
  scheduleFormatted: string;
  cancellationReason?: string | null;
  accentColor?: string;
  language?: Lang;
}) {
  if (!resend) {
    console.warn("Resend not configured; skipping email.");
    return;
  }
  const t = copy.cancelled[language];
  const body = `
    <p style="margin:0 0 6px;font-size:15px;color:#333;">${t.greeting(guestName)}</p>
    <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">${t.intro(businessName)}</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
      ${row(t.service, serviceName)}
      ${row(t.time, scheduleFormatted)}
      ${cancellationReason ? row(t.reason, cancellationReason) : ""}
    </table>
    <div style="background:#f9f6f2;border-left:3px solid ${accentColor ?? "#b87333"};padding:12px 16px;border-radius:0 6px 6px 0;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#666;">${t.note(businessName)}</p>
    </div>
    <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">${t.thanks(businessName)}</p>
  `;
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: t.subject(businessName),
      html: emailWrapper(body, businessName, accentColor),
    });
  } catch (error) {
    console.error("Resend email error:", error);
  }
}
