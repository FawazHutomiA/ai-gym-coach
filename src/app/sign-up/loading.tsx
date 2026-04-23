import { PageLoadingSkeleton } from "@/components/skeletons/page-loading-skeleton";

export default function SignUpLoading() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <PageLoadingSkeleton variant="auth" />
    </div>
  );
}
