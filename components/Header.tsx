import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream-light/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/divyamrut-logo.jpeg"
            alt={`${SITE.brand} logo`}
            width={36}
            height={36}
            className="rounded-full object-cover"
            priority
          />
          <span className="font-serif text-lg font-bold tracking-wide text-forest">
            {SITE.brand}
          </span>
          <span className="hidden text-xs text-charcoal/60 sm:inline">
            by {SITE.parentBrand}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.supportPhone}`}
            className="hidden items-center gap-1 text-sm font-medium text-forest sm:flex"
          >
            📞 Call Us
          </a>
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 text-sm font-medium text-forest sm:flex"
          >
            WhatsApp
          </a>
          <Link href="/order" className="btn-primary !px-5 !py-2.5 text-sm">
            Order Now
          </Link>
        </div>
      </div>
    </header>
  );
}
