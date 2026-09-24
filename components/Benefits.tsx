const benefits = [
  {
    title: "Traditional Preparation",
    body: "Made following traditional Ayurvedic preparation methods, as reflected on the product packaging.",
  },
  {
    title: "Organic Positioning",
    body: "Marketed as an organic product — final ingredient sourcing and certification to be confirmed and published once verified.",
  },
  {
    title: "Part of a Trusted Family",
    body: `${"Precious Ayurveda"} brings Divyamrut as part of its wider Ayurvedic product range.`,
  },
  {
    title: "Simple Daily Routine",
    body: "Designed to fit easily into a daily wellness routine with clear usage instructions.",
  },
];

export default function Benefits() {
  return (
    <section id="why" className="bg-cream-light py-14 sm:py-20">
      <div className="container-page">
        <p className="section-label">Why Divyamrut</p>
        <h2 className="mt-2 max-w-2xl text-2xl font-bold text-forest sm:text-3xl">
          Verified reasons customers choose Divyamrut
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="card p-6">
              <h3 className="text-lg font-semibold text-forest">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{b.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-charcoal/50">
          Product information to be verified: specific health benefits beyond
          the above will be added once confirmed by the brand and, where
          required, supported by appropriate regulatory approval.
        </p>
      </div>
    </section>
  );
}
