/**
 * Thin wrapper around window.dataLayer so every event has one call site.
 * Wire GTM (recommended) in app/layout.tsx once the container ID is known —
 * see README "Analytics" section. GTM can then fan events out to GA4,
 * Meta Pixel and Microsoft Clarity without further code changes.
 *
 * Usage: track("order_cta_click", { location: "hero" })
 */
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type AnalyticsEvent =
  | "page_view"
  | "hero_view"
  | "3_second_view"
  | "10_second_view"
  | "scroll_25"
  | "scroll_50"
  | "scroll_75"
  | "product_view"
  | "ingredient_view"
  | "how_to_use_view"
  | "order_cta_click"
  | "lead_form_open"
  | "lead_form_start"
  | "lead_form_complete"
  | "delivery_form_start"
  | "delivery_form_complete"
  | "order_submit"
  | "whatsapp_click"
  | "call_click"
  | "email_click";

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
