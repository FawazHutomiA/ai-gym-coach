"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/contexts/i18n-context";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  /** Dari `auth()` di server — wajib agar `useSession()` di klien sesuai cookie (NextAuth v5 + App Router). */
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <I18nProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
