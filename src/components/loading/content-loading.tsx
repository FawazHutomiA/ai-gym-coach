"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/components/ui/utils";

type ContentLoadingProps = {
  variant?: "admin" | "compact";
  className?: string;
  /** Dibiarkan agar signatur API lama masih jalan; konten hanya skeleton. */
  titleKey?: string;
  subtitleKey?: string;
};

/**
 * Hanya skeleton — dipakai admin & halaman yang fetch di klien. Tanpa spinner/teks.
 */
export function ContentLoading({ variant = "admin", className }: ContentLoadingProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn("flex min-h-[28vh] flex-col items-stretch justify-center gap-4 px-6 py-10", className)}
        aria-busy
        aria-label="Loading"
      >
        <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
        <div className="max-w-sm mx-auto w-full space-y-2">
          <Skeleton className="h-4 w-3/4 mx-auto rounded-md" />
          <Skeleton className="h-3 w-1/2 mx-auto rounded-md" />
        </div>
        <div className="flex justify-center gap-1.5 pt-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-1.5 w-1.5 rounded-full" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 lg:p-8 space-y-8", className)} aria-busy aria-label="Loading">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3 flex-1 max-w-2xl">
          <Skeleton className="h-10 w-52 rounded-xl" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 max-w-md rounded-md hidden sm:block" />
        </div>
        <div
          className="flex shrink-0 items-center gap-3 rounded-2xl border border-border/80 dark:border-border bg-card/90 dark:bg-card/70 bg-gradient-to-br from-card via-card to-primary/[0.06] dark:to-primary/10 px-4 py-3 shadow-md"
        >
          <Skeleton className="size-11 rounded-xl" />
          <div className="min-w-0 pr-1 space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/70 dark:border-primary/20 bg-gradient-to-b from-muted/50 via-muted/25 to-transparent dark:from-muted/30 dark:via-muted/15 dark:to-transparent p-6 sm:p-8"
      >
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton
                className="h-12 flex-1 rounded-xl"
                style={{ opacity: 1 - i * 0.06 }}
              />
              <Skeleton className="h-12 w-24 rounded-xl hidden md:block" style={{ opacity: 0.85 }} />
              <Skeleton className="h-12 w-32 rounded-xl" style={{ opacity: 0.8 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
