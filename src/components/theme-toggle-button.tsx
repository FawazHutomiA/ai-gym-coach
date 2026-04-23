"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { useI18n } from "@/contexts/i18n-context";

type ThemeToggleButtonProps = {
  className?: string;
  /** Icon size classes, e.g. `size-4` or `size-5` */
  iconClassName?: string;
};

export function ThemeToggleButton({ className, iconClassName }: ThemeToggleButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  const size = iconClassName ?? "size-5";

  const ariaLabel = !mounted
    ? t("theme.toggleAria")
    : theme === "dark"
      ? t("theme.switchToLight")
      : t("theme.switchToDark");

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {!mounted ? (
        <span className={cn("inline-block shrink-0", size)} aria-hidden />
      ) : theme === "dark" ? (
        <Sun className={cn(size)} />
      ) : (
        <Moon className={cn(size)} />
      )}
    </Button>
  );
}
