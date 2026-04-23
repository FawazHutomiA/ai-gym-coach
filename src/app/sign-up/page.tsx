import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { postSignInPathForRole } from "@/lib/auth/post-sign-in-path";
import { AuthBackLink } from "@/components/auth/auth-back-link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) {
    redirect(postSignInPathForRole(session.user.role));
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <AuthBackLink />
      <SignUpForm />
    </div>
  );
}
