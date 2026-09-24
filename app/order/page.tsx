"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import DeliveryForm from "@/components/DeliveryForm";
import { track } from "@/lib/analytics";
import type { LeadCaptureInput } from "@/lib/types";

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [lead, setLead] = useState<LeadCaptureInput | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  useEffect(() => {
    track("lead_form_open");
  }, []);

  async function handleDeliverySubmit(delivery: {
    houseBuilding: string;
    streetArea: string;
    locality: string;
    district: string;
    state: string;
    pincode: string;
    quantity: string;
  }) {
    if (!lead) return;
    setSubmitting(true);
    setSubmitError(undefined);
    track("order_submit");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: lead.name,
          mobile: lead.mobile,
          ...delivery,
          quantity: Number(delivery.quantity),
          source: searchParams.get("utm_source") || "Website",
          utmSource: searchParams.get("utm_source") || undefined,
          utmMedium: searchParams.get("utm_medium") || undefined,
          utmCampaign: searchParams.get("utm_campaign") || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(
          data?.error === "Validation failed."
            ? "Please check the highlighted fields and try again."
            : "Something went wrong. Please try again or contact support."
        );
        setSubmitting(false);
        return;
      }

      router.push(`/thank-you?leadId=${encodeURIComponent(data.leadId)}`);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="container-page py-10 sm:py-16">
        {step === 1 && (
          <LeadForm
            onContinue={(data) => {
              setLead(data);
              setStep(2);
            }}
          />
        )}
        {step === 2 && lead && (
          <DeliveryForm
            lead={lead}
            onSubmit={handleDeliverySubmit}
            submitting={submitting}
            submitError={submitError}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
