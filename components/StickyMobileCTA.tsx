"use client";

import Link from "next/link";
import { SITE } from "@/lib/constants";
import { track } from "@/lib/analytics";

export default function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-forest/10 bg-cream-light/95 p-3 backdrop-blur sm:hidden">
      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { location: "sticky_cta" })}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-forest text-xl"
        aria-label="WhatsApp Us"
      >
        💬
      </a>
      <Link
        href="/order"
        onClick={() => track("order_cta_click", { location: "sticky_cta" })}
        className="btn-primary flex-1 !py-3"
      >
        Order Now
      </Link>
    </div>
  );
}
