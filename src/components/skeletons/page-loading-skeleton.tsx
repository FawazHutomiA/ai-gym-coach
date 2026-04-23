import { cn } from "@/components/ui/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type PageLoadingVariant = "default" | "auth" | "minimal" | "marketing";

type Props = {
  variant?: PageLoadingVariant;
  className?: string;
};

/**
 * Hanya skeleton — dipakai di `loading.tsx` antar rute. Tanpa spinner/teks.
 */
export function PageLoadingSkeleton({ variant = "default", className }: Props) {
  if (variant === "auth") {
    return (
      <div
        className={cn("w-full max-w-sm mx-auto space-y-6 p-4", className)}
        aria-busy
        aria-label="Loading"
      >
        <Skeleton className="h-9 w-36 mx-auto rounded-md" />
        <div className="space-y-4 rounded-xl border border-border/60 p-6">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("space-y-3 max-w-lg", className)} aria-busy aria-label="Loading">
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-4 w-full max-w-md rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>
    );
  }

  if (variant === "marketing") {
    return (
      <div className={cn("space-y-8", className)} aria-busy aria-label="Loading">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Skeleton className="h-8 w-8 rounded-md shrink-0" />
            <Skeleton className="h-6 w-40 max-w-full rounded-md" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-10 w-full max-w-md rounded-md" />
            <Skeleton className="h-5 w-full max-w-sm rounded-md" />
            <Skeleton className="h-5 w-4/5 max-w-sm rounded-md" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
          </div>
          <Skeleton className="min-h-[240px] rounded-2xl" />
        </div>
      </div>
    );
  }

  // default: konten bebas (dashboard, admin panel, onboarding panjang, dll.)
  return (
    <div
      className={cn("space-y-6 animate-in fade-in-0 duration-200", className)}
      aria-busy
      aria-label="Loading"
    >
      <div className="space-y-3">
        <Skeleton className="h-8 w-48 max-w-full rounded-md" />
        <Skeleton className="h-4 w-full max-w-lg rounded-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  );
}
