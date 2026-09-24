import { NextRequest, NextResponse } from "next/server";
import { isValidIndianMobile, isValidPincode, isNonEmpty, normalizeMobile } from "@/lib/validation";
import { getNextLeadNumber, saveLead, formatLeadId } from "@/lib/leadStore";
import { notifyBusinessOfNewLead } from "@/lib/whatsapp";
import type { Lead } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = String(body.fullName || "").trim();
  const mobile = String(body.mobile || "").trim();
  const houseBuilding = String(body.houseBuilding || "").trim();
  const streetArea = String(body.streetArea || "").trim();
  const locality = String(body.locality || "").trim();
  const district = String(body.district || "").trim();
  const state = String(body.state || "").trim();
  const pincode = String(body.pincode || "").trim();
  const quantity = Number(body.quantity || 1);
  const source = String(body.source || "Website").trim();
  const utmSource = body.utmSource ? String(body.utmSource) : undefined;
  const utmMedium = body.utmMedium ? String(body.utmMedium) : undefined;
  const utmCampaign = body.utmCampaign ? String(body.utmCampaign) : undefined;

  const errors: Record<string, string> = {};
  if (!isNonEmpty(fullName)) errors.fullName = "Full name is required.";
  if (!isValidIndianMobile(mobile)) errors.mobile = "Enter a valid 10-digit Indian mobile number.";
  if (!isNonEmpty(houseBuilding)) errors.houseBuilding = "House/Building is required.";
  if (!isNonEmpty(streetArea)) errors.streetArea = "Street/Area is required.";
  if (!isNonEmpty(locality)) errors.locality = "Locality is required.";
  if (!isNonEmpty(district)) errors.district = "District is required.";
  if (!isNonEmpty(state)) errors.state = "State is required.";
  if (!isValidPincode(pincode)) errors.pincode = "Enter a valid 6-digit PIN code.";
  if (!quantity || quantity < 1) errors.quantity = "Quantity must be at least 1.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed.", fields: errors }, { status: 422 });
  }

  const leadNumber = getNextLeadNumber() + 1; // +1 so the sequence starts at DV000001
  const leadId = formatLeadId(leadNumber);

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
    createdAt: new Date().toISOString(),
    status: "New Lead",
  };

  saveLead(lead);

  // Fire-and-forget: don't block the customer's confirmation on WhatsApp delivery.
  notifyBusinessOfNewLead(lead).catch(() => {});

  return NextResponse.json({ success: true, leadId }, { status: 201 });
}
