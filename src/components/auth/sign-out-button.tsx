"use client";

import type { ComponentProps } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";

type SignOutButtonProps = {
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
};

export function SignOutButton({ variant = "ghost", className }: SignOutButtonProps) {
  const { t } = useI18n();
  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      {t("nav.signOut")}
    </Button>
  );
}
