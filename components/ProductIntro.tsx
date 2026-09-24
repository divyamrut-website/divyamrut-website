export default function ProductIntro() {
  return (
    <section id="about" className="container-page py-14 sm:py-20">
      <p className="section-label">What is Divyamrut?</p>
      <h2 className="mt-2 max-w-2xl text-2xl font-bold text-forest sm:text-3xl">
        A traditional Ayurvedic amrut, prepared with care
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/80">
        Divyamrut is an organic Ayurvedic amrut from Precious Ayurveda,
        prepared using traditional methods rooted in Ayurvedic heritage. It
        is positioned as part of a daily wellness routine — not a medical
        treatment.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          "Organic, traditionally prepared amrut",
          "Rooted in Ayurvedic heritage",
          "Part of Precious Ayurveda's product family",
          "Simple daily-routine usage",
        ].map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm text-charcoal/80">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
