import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductIntro from "@/components/ProductIntro";
import Benefits from "@/components/Benefits";
import Ingredients from "@/components/Ingredients";
import HowToUse from "@/components/HowToUse";
import ProductDetails from "@/components/ProductDetails";
import TrustSection from "@/components/TrustSection";
import FAQ from "@/components/FAQ";
import OrderCTA from "@/components/OrderCTA";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductIntro />
        <Benefits />
        <Ingredients />
        <HowToUse />
        <ProductDetails />
        <TrustSection />
        <FAQ />
        <OrderCTA />
        <SupportSection />
      </main>
      <Footer />
    </>
  );
}
