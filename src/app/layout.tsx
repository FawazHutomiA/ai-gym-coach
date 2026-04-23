import type { Metadata } from "next";
import { auth } from "@/auth";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Gym Coach",
  description:
    "AI-powered fitness coach UI — workouts, logging, weekly adjustments, and nutrition tracking.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
