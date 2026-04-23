"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { useI18n } from "@/contexts/i18n-context";
import type { Locale } from "@/i18n/dictionaries";

type LanguageSwitcherProps = {
  className?: string;
  /** Compact: icon + EN/ID pills. Default shows label from dictionary */
  variant?: "default" | "compact";
};

export function LanguageSwitcher({ className, variant = "default" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  const Item = ({ value, label, compact }: { value: Locale; label: string; compact?: boolean }) => (
    <Button
      type="button"
      variant={locale === value ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        compact
          ? "h-7 min-w-[1.75rem] shrink-0 px-1.5 text-[11px] font-semibold rounded-[5px]"
          : "h-8 px-2.5 text-xs font-medium",
        locale === value && "bg-primary/15 text-primary hover:bg-primary/20",
      )}
      onClick={() => setLocale(value)}
      aria-pressed={locale === value}
    >
      {label}
    </Button>
  );

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex w-fit shrink-0 items-center gap-0 rounded-md border bg-muted/40 p-px",
          className,
        )}
      >
        <Item value="en" label="EN" compact />
        <Item value="id" label="ID" compact />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2", className)}>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Languages className="size-3.5 shrink-0" aria-hidden />
        <span className="hidden sm:inline">{t("common.language")}</span>
      </span>
      <div className="flex items-center gap-0.5 rounded-lg border bg-muted/40 p-0.5">
        <Item value="en" label={t("lang.en")} />
        <Item value="id" label={t("lang.id")} />
      </div>
    </div>
  );
}
