"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18n } from "@/contexts/i18n-context";
import { postSignInPathForRole } from "@/lib/auth/post-sign-in-path";

export function SignInForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (res?.error) {
        if (res.error === "Configuration") {
          toast.error(t("auth.toast.configError"));
        } else {
          toast.error(t("auth.toast.signInError"));
        }
        return;
      }
      const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
      const sessionJson = (await sessionRes.json()) as { user?: { role?: string } };
      router.push(postSignInPathForRole(sessionJson?.user?.role));
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="border-2 w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t("auth.signInTitle")}</CardTitle>
        <CardDescription>{t("auth.signInSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">{t("auth.email")}</Label>
            <Input
              id="signin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">{t("auth.password")}</Label>
            <Input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "…" : t("auth.signInSubmit")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              {t("auth.signUpLink")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
