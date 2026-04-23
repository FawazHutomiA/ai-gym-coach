import { PageLoadingSkeleton } from "@/components/skeletons/page-loading-skeleton";

export default function AdminForbiddenLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <PageLoadingSkeleton variant="minimal" />
    </div>
  );
}
