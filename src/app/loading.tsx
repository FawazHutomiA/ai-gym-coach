import { PageLoadingSkeleton } from "@/components/skeletons/page-loading-skeleton";

export default function RootPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4 sm:px-4">
        <PageLoadingSkeleton variant="marketing" />
      </div>
    </div>
  );
}
