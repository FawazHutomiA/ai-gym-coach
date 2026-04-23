"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dumbbell,
  Target,
  TrendingUp,
  Zap,
  Brain,
  Calendar,
  BarChart3,
  Utensils,
  ArrowRight,
  Check,
  Menu,
  X,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/contexts/i18n-context";

export function LandingPage() {
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isAuthed = Boolean(session?.user);
  const accountHref = isAuthed ? "/dashboard" : "/sign-in";
  const accountLabel = isAuthed ? t("nav.dashboard") : t("auth.signInLink");

  const closeMobileNav = () => setMobileNavOpen(false);

  const problems = useMemo(
    () => [
      {
        icon: TrendingUp,
        title: t("landing.problems.0.title"),
        description: t("landing.problems.0.desc"),
      },
      {
        icon: Utensils,
        title: t("landing.problems.1.title"),
        description: t("landing.problems.1.desc"),
      },
      {
        icon: Calendar,
        title: t("landing.problems.2.title"),
        description: t("landing.problems.2.desc"),
      },
    ],
    [t],
  );

  const features = useMemo(
    () =>
      [
        {
          icon: Target,
          gradient: "from-blue-500 to-cyan-500",
          title: t("landing.features.0.title"),
          description: t("landing.features.0.desc"),
        },
        {
          icon: Dumbbell,
          gradient: "from-purple-500 to-pink-500",
          title: t("landing.features.1.title"),
          description: t("landing.features.1.desc"),
        },
        {
          icon: BarChart3,
          gradient: "from-orange-500 to-red-500",
          title: t("landing.features.2.title"),
          description: t("landing.features.2.desc"),
        },
        {
          icon: Brain,
          gradient: "from-green-500 to-emerald-500",
          title: t("landing.features.3.title"),
          description: t("landing.features.3.desc"),
        },
        {
          icon: Utensils,
          gradient: "from-yellow-500 to-orange-500",
          title: t("landing.features.4.title"),
          description: t("landing.features.4.desc"),
        },
        {
          icon: TrendingUp,
          gradient: "from-indigo-500 to-purple-500",
          title: t("landing.features.5.title"),
          description: t("landing.features.5.desc"),
        },
      ] as const,
    [t],
  );

  const testimonials = useMemo(
    () => [
      {
        name: t("landing.testimonials.0.name"),
        role: t("landing.testimonials.0.role"),
        quote: t("landing.testimonials.0.quote"),
        avatar: "SJ",
      },
      {
        name: t("landing.testimonials.1.name"),
        role: t("landing.testimonials.1.role"),
        quote: t("landing.testimonials.1.quote"),
        avatar: "MC",
      },
      {
        name: t("landing.testimonials.2.name"),
        role: t("landing.testimonials.2.role"),
        quote: t("landing.testimonials.2.quote"),
        avatar: "EW",
      },
    ],
    [t],
  );

  const ctaBullets = useMemo(
    () => [
      { icon: Check, text: t("landing.cta.bullet1") },
      { icon: Check, text: t("landing.cta.bullet2") },
      { icon: Check, text: t("landing.cta.bullet3") },
    ],
    [t],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="sticky top-0 z-50 border-b backdrop-blur-lg bg-background/80">
        <div className="relative z-50 container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="size-8 text-primary" />
            <span className="font-bold text-xl">AI Gym Coach</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher variant="compact" />
            <ThemeToggleButton />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileNavOpen ? t("landing.a11y.closeMenu") : t("landing.a11y.openMenu")}
            >
              {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm hover:text-primary transition-colors">
                {t("landing.nav.features")}
              </a>
              <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">
                {t("landing.nav.howItWorks")}
              </a>
              {status === "loading" && !isAuthed ? (
                <span
                  className="min-w-[6rem] inline-flex h-9 items-center justify-center rounded-md px-4 text-sm text-muted-foreground"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <Link href={accountHref}>
                  <Button variant="ghost" className="min-w-[6rem] inline-flex justify-center">
                    {accountLabel}
                  </Button>
                </Link>
              )}
              <Link href="/onboarding">
                <Button>{t("landing.nav.startFree")}</Button>
              </Link>
            </div>
          </div>
        </div>

        {mobileNavOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              aria-label={t("landing.a11y.closeMenu")}
              onClick={closeMobileNav}
            />
            <div
              id="mobile-nav-menu"
              className="absolute left-0 right-0 top-full z-50 flex flex-col gap-3 border-b bg-background/95 p-4 shadow-lg backdrop-blur-lg md:hidden"
            >
              <div className="flex justify-center pb-1">
                <LanguageSwitcher />
              </div>
              <a
                href="#features"
                className="rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                onClick={closeMobileNav}
              >
                {t("landing.nav.features")}
              </a>
              <a
                href="#how-it-works"
                className="rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                onClick={closeMobileNav}
              >
                {t("landing.nav.howItWorks")}
              </a>
              {status === "loading" && !isAuthed ? (
                <span
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <Link
                  href={accountHref}
                  className="rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                  onClick={closeMobileNav}
                >
                  {accountLabel}
                </Link>
              )}
              <Link href="/onboarding" onClick={closeMobileNav} className="pt-1">
                <Button className="w-full">{t("landing.nav.startFree")}</Button>
              </Link>
            </div>
          </>
        ) : null}
      </nav>

      <section className="container mx-auto px-4 pb-24 pt-12 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
                <span className="flex items-center gap-2">
                  <Zap className="size-4 text-primary" />
                  {t("landing.hero.badge")}
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {t("landing.hero.titleBefore")}{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t("landing.hero.titleHighlight")}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">{t("landing.hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  {t("landing.hero.ctaPrimary")}
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8" asChild>
                <a href="#how-it-works">{t("landing.hero.ctaSecondary")}</a>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="font-bold text-2xl">10,000+</div>
                <div className="text-sm text-muted-foreground">{t("landing.hero.statsWorkouts")}</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="font-bold text-2xl">95%</div>
                <div className="text-sm text-muted-foreground">{t("landing.hero.statsUsers")}</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-600/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl overflow-hidden border shadow-2xl bg-card">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1771586791190-97ed536c54af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMGd5bSUyMG1vZGVybnxlbnwxfHx8fDE3NzY0MDgzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt={t("landing.hero.imageAlt")}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t("landing.problems.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("landing.problems.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, i) => (
            <Card key={i} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="size-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <problem.icon className="size-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t("landing.how.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("landing.how.subtitle")}</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="size-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">{t("landing.how.step1Title")}</h3>
            <p className="text-muted-foreground">{t("landing.how.step1Desc")}</p>
          </div>
          <ArrowRight className="size-8 text-primary rotate-90 md:rotate-0" />
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="size-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
              <Brain className="size-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">{t("landing.how.step2Title")}</h3>
            <p className="text-muted-foreground">{t("landing.how.step2Desc")}</p>
          </div>
          <ArrowRight className="size-8 text-primary rotate-90 md:rotate-0" />
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="size-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">✓</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">{t("landing.how.step3Title")}</h3>
            <p className="text-muted-foreground">{t("landing.how.step3Desc")}</p>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t("landing.features.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("landing.features.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
            >
              <CardContent className="p-6 space-y-4">
                <div
                  className={`size-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                >
                  <feature.icon className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t("landing.testimonials.title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">&ldquo;{item.quote}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-24 border-t">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold">{t("landing.cta.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("landing.cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="text-lg px-12">
                {t("landing.nav.startFree")}
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            {ctaBullets.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-muted-foreground">
                <item.icon className="size-5 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="size-6 text-primary" />
              <span className="font-bold">AI Gym Coach</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("landing.footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
