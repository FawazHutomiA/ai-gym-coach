"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/contexts/i18n-context";
import {
  Dumbbell,
  LayoutDashboard,
  PenSquare,
  TrendingUp,
  Utensils,
  Menu,
  X,
  User,
} from "lucide-react";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useI18n();

  const navigation = useMemo(
    () => [
      { name: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
      { name: t("nav.profile"), href: "/dashboard/profile", icon: User },
      { name: t("nav.workouts"), href: "/dashboard/workouts", icon: Dumbbell },
      { name: t("nav.logWorkout"), href: "/dashboard/log-workout", icon: PenSquare },
      { name: t("nav.adjustment"), href: "/dashboard/adjustment", icon: TrendingUp },
      { name: t("nav.nutrition"), href: "/dashboard/nutrition", icon: Utensils },
    ],
    [t],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-40">
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
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
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

          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : ""
                    }`}
                  >
                    <item.icon className="mr-3 size-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card/80 backdrop-blur">
            <Link href="/">
              <Button variant="outline" className="w-full">
                {t("nav.backLanding")}
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
            {/* Desktop: bahasa & tema di kanan (satu tempat; mobile ada di header atas) */}
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
