import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-light to-cream pb-14 pt-10 sm:pb-20 sm:pt-16">
      <div className="container-page grid items-center gap-10 sm:grid-cols-2">
        <div className="order-2 sm:order-1">
          <p className="section-label mb-3">{SITE.parentBrand} Presents</p>
          <h1 className="text-4xl font-bold leading-tight text-forest sm:text-5xl">
            {SITE.brand}
          </h1>
          <p className="mt-3 text-lg font-medium text-bronze">{SITE.tagline}</p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal/80">
            A traditionally prepared Ayurvedic amrut, crafted the way it has
            been for generations — now available with verified, doorstep
            delivery across India.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/order" className="btn-primary">
              Order Now
            </Link>
            <a href={`tel:${SITE.supportPhone}`} className="text-sm font-medium text-forest underline underline-offset-4">
              Questions? Call {SITE.supportPhone}
            </a>
          </div>
        </div>

        <div className="order-1 sm:order-2">
          <div className="relative mx-auto aspect-[2/3] w-56 sm:w-72">
            <Image
              src="/images/divyamrut-packaging.jpeg"
              alt="Divyamrut product packaging"
              fill
              priority
              className="rounded-2xl object-cover shadow-card"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
