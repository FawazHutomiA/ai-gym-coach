"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/contexts/i18n-context";
import {
  Dumbbell,
  LayoutDashboard,
  LineChart,
  PenSquare,
  TrendingUp,
  Utensils,
  Menu,
  X,
  User,
} from "lucide-react";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { SignOutButton } from "@/components/auth/sign-out-button";

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavItem = { name: string; href: string; icon: typeof LayoutDashboard };

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useI18n();

  const navigation: NavItem[] = useMemo(
    () => [
      { name: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
      { name: t("nav.profile"), href: "/dashboard/profile", icon: User },
      { name: t("nav.workouts"), href: "/dashboard/workouts", icon: Dumbbell },
      { name: t("nav.logWorkout"), href: "/dashboard/log-workout", icon: PenSquare },
      { name: t("nav.workoutHistory"), href: "/dashboard/workout-history", icon: LineChart },
      { name: t("nav.adjustment"), href: "/dashboard/adjustment", icon: TrendingUp },
      { name: t("nav.nutrition"), href: "/dashboard/nutrition", icon: Utensils },
    ],
    [t],
  );

  /** Pra-muat rute agar pindah halaman terasa instan; sidebar tetap statis, loading cuma di `loading.tsx` area konten. */
  useEffect(() => {
    for (const item of navigation) {
      router.prefetch(item.href);
    }
  }, [router, navigation]);

  return (
    <div className="min-h-screen bg-background min-w-0 max-w-full overflow-x-clip">
      <div className="lg:hidden border-b bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-40 max-w-full min-w-0">
        <div className="flex items-center gap-2">
          <Dumbbell className="size-6 text-primary" />
          <span className="font-bold">AI Gym Coach</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="compact" />
          <ThemeToggleButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen z-50
            w-64 border-r bg-card/50 backdrop-blur-xl
            transition-transform duration-300 lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="p-6 border-b hidden lg:flex items-center gap-2 min-w-0">
            <Dumbbell className="size-6 text-primary shrink-0" />
            <span className="font-bold truncate">AI Gym Coach</span>
          </div>

          <nav className="p-4 space-y-2" aria-label="Main">
            {navigation.map((item) => {
              const isActive = isNavActive(pathname, item.href);
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : ""
                  }`}
                  asChild
                >
                  <Link
                    href={item.href}
                    prefetch
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center"
                  >
                    <item.icon className="mr-3 size-5 shrink-0" aria-hidden />
                    <span className="truncate text-left flex-1">{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card/80 backdrop-blur space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/" prefetch onClick={() => setSidebarOpen(false)}>
                {t("nav.backLanding")}
              </Link>
            </Button>
            <SignOutButton variant="outline" className="w-full text-muted-foreground" />
          </div>
        </aside>

        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6 lg:p-8">
            <div className="hidden lg:flex justify-end items-center gap-2 mb-6">
              <LanguageSwitcher variant="compact" className="shrink-0" />
              <ThemeToggleButton iconClassName="size-4" />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
