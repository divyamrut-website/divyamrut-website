import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/constants";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand} — ${SITE.tagline} | ${SITE.parentBrand}`,
    template: `%s | ${SITE.brand}`,
  },
  description:
    "Divyamrut by Precious Ayurveda — a traditionally prepared, organic Ayurvedic amrut. Learn what it is, how to use it, and order online with verified delivery.",
  keywords: [
    "Divyamrut",
    "Precious Ayurveda",
    "organic ayurvedic amrut",
    "anti-aging ayurveda Kerala",
    "Ayurvedic tonic Kerala",
  ],
  openGraph: {
    title: `${SITE.brand} — ${SITE.tagline}`,
    description:
      "A modern digital expression of traditional Ayurvedic heritage. Discover Divyamrut by Precious Ayurveda.",
    url: SITE.url,
    siteName: SITE.brand,
    images: [{ url: "/images/divyamrut-packaging.jpeg", width: 1024, height: 1536 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.brand} — ${SITE.tagline}`,
    description: "Discover Divyamrut by Precious Ayurveda.",
    images: ["/images/divyamrut-packaging.jpeg"],
  },
  alternates: { canonical: SITE.url },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.parentBrand,
    url: SITE.url,
    logo: `${SITE.url}/images/precious-logo.png`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+91-${SITE.supportPhone}`,
        contactType: "customer service",
        email: SITE.email,
        areaServed: "IN",
      },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: SITE.brand,
    description: SITE.tagline,
    brand: { "@type": "Brand", name: SITE.parentBrand },
    image: `${SITE.url}/images/divyamrut-packaging.jpeg`,
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </head>
      <body>
        {children}
        <StickyMobileCTA />
      </body>
    </html>
  );
}
