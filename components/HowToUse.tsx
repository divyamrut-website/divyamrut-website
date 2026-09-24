import { SITE } from "@/lib/constants";

const steps = [
  { title: "Measure", body: "Measure 25–50 ml of Divyamrut." },
  { title: "Time it", body: "Take it about 30 minutes before meals." },
  { title: "Repeat daily", body: "Use twice daily as part of your routine, or as directed by your Ayurvedic practitioner." },
];

export default function HowToUse() {
  return (
    <section id="how-to-use" className="bg-cream-light py-14 sm:py-20">
      <div className="container-page">
        <p className="section-label">How to Use</p>
        <h2 className="mt-2 max-w-2xl text-2xl font-bold text-forest sm:text-3xl">
          Simple, consistent daily use
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card p-6">
              <span className="text-sm font-bold text-bronze">STEP {i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold text-forest">{s.title}</h3>
              <p className="mt-2 text-sm text-charcoal/75">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-charcoal/50">{SITE.usage}</p>
      </div>
    </section>
  );
}
