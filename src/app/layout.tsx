import type { Metadata } from "next";
import { Orbitron, Inter, JetBrains_Mono, Outfit, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Devendra Devarakonda | Full Stack Developer & AI Engineer",
  description:
    "Portfolio of Devendra Devarakonda — Full Stack Developer & AI Engineer. Building scalable software, AI-powered products, and immersive digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} ${outfit.variable} ${shareTechMono.variable} min-h-screen bg-[#050B17] text-white antialiased overflow-x-hidden`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
