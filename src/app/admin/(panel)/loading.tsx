import { PageLoadingSkeleton } from "@/components/skeletons/page-loading-skeleton";

export default function AdminPanelLoading() {
  return (
    <div className="p-6 lg:p-8 w-full min-h-[50vh]">
      <PageLoadingSkeleton variant="default" />
    </div>
  );
}
