"use server";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

/** Send WhatsApp message to a guest's phone number. Uses Twilio WhatsApp Sandbox for testing. */
export async function sendWhatsAppToPhone(toPhone: string, body: string) {
  if (!accountSid || !authToken) {
    console.warn("Twilio not configured; skipping WhatsApp.");
    return;
  }
  try {
    const sandboxFrom = "whatsapp:+14155238886";
    const to = toPhone.startsWith("whatsapp:") ? toPhone : `whatsapp:${toPhone}`;
    console.log("[twilio-whatsapp] sending to:", to, "| body:", body);
    
    const client = twilio(accountSid, authToken);
    await client.messages.create({ body, from: sandboxFrom, to });
    console.log("[twilio-whatsapp] message sent successfully");
  } catch (error) {
    console.error("Twilio WhatsApp error:", error);
  }
}
