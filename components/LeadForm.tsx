"use client";

import { useState } from "react";
import { isValidIndianMobile, isNonEmpty } from "@/lib/validation";
import { track } from "@/lib/analytics";
import type { LeadCaptureInput } from "@/lib/types";

export default function LeadForm({
  onContinue,
}: {
  onContinue: (data: LeadCaptureInput) => void;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});
  const [started, setStarted] = useState(false);

  function handleFocus() {
    if (!started) {
      setStarted(true);
      track("lead_form_start");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { name?: string; mobile?: string } = {};
    if (!isNonEmpty(name)) next.name = "Please enter your name.";
    if (!isValidIndianMobile(mobile)) next.mobile = "Enter a valid 10-digit mobile number.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    track("lead_form_complete");
    onContinue({ name: name.trim(), mobile: mobile.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card mx-auto max-w-md p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-forest">Order Divyamrut</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        Tell us who you are, and we'll take it from there.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-charcoal">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onFocus={handleFocus}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-forest/20 bg-cream-light px-4 py-3 text-base outline-none focus:border-forest"
            placeholder="e.g. Anjali Menon"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mobile" className="mb-1 block text-sm font-medium text-charcoal">
            Mobile / WhatsApp Number
          </label>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            value={mobile}
            onFocus={handleFocus}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full rounded-lg border border-forest/20 bg-cream-light px-4 py-3 text-base outline-none focus:border-forest"
            placeholder="10-digit mobile number"
            aria-invalid={!!errors.mobile}
            aria-describedby={errors.mobile ? "mobile-error" : undefined}
          />
          {errors.mobile && (
            <p id="mobile-error" className="mt-1 text-xs text-red-600">
              {errors.mobile}
            </p>
          )}
        </div>
      </div>

      <button type="submit" className="btn-primary mt-6 w-full">
        Continue
      </button>
    </form>
  );
}
