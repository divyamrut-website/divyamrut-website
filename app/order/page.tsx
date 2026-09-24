"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import DeliveryForm from "@/components/DeliveryForm";

import { track } from "@/lib/analytics";
import type { LeadCaptureInput } from "@/lib/types";

type DeliveryData = {
  houseBuilding: string;
  streetArea: string;
  locality: string;
  district: string;
  state: string;
  pincode: string;
  quantity: string;
};

function OrderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2>(1);
  const [lead, setLead] = useState<LeadCaptureInput | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  useEffect(() => {
    track("lead_form_open");
  }, []);

  async function handleDeliverySubmit(delivery: DeliveryData) {
    if (!lead) {
      return;
    }

    setSubmitting(true);
    setSubmitError(undefined);

    track("order_submit");

    try {
      const utmSource =
        searchParams.get("utm_source") || undefined;

      const utmMedium =
        searchParams.get("utm_medium") || undefined;

      const utmCampaign =
        searchParams.get("utm_campaign") || undefined;

      const response = await fetch("/api/leads", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullName: lead.name,
          mobile: lead.mobile,

          houseBuilding: delivery.houseBuilding,
          streetArea: delivery.streetArea,
          locality: delivery.locality,
          district: delivery.district,
          state: delivery.state,
          pincode: delivery.pincode,

          quantity: Number(delivery.quantity),

          source: utmSource || "Website",

          utmSource,
          utmMedium,
          utmCampaign,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(
          data?.error === "Validation failed."
            ? "Please check the highlighted fields and try again."
            : "Something went wrong. Please try again or contact support."
        );

        setSubmitting(false);
        return;
      }

      if (!data?.leadId) {
        setSubmitError(
          "Order was submitted, but the confirmation ID was not received. Please contact support."
        );

        setSubmitting(false);
        return;
      }

      router.push(
        `/thank-you?leadId=${encodeURIComponent(data.leadId)}`
      );
    } catch (error) {
      console.error("Order submission error:", error);

      setSubmitError(
        "Network error. Please check your connection and try again."
      );

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

function OrderPageFallback() {
  return (
    <main className="container-page py-10 sm:py-16">
      <div className="flex min-h-[300px] items-center justify-center">
        <p>Loading order form...</p>
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<OrderPageFallback />}>
      <OrderPageContent />
    </Suspense>
  );
}