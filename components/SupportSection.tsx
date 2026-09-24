import { SITE } from "@/lib/constants";

export default function SupportSection() {
  return (
    <section id="support" className="container-page py-14 sm:py-20">
      <p className="section-label">Customer Support</p>
      <h2 className="mt-2 max-w-2xl text-2xl font-bold text-forest sm:text-3xl">
        We're here to help
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <a href={`tel:${SITE.supportPhone}`} className="card flex flex-col items-center gap-2 p-6 text-center transition-transform hover:-translate-y-0.5">
          <span className="text-2xl">📞</span>
          <span className="text-sm font-semibold text-forest">Call Us</span>
          <span className="text-xs text-charcoal/60">{SITE.supportPhoneDisplay}</span>
        </a>
        <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="card flex flex-col items-center gap-2 p-6 text-center transition-transform hover:-translate-y-0.5">
          <span className="text-2xl">💬</span>
          <span className="text-sm font-semibold text-forest">WhatsApp Us</span>
          <span className="text-xs text-charcoal/60">{SITE.supportPhoneDisplay}</span>
        </a>
        <a href={`mailto:${SITE.email}`} className="card flex flex-col items-center gap-2 p-6 text-center transition-transform hover:-translate-y-0.5">
          <span className="text-2xl">✉️</span>
          <span className="text-sm font-semibold text-forest">Email Us</span>
          <span className="text-xs text-charcoal/60">{SITE.email}</span>
        </a>
      </div>
    </section>
  );
}
