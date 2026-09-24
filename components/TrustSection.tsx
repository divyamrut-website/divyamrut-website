import Image from "next/image";
import { SITE } from "@/lib/constants";

const points = [
  "Part of the Precious Ayurveda family of products",
  "Genuine product packaging shown throughout this site",
  "Transparent, verified contact details — no hidden numbers",
  "Every order is personally verified by our team before it ships",
];

export default function TrustSection() {
  return (
    <section id="trust" className="bg-cream-light py-14 sm:py-20">
      <div className="container-page grid gap-10 sm:grid-cols-2 sm:items-center">
        <div>
          <p className="section-label">Why Trust {SITE.brand}</p>
          <h2 className="mt-2 text-2xl font-bold text-forest sm:text-3xl">
            Backed by {SITE.parentBrand}
          </h2>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-charcoal/80">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center gap-6">
          <Image
            src="/images/precious-logo.png"
            alt={`${SITE.parentBrand} logo`}
            width={110}
            height={110}
            className="rounded-full"
          />
          <span className="text-3xl text-forest/30">×</span>
          <Image
            src="/images/divyamrut-logo.jpeg"
            alt={`${SITE.brand} logo`}
            width={90}
            height={90}
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
