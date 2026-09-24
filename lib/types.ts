export type LeadStatus =
  | "New Lead"
  | "Call Pending"
  | "Call Attempted"
  | "Customer Contacted"
  | "Details Verified"
  | "Order Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Lead {
  leadId: string;
  name: string;
  mobile: string;
  whatsapp?: string;
  houseBuilding: string;
  streetArea: string;
  locality: string;
  district: string;
  state: string;
  pincode: string;
  quantity: number;
  product: "Divyamrut";
  source: string; // e.g. instagram, google, direct
  campaign?: string; // UTM campaign
  utmSource?: string;
  utmMedium?: string;
  createdAt: string;
  status: LeadStatus;
  telecaller?: string;
  callStatus?: string;
  verificationStatus?: string;
  orderStatus?: string;
}

export interface LeadCaptureInput {
  name: string;
  mobile: string;
}

export interface DeliveryDetailsInput {
  fullName: string;
  mobile: string;
  houseBuilding: string;
  streetArea: string;
  locality: string;
  district: string;
  state: string;
  pincode: string;
  quantity: number;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}
