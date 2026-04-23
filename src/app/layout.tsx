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
    <html lang="en" className="overflow-x-clip" suppressHydrationWarning>
      <body className="min-h-screen antialiased overflow-x-clip min-w-0 max-w-full">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
