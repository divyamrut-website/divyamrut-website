import { SITE } from "@/lib/constants";

const faqs = [
  { q: "What is Divyamrut?", a: "Divyamrut is an organic, traditionally prepared Ayurvedic amrut from Precious Ayurveda." },
  { q: "How do I use Divyamrut?", a: SITE.usage },
  { q: "What are the ingredients?", a: "The full ingredient list is being finalized with the brand and will be published here once verified." },
  { q: "How much does it cost?", a: "Pricing will be shown here once confirmed. You can also ask our team directly via call or WhatsApp." },
  { q: "How do I order?", a: "Tap 'Order Now', share your name and mobile number, then add your delivery address. That's it." },
  { q: "How will my order be verified?", a: "After you submit your order, our support team will call or WhatsApp you to confirm your details before it ships." },
  { q: "How long does delivery take?", a: "Delivery timelines will be confirmed by our team when they verify your order." },
  { q: "How can I contact customer support?", a: `Call or WhatsApp us at ${SITE.supportPhoneDisplay}, or email ${SITE.email}.` },
  { q: "What is the return/refund policy?", a: "See our Return & Refund Policy page for full details." },
];

export default function FAQ() {
  return (
    <section id="faq" className="container-page py-14 sm:py-20">
      <p className="section-label">FAQ</p>
      <h2 className="mt-2 max-w-2xl text-2xl font-bold text-forest sm:text-3xl">
        Common questions
      </h2>
      <div className="mt-8 divide-y divide-forest/10 rounded-xl2 border border-forest/10">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-forest marker:content-none">
              <span className="flex items-center justify-between">
                {f.q}
                <span className="ml-4 text-bronze transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
