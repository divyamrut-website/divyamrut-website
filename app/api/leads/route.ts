import { NextRequest, NextResponse } from "next/server";

import {
  isValidIndianMobile,
  isValidPincode,
  isNonEmpty,
  normalizeMobile,
} from "@/lib/validation";

import {
  getNextLeadNumber,
  saveLead,
  formatLeadId,
} from "@/lib/leadStore";

import { notifyBusinessOfNewLead } from "@/lib/whatsapp";

import type { Lead } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  // --------------------------------------------------
  // 1. READ REQUEST BODY
  // --------------------------------------------------

  try {
    body = await req.json();
  } catch (error) {
    console.error(
      "[Lead API] Invalid request body:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body.",
      },
      {
        status: 400,
      }
    );
  }

  // --------------------------------------------------
  // 2. EXTRACT FORM DATA
  // --------------------------------------------------

  const fullName =
    String(body.fullName || "").trim();

  const mobile =
    String(body.mobile || "").trim();

  const houseBuilding =
    String(body.houseBuilding || "").trim();

  const streetArea =
    String(body.streetArea || "").trim();

  const locality =
    String(body.locality || "").trim();

  const district =
    String(body.district || "").trim();

  const state =
    String(body.state || "").trim();

  const pincode =
    String(body.pincode || "").trim();

  const quantity =
    Number(body.quantity || 1);

  const source =
    String(body.source || "Website").trim();

  const utmSource = body.utmSource
    ? String(body.utmSource)
    : undefined;

  const utmMedium = body.utmMedium
    ? String(body.utmMedium)
    : undefined;

  const utmCampaign = body.utmCampaign
    ? String(body.utmCampaign)
    : undefined;

  // --------------------------------------------------
  // 3. VALIDATION
  // --------------------------------------------------

  const errors: Record<string, string> = {};

  if (!isNonEmpty(fullName)) {
    errors.fullName =
      "Full name is required.";
  }

  if (!isValidIndianMobile(mobile)) {
    errors.mobile =
      "Enter a valid 10-digit Indian mobile number.";
  }

  if (!isNonEmpty(houseBuilding)) {
    errors.houseBuilding =
      "House/Building is required.";
  }

  if (!isNonEmpty(streetArea)) {
    errors.streetArea =
      "Street/Area is required.";
  }

  if (!isNonEmpty(locality)) {
    errors.locality =
      "Locality is required.";
  }

  if (!isNonEmpty(district)) {
    errors.district =
      "District is required.";
  }

  if (!isNonEmpty(state)) {
    errors.state =
      "State is required.";
  }

  if (!isValidPincode(pincode)) {
    errors.pincode =
      "Enter a valid 6-digit PIN code.";
  }

  if (
    !Number.isFinite(quantity) ||
    quantity < 1
  ) {
    errors.quantity =
      "Quantity must be at least 1.";
  }

  if (Object.keys(errors).length > 0) {
    console.warn(
      "[Lead API] Validation failed:",
      errors
    );

    return NextResponse.json(
      {
        success: false,
        error: "Validation failed.",
        fields: errors,
      },
      {
        status: 422,
      }
    );
  }

  // --------------------------------------------------
  // 4. CREATE LEAD ID
  // --------------------------------------------------

  let leadNumber: number;

  try {
    leadNumber =
      getNextLeadNumber() + 1;
  } catch (error) {
    console.error(
      "[Lead API] Failed to generate lead number:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to generate order reference. Please try again.",
      },
      {
        status: 500,
      }
    );
  }

  const leadId =
    formatLeadId(leadNumber);

  // --------------------------------------------------
  // 5. CREATE LEAD
  // --------------------------------------------------

  const lead: Lead = {
    leadId,

    name: fullName,

    mobile: normalizeMobile(mobile),

    houseBuilding,

    streetArea,

    locality,

    district,

    state,

    pincode,

    quantity,

    product: "Divyamrut",

    source,

    campaign: utmCampaign,

    utmSource,

    utmMedium,

    createdAt:
      new Date().toISOString(),

    status: "New Lead",
  };

  // --------------------------------------------------
  // 6. SAVE LEAD
  // --------------------------------------------------

  try {
    saveLead(lead);

    console.log(
      `[Lead API] Lead ${leadId} saved successfully.`
    );
  } catch (error) {
    console.error(
      `[Lead API] Failed to save ${leadId}:`,
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to save your order. Please try again.",
      },
      {
        status: 500,
      }
    );
  }

  // --------------------------------------------------
  // 7. SEND WHATSAPP NOTIFICATION
  // --------------------------------------------------

  /*
   * WhatsApp failure will NOT make the customer's
   * order fail.
   *
   * The lead has already been saved successfully.
   */

  notifyBusinessOfNewLead(lead)
    .then((success) => {
      if (success) {
        console.log(
          `[Lead API] WhatsApp notification sent for ${leadId}.`
        );
      } else {
        console.error(
          `[Lead API] WhatsApp notification failed for ${leadId}.`
        );
      }
    })
    .catch((error) => {
      console.error(
        `[Lead API] WhatsApp notification error for ${leadId}:`,
        error
      );
    });

  // --------------------------------------------------
  // 8. RETURN SUCCESS TO CUSTOMER
  // --------------------------------------------------

  return NextResponse.json(
    {
      success: true,
      leadId,
    },
    {
      status: 201,
    }
  );
}