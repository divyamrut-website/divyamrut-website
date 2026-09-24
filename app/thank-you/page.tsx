import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/constants";

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { leadId?: string };
}) {
  return (
    <>
      <Header />
      <main className="container-page flex flex-col items-center py-16 text-center sm:py-24">
        <span className="text-5xl">🌿</span>
        <h1 className="mt-4 text-2xl font-bold text-forest sm:text-3xl">
          Thank you for choosing {SITE.brand}
        </h1>
        <p className="mt-3 max-w-md text-sm text-charcoal/75">
          Your order request has been received. Our customer support team
          will contact you shortly to verify your details.
        </p>
        {searchParams.leadId && (
          <p className="mt-2 text-xs text-charcoal/50">
            Reference ID: {searchParams.leadId}
          </p>
        )}

        <div className="mt-8 card w-full max-w-sm p-6 text-left text-sm">
          <p className="font-semibold text-forest">Need help sooner?</p>
          <p className="mt-2 text-charcoal/70">Customer Support: {SITE.supportPhoneDisplay}</p>
          <p className="text-charcoal/70">WhatsApp: {SITE.supportPhoneDisplay}</p>
          <p className="text-charcoal/70">Email: {SITE.email}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
