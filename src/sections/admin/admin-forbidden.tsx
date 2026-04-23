"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/contexts/i18n-context";

export function AdminForbiddenClient() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="border-2 border-border dark:border-border max-w-md w-full shadow-lg dark:shadow-black/30">
        <CardHeader>
          <CardTitle>{t("admin.forbidden.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("admin.forbidden.description")}</p>
          <Button asChild className="w-full">
            <Link href="/dashboard">{t("admin.forbidden.backApp")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
