import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Terms & Conditions" };

export default function Page() {
  return (
    <>
      <Header />
      <main className="container-page py-14 sm:py-20">
        <h1 className="text-2xl font-bold text-forest sm:text-3xl">Terms & Conditions</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/75">
          This is a placeholder for the Terms & Conditions. Replace this text with the
          brand's actual, legally reviewed policy before the site goes live.
          Do not publish this page with placeholder text.
        </p>
      </main>
      <Footer />
    </>
  );
}
