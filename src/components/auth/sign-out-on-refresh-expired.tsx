"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { useI18n } from "@/contexts/i18n-context";
import { toast } from "sonner";

/**
 * Bersihkan cookie sesi jika refresh token (7 hari) lewat, agar tidak mengulang
 * respon { user: null, error: … } setiap kali.
 */
export function SignOutOnRefreshExpired() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const didToast = useRef(false);

  useEffect(() => {
    if (session?.error === "RefreshTokenExpired") {
      if (!didToast.current) {
        didToast.current = true;
        toast.error(t("auth.toast.sessionExpired"));
      }
      void signOut({ callbackUrl: "/sign-in" });
    }
  }, [session?.error, t]);

  return null;
}
