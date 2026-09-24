export default function Ingredients() {
  return (
    <section id="ingredients" className="container-page py-14 sm:py-20">
      <p className="section-label">Ingredients</p>
      <h2 className="mt-2 max-w-2xl text-2xl font-bold text-forest sm:text-3xl">
        Rooted in traditional Ayurvedic herbs
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/75">
        Divyamrut is prepared from a blend of traditional Ayurvedic herbs, in
        line with the preparation process shown on the product packaging. The
        detailed, ingredient-by-ingredient list will be published here as
        soon as it is confirmed by Precious Ayurveda, so that every claim on
        this page stays accurate.
      </p>
      <div className="mt-6 card p-6 text-sm text-charcoal/70">
        <p className="font-semibold text-forest">To be added once verified:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Full ingredient list with proportions</li>
          <li>Source/region of key herbs, where relevant</li>
          <li>Any applicable certification marks</li>
        </ul>
      </div>
    </section>
  );
}
