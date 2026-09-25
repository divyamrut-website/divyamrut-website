import type { Lead } from "./types";

/**
 * Sends a new Divyamrut lead notification
 * to the business WhatsApp number using
 * Meta WhatsApp Cloud API.
 *
 * Required environment variables:
 *
 * WHATSAPP_ACCESS_TOKEN
 * WHATSAPP_PHONE_NUMBER_ID
 * WHATSAPP_NOTIFY_TO
 *
 * Example:
 *
 * WHATSAPP_NOTIFY_TO=918943200063
 *
 * IMPORTANT:
 * - Do not put these values in frontend code.
 * - Do not use +, spaces, or hyphens in WHATSAPP_NOTIFY_TO.
 * - Configure these variables in Vercel Environment Variables.
 */

export async function notifyBusinessOfNewLead(
  lead: Lead
): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const notifyTo =
    process.env.WHATSAPP_NOTIFY_TO;

  // --------------------------------------------------
  // 1. CHECK ENVIRONMENT VARIABLES
  // --------------------------------------------------

  if (!token) {
    console.error(
      "[WhatsApp] Missing WHATSAPP_ACCESS_TOKEN"
    );

    return false;
  }

  if (!phoneNumberId) {
    console.error(
      "[WhatsApp] Missing WHATSAPP_PHONE_NUMBER_ID"
    );

    return false;
  }

  if (!notifyTo) {
    console.error(
      "[WhatsApp] Missing WHATSAPP_NOTIFY_TO"
    );

    return false;
  }

  // --------------------------------------------------
  // 2. CLEAN BUSINESS WHATSAPP NUMBER
  // --------------------------------------------------

  const recipient = notifyTo
    .replace(/\+/g, "")
    .replace(/\s/g, "")
    .replace(/-/g, "");

  if (!/^\d{10,15}$/.test(recipient)) {
    console.error(
      "[WhatsApp] Invalid WHATSAPP_NOTIFY_TO:",
      recipient
    );

    return false;
  }

  // --------------------------------------------------
  // 3. CREATE MESSAGE
  // --------------------------------------------------

  const message = [
    "🔔 NEW DIVYAMRUT ORDER",
    "",
    `Reference: ${lead.leadId}`,
    "",
    `👤 Customer: ${lead.name}`,
    `📱 Mobile: ${lead.mobile}`,
    "",
    "🏠 Delivery Address:",
    lead.houseBuilding,
    lead.streetArea,
    lead.locality,
    `${lead.district}, ${lead.state}`,
    `PIN: ${lead.pincode}`,
    "",
    "📦 Product: Divyamrut",
    `Quantity: ${lead.quantity}`,
    "",
    `Source: ${lead.source || "Website"}`,
    `Status: ${lead.status}`,
  ].join("\n");

  // --------------------------------------------------
  // 4. META WHATSAPP CLOUD API URL
  // --------------------------------------------------

  const url =
    `https://graph.facebook.com/v20.0/` +
    `${phoneNumberId}/messages`;

  // --------------------------------------------------
  // 5. SEND MESSAGE
  // --------------------------------------------------

  try {
    console.log(
      `[WhatsApp] Sending notification for ${lead.leadId}`
    );

    console.log(
      `[WhatsApp] Recipient: ${recipient}`
    );

    const response = await fetch(url, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        messaging_product: "whatsapp",

        recipient_type: "individual",

        to: recipient,

        type: "text",

        text: {
          preview_url: false,
          body: message,
        },
      }),
    });

    // --------------------------------------------------
    // 6. READ META RESPONSE
    // --------------------------------------------------

    const responseText =
      await response.text();

    let responseData: unknown;

    try {
      responseData = responseText
        ? JSON.parse(responseText)
        : null;
    } catch {
      responseData = responseText;
    }

    // --------------------------------------------------
    // 7. HANDLE META ERROR
    // --------------------------------------------------

    if (!response.ok) {
      console.error(
        "[WhatsApp] Meta API request failed."
      );

      console.error(
        "[WhatsApp] HTTP status:",
        response.status
      );

      console.error(
        "[WhatsApp] Meta response:",
        responseData
      );

      return false;
    }

    // --------------------------------------------------
    // 8. SUCCESS
    // --------------------------------------------------

    console.log(
      `[WhatsApp] Message sent successfully for ${lead.leadId}`
    );

    console.log(
      "[WhatsApp] Meta response:",
      responseData
    );

    return true;
  } catch (error) {
    console.error(
      "[WhatsApp] Request failed:",
      error
    );

    return false;
  }
}