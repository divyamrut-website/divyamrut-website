import { SITE } from "@/lib/constants";

const rows: [string, string][] = [
  ["Product Name", "Divyamrut"],
  ["Brand", `${SITE.brand} by ${SITE.parentBrand}`],
  ["Description", SITE.tagline],
  ["Usage", SITE.usage],
  ["Net Quantity", "To be confirmed"],
  ["MRP", "To be confirmed"],
  ["Manufacturer / Marketer", "To be confirmed"],
  ["License / Certification", "To be confirmed"],
  ["Customer Support", `${SITE.supportPhoneDisplay} · ${SITE.email}`],
];

export default function ProductDetails() {
  return (
    <section id="product-details" className="container-page py-14 sm:py-20">
      <p className="section-label">Product Details</p>
      <h2 className="mt-2 max-w-2xl text-2xl font-bold text-forest sm:text-3xl">
        Everything in one place
      </h2>
      <div className="mt-8 overflow-hidden rounded-xl2 border border-forest/10">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-6 ${
              i % 2 === 0 ? "bg-cream-light" : "bg-cream"
            }`}
          >
            <span className="w-48 shrink-0 text-sm font-semibold text-forest">{label}</span>
            <span className="text-sm text-charcoal/80">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
