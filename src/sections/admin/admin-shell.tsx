"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { Dumbbell, Shield, Users } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data } = useSession();
  const { t } = useI18n();

  const nav = [
    { href: "/admin/users", labelKey: "admin.shell.navUsers" as const, icon: Users },
    { href: "/admin/exercises", labelKey: "admin.shell.navExercises" as const, icon: Dumbbell },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-64 border-r border-border bg-card/60 dark:bg-card/40 backdrop-blur-sm p-4 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <Shield className="size-6 text-primary shrink-0" />
          <span className="font-bold truncate">{t("admin.shell.title")}</span>
        </div>
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={active ? "secondary" : "ghost"} className="w-full justify-start">
                <item.icon className="mr-2 size-4 shrink-0" />
                {t(item.labelKey)}
              </Button>
            </Link>
          );
        })}
        <div className="mt-auto pt-4 border-t border-border space-y-3">
          <div className="px-2 space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {t("admin.shell.appearance")}
            </p>
            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="compact" />
              <ThemeToggleButton className="shrink-0 border border-border/60 dark:border-border" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground px-2 truncate" title={data?.user?.email ?? ""}>
            {data?.user?.email}
          </p>
          <Button
            variant="outline"
            className="w-full border-border"
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            {t("admin.shell.signOut")}
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}
