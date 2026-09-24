"use client";

import { useState } from "react";
import { isValidIndianMobile, isValidPincode, isNonEmpty } from "@/lib/validation";
import { track } from "@/lib/analytics";
import type { LeadCaptureInput } from "@/lib/types";

type FormState = {
  houseBuilding: string;
  streetArea: string;
  locality: string;
  district: string;
  state: string;
  pincode: string;
  quantity: string;
};

const emptyState: FormState = {
  houseBuilding: "",
  streetArea: "",
  locality: "",
  district: "",
  state: "",
  pincode: "",
  quantity: "1",
};

export default function DeliveryForm({
  lead,
  onSubmit,
  submitting,
  submitError,
}: {
  lead: LeadCaptureInput;
  onSubmit: (data: FormState) => void;
  submitting: boolean;
  submitError?: string;
}) {
  const [form, setForm] = useState<FormState>(emptyState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [started, setStarted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFocus() {
    if (!started) {
      setStarted(true);
      track("delivery_form_start");
    }
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!isNonEmpty(form.houseBuilding)) next.houseBuilding = "Required.";
    if (!isNonEmpty(form.streetArea)) next.streetArea = "Required.";
    if (!isNonEmpty(form.locality)) next.locality = "Required.";
    if (!isNonEmpty(form.district)) next.district = "Required.";
    if (!isNonEmpty(form.state)) next.state = "Required.";
    if (!isValidPincode(form.pincode)) next.pincode = "Enter a valid 6-digit PIN.";
    if (!form.quantity || Number(form.quantity) < 1) next.quantity = "Enter a valid quantity.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  const fields: { key: keyof FormState; label: string; placeholder: string }[] = [
    { key: "houseBuilding", label: "House / Building", placeholder: "House name / flat no." },
    { key: "streetArea", label: "Street / Area", placeholder: "Street or area" },
    { key: "locality", label: "Locality", placeholder: "Locality" },
    { key: "district", label: "District", placeholder: "District" },
    { key: "state", label: "State", placeholder: "State" },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="card mx-auto max-w-md p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-forest">Delivery Details</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        Hi {lead.name}, where should we deliver your Divyamrut?
      </p>

      <div className="mt-6 space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label htmlFor={f.key} className="mb-1 block text-sm font-medium text-charcoal">
              {f.label}
            </label>
            <input
              id={f.key}
              type="text"
              value={form[f.key]}
              onFocus={handleFocus}
              onChange={(e) => update(f.key, e.target.value)}
              className="w-full rounded-lg border border-forest/20 bg-cream-light px-4 py-3 text-base outline-none focus:border-forest"
              placeholder={f.placeholder}
              aria-invalid={!!errors[f.key]}
            />
            {errors[f.key] && <p className="mt-1 text-xs text-red-600">{errors[f.key]}</p>}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pincode" className="mb-1 block text-sm font-medium text-charcoal">
              PIN Code
            </label>
            <input
              id="pincode"
              type="text"
              inputMode="numeric"
              value={form.pincode}
              onFocus={handleFocus}
              onChange={(e) => update("pincode", e.target.value)}
              className="w-full rounded-lg border border-forest/20 bg-cream-light px-4 py-3 text-base outline-none focus:border-forest"
              placeholder="682001"
              aria-invalid={!!errors.pincode}
            />
            {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
          </div>
          <div>
            <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-charcoal">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={form.quantity}
              onFocus={handleFocus}
              onChange={(e) => update("quantity", e.target.value)}
              className="w-full rounded-lg border border-forest/20 bg-cream-light px-4 py-3 text-base outline-none focus:border-forest"
              aria-invalid={!!errors.quantity}
            />
            {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
          </div>
        </div>
      </div>

      {submitError && <p className="mt-4 text-sm text-red-600">{submitError}</p>}

      <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full disabled:opacity-60">
        {submitting ? "Submitting…" : "Confirm Order"}
      </button>
    </form>
  );
}
