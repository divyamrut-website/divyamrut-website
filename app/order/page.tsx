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
      setSubmitError("Customer details are missing. Please go back and try again.");
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

      const payload = {
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
      };

      console.log("Submitting order:", payload);

      const response = await fetch("/api/leads", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(payload),
      });

      /*
       * Don't immediately call response.json().
       * First read the response as text so that an HTML/empty/error
       * response doesn't create another JSON parsing error.
       */
      const responseText = await response.text();

      console.log("API status:", response.status);
      console.log("API response:", responseText);

      let data: any = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error(
            "API returned non-JSON response:",
            jsonError
          );

          setSubmitError(
            `Server error (${response.status}). Please try again.`
          );

          setSubmitting(false);
          return;
        }
      }

      /*
       * HTTP error from /api/leads
       */
      if (!response.ok) {
        console.error("API request failed:", {
          status: response.status,
          data,
        });

        if (data?.error === "Validation failed.") {
          setSubmitError(
            "Please check the highlighted fields and try again."
          );
        } else if (data?.error) {
          setSubmitError(data.error);
        } else {
          setSubmitError(
            `Order could not be submitted (${response.status}). Please try again.`
          );
        }

        setSubmitting(false);
        return;
      }

      /*
       * Successful request but no lead ID
       */
      if (!data?.leadId) {
        console.error(
          "Successful API response but leadId is missing:",
          data
        );

        setSubmitError(
          "Order was submitted, but the confirmation ID was not received. Please contact support."
        );

        setSubmitting(false);
        return;
      }

      /*
       * Everything worked
       */
      console.log("Order successfully created:", data.leadId);

      router.push(
        `/thank-you?leadId=${encodeURIComponent(data.leadId)}`
      );
    } catch (error) {
      console.error("Order submission error:", error);

      /*
       * This means the browser could not complete the fetch itself.
       */
      setSubmitError(
        "Unable to connect to the order server. Please check your internet connection and try again."
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