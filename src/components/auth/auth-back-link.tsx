"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";

export function AuthBackLink() {
  const { t } = useI18n();
  return (
    <div className="absolute top-4 left-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/">← {t("auth.backHome")}</Link>
      </Button>
    </div>
  );
}
