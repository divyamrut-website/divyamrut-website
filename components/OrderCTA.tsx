import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function OrderCTA() {
  return (
    <section className="bg-forest py-14 text-cream-light sm:py-16">
      <div className="container-page flex flex-col items-center gap-5 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready to try {SITE.brand}?</h2>
        <p className="max-w-md text-sm text-cream-light/80">
          Share your details and our team will verify and confirm your order
          before it ships.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/order" className="btn-primary !bg-cream-light !text-forest hover:!bg-cream">
            Order Now
          </Link>
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !border-cream-light !text-cream-light hover:!bg-cream-light hover:!text-forest"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
