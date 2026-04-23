"use client";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/components/ui/utils";
import { useI18n } from "@/contexts/i18n-context";

type ContentLoadingProps = {
  variant?: "admin" | "compact";
  titleKey?: string;
  subtitleKey?: string;
  className?: string;
};

export function ContentLoading({
  variant = "admin",
  titleKey = "loading.admin.defaultTitle",
  subtitleKey = "loading.admin.defaultSubtitle",
  className,
}: ContentLoadingProps) {
  const { t } = useI18n();
  const title = t(titleKey);
  const subtitle = t(subtitleKey);

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex min-h-[28vh] flex-col items-center justify-center gap-6 px-6 py-12",
          className,
        )}
      >
        <div className="relative flex size-16 items-center justify-center">
          <span
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-90 dark:from-primary/30 dark:to-primary/10 dark:opacity-80 animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <span className="absolute inset-0 rounded-2xl bg-primary/10 dark:bg-primary/20 blur-md" />
          <div
            className="relative flex size-14 items-center justify-center rounded-2xl border border-primary/25 dark:border-primary/35 bg-gradient-to-br from-background to-muted/40 dark:from-card dark:to-muted/30 shadow-lg dark:shadow-md dark:shadow-black/20"
          >
            <Loader2 className="size-7 text-primary animate-spin" aria-hidden />
          </div>
        </div>
        <div className="max-w-xs text-center space-y-2">
          <p className="text-sm font-semibold tracking-tight text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
          <div className="flex justify-center gap-1.5 pt-1" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="size-1.5 rounded-full bg-primary/60 dark:bg-primary/80 animate-bounce"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 lg:p-8 space-y-8", className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3 flex-1 max-w-2xl">
          <Skeleton className="h-10 w-52 rounded-xl bg-muted dark:bg-muted/80" />
          <Skeleton className="h-4 w-full rounded-md bg-muted dark:bg-muted/80" />
          <Skeleton className="h-4 w-4/5 max-w-md rounded-md hidden sm:block bg-muted dark:bg-muted/80" />
        </div>
        <div
          className="flex shrink-0 items-center gap-3 rounded-2xl border border-border/80 dark:border-border bg-card/90 dark:bg-card/70 bg-gradient-to-br from-card via-card to-primary/[0.06] dark:to-primary/10 px-4 py-3 shadow-md dark:shadow-lg dark:shadow-black/25"
        >
          <div className="relative flex size-11 items-center justify-center rounded-xl bg-primary/15 dark:bg-primary/25 ring-1 ring-primary/15 dark:ring-primary/25">
            <Loader2 className="size-5 text-primary animate-spin" aria-hidden />
          </div>
          <div className="min-w-0 pr-1">
            <p className="text-sm font-semibold leading-tight text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/70 dark:border-primary/20 bg-gradient-to-b from-muted/50 via-muted/25 to-transparent dark:from-muted/30 dark:via-muted/15 dark:to-transparent p-6 sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/35 to-transparent"
          aria-hidden
        />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton
                className="h-12 flex-1 rounded-xl bg-muted dark:bg-muted/70"
                style={{ opacity: 1 - i * 0.06 }}
              />
              <Skeleton
                className="h-12 w-24 rounded-xl hidden md:block bg-muted dark:bg-muted/70"
                style={{ opacity: 0.85 }}
              />
              <Skeleton className="h-12 w-32 rounded-xl bg-muted dark:bg-muted/70" style={{ opacity: 0.8 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
