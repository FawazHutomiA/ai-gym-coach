"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  LayoutDashboard,
  PenSquare,
  TrendingUp,
  Utensils,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
    { name: "Log Workout", href: "/dashboard/log-workout", icon: PenSquare },
    { name: "AI Adjustment", href: "/dashboard/adjustment", icon: TrendingUp },
    { name: "Nutrition", href: "/dashboard/nutrition", icon: Utensils },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Dumbbell className="size-6 text-primary" />
          <span className="font-bold">AI Gym Coach</span>
        </div>
        <div className="flex items-center gap-2">
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
          <div className="p-6 border-b hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="size-6 text-primary" />
              <span className="font-bold">AI Gym Coach</span>
            </div>
            <ThemeToggleButton iconClassName="size-4" />
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}>
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
                ← Back to Landing
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
