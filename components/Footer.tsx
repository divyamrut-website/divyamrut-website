import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-forest/10 bg-cream-light py-10 pb-24 sm:pb-10">
      <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-serif text-lg font-bold text-forest">{SITE.brand}</p>
          <p className="mt-1 text-xs text-charcoal/60">by {SITE.parentBrand}</p>
          <p className="mt-3 text-xs text-charcoal/60">
            {SITE.supportPhoneDisplay} · {SITE.email}
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-charcoal/70">
          <Link href="/policies/privacy">Privacy Policy</Link>
          <Link href="/policies/terms">Terms & Conditions</Link>
          <Link href="/policies/shipping">Shipping Policy</Link>
          <Link href="/policies/returns">Return &amp; Refund Policy</Link>
          <Link href="/support">Contact Us</Link>
        </nav>
      </div>
      <p className="container-page mt-6 text-xs text-charcoal/40">
        © {new Date().getFullYear()} {SITE.parentBrand}. All rights reserved.
      </p>
    </footer>
  );
}
