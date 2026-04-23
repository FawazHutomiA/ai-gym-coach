import { PageLoadingSkeleton } from "@/components/skeletons/page-loading-skeleton";

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen w-full p-4 md:p-6">
      <div className="mx-auto max-w-3xl w-full">
        <PageLoadingSkeleton variant="default" />
      </div>
    </div>
  );
}
