"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

export function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">{t("notFound.title")}</p>
        <Link href="/">
          <Button>
            <Home className="mr-2 size-4" />
            {t("notFound.home")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
