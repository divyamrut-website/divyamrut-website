import type { Lead } from "./types";

/**
 * Sends a NEW LEAD alert to the business's own WhatsApp using the official
 * WhatsApp Cloud API (Meta). This notifies the BUSINESS/SALES TEAM, not the
 * customer — the customer only ever sees the on-screen thank-you message.
 *
 * REQUIRED SETUP (do this in the Meta / WhatsApp Business Platform, not in code):
 *   1. Create a Meta Business app with the WhatsApp product enabled.
 *   2. Get a permanent access token and a Phone Number ID.
 *   3. Set these as environment variables (in Vercel: Project → Settings → Environment Variables):
 *        WHATSAPP_ACCESS_TOKEN
 *        WHATSAPP_PHONE_NUMBER_ID
 *        WHATSAPP_NOTIFY_TO   (the business/sales team's WhatsApp number, e.g. 918943200063)
 *   4. Never commit these values or put them in frontend code — this file only
 *      runs on the server (inside an API route).
 *
 * If these env vars are not set, this function safely no-ops and logs a
 * warning instead of throwing, so lead capture still works while WhatsApp
 * notifications are being configured.
 */
export async function notifyBusinessOfNewLead(lead: Lead): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const notifyTo = process.env.WHATSAPP_NOTIFY_TO;

  if (!token || !phoneNumberId || !notifyTo) {
    console.warn(
      "[whatsapp] Skipping WhatsApp notification — WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_NOTIFY_TO not configured."
    );
    return;
  }

  const message = [
    "NEW DIVYAMRUT ORDER LEAD",
    "",
    `Lead ID: ${lead.leadId}`,
    `Customer Name: ${lead.name}`,
    `Mobile: ${lead.mobile}`,
    `Address: ${lead.houseBuilding}, ${lead.streetArea}, ${lead.locality}, ${lead.district}, ${lead.state}`,
    `PIN: ${lead.pincode}`,
    `Product: Divyamrut`,
    `Quantity: ${lead.quantity}`,
    `Source: ${lead.source || "Website"}`,
    `Status: ${lead.status}`,
  ].join("\n");

  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: notifyTo,
          type: "text",
          text: { body: message },
        }),
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error("[whatsapp] Failed to send notification:", errText);
    }
  } catch (err) {
    console.error("[whatsapp] Error sending notification:", err);
  }
}
