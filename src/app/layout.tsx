import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "ArogyaNet — Public Health Operations & Resilience Platform",
  description: "Next-generation rural health facility monitoring, stock-out forecasting and AI redistribution platform for district administrators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#EDEEF0] text-[#111318]">
        <Navigation />
        <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-8 py-6">
          {children}
        </main>
        <footer className="mt-auto border-t border-[#E7E9EE] bg-white py-4 text-center text-xs text-[#8D93A1]">
          <div className="max-w-[1720px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-[#111318]">ArogyaNet</span> • Public Health Emergency Logistics and Early Warning System
            </div>
            <div>
              Built for District Health Surveillance • Powered by Deterministic Forecasting + Gemini AI
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
