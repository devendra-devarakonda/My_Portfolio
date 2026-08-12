import type { Metadata } from "next";
import { Orbitron, Inter, JetBrains_Mono, Outfit, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/effects/SmoothScrollProvider";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-family-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-family-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-family-mono",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-family-outfit",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-family-share-tech",
  display: "swap",
});

const siteUrl = "https://devdevarakonda.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Devendra Devarakonda | Dev Devarakonda — Full Stack Developer & AI Engineer",
    template: "%s | Devendra Devarakonda",
  },
  description:
    "Official portfolio of Devendra Devarakonda (Dev Devarakonda) — Full Stack Developer & AI Engineer specializing in React, Next.js, Node.js, and Machine Learning.",
  keywords: [
    "Devendra Devarakonda",
    "Dev Devarakonda",
    "devdevarakonda",
    "Dev Devarakonda Velora",
    "Velora Tech",
    "Velora",
    "VeloraTech",
    "Devendra Devarakonda Portfolio",
    "Dev Devarakonda Software Engineer",
    "AI Developer",
    "Software Founder",
    "Full Stack Developer India",
    "AI Engineer Portfolio",
  ],
  authors: [{ name: "Devendra Devarakonda", url: siteUrl }],
  creator: "Devendra Devarakonda",
  publisher: "Devendra Devarakonda",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Devendra Devarakonda (Dev Devarakonda) | Full Stack & AI Engineer",
    description:
      "Explore the portfolio, AI projects, and full-stack software built by Devendra Devarakonda.",
    siteName: "Devendra Devarakonda Portfolio",
    images: [
      {
        url: `${siteUrl}/images/hero.jpg`,
        width: 1200,
        height: 630,
        alt: "Devendra Devarakonda — Full Stack Developer & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devendra Devarakonda | Dev Devarakonda",
    description:
      "Full Stack Developer & AI Engineer portfolio of Devendra Devarakonda.",
    images: [`${siteUrl}/images/hero.jpg`],
    creator: "@devdevarakonda",
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics (gtag.js) - Direct Head script for 100% instant detection by Google Tag Assistant */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-C0K6QJYFFL"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-C0K6QJYFFL');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} ${outfit.variable} ${shareTechMono.variable} min-h-screen bg-[#050B17] text-white antialiased overflow-x-hidden`} suppressHydrationWarning>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
