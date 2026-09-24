import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportSection from "@/components/SupportSection";

export const metadata = { title: "Contact Us" };

export default function SupportPage() {
  return (
    <>
      <Header />
      <main>
        <SupportSection />
      </main>
      <Footer />
    </>
  );
}
