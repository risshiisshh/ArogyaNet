import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "ArogyaNet — Civic Resilience Operations Platform",
  description: "Public health resource monitoring, forecasting, and inter-PHC redistribution network.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-app-bg min-h-screen text-text-primary antialiased font-body-md text-body-md">
        <div className="min-h-screen p-space-sm sm:p-space-lg lg:p-margin flex flex-col justify-start items-center">
          <div className="w-full max-w-[1440px] bg-workspace-surface rounded-lg shadow-[0_18px_45px_rgba(17,19,24,0.08)] flex flex-col min-h-[860px] p-space-md sm:p-space-lg lg:p-space-xl">
            <Navigation />
            {children}
            <footer className="w-full mt-space-xl pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-text-muted font-body-sm text-body-sm">
              <div>
                © 2025 ArogyaNet National Public Health Resilience Infrastructure. All rights reserved.
              </div>
              <div className="flex items-center gap-space-md">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-healthy"></span> Telemetry Active
                </span>
                <span>District Grid Status: Synced</span>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
