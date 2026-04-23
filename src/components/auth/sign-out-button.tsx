"use client";

import { useState, type ComponentProps } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";

type SignOutButtonProps = {
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
};

export function SignOutButton({ variant = "ghost", className }: SignOutButtonProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={loading}
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        try {
          await signOut({ callbackUrl: "/" });
        } catch {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" />
      ) : (
        t("nav.signOut")
      )}
    </Button>
  );
}
