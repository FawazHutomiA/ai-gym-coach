"use client";

import { useState } from "react";
import Link from "next/link";
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
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-lg bg-background/80">
        <div className="relative z-50 container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="size-8 text-primary" />
            <span className="font-bold text-xl">AI Gym Coach</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            >
              {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">
                How it works
              </a>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/onboarding">
                <Button>Start Free</Button>
              </Link>
            </div>
          </div>
        </div>

        {mobileNavOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              aria-label="Close menu"
              onClick={closeMobileNav}
            />
            <div
              id="mobile-nav-menu"
              className="absolute left-0 right-0 top-full z-50 flex flex-col gap-1 border-b bg-background/95 p-4 shadow-lg backdrop-blur-lg md:hidden"
            >
              <a
                href="#features"
                className="rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                onClick={closeMobileNav}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                onClick={closeMobileNav}
              >
                How it works
              </a>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                onClick={closeMobileNav}
              >
                Dashboard
              </Link>
              <Link href="/onboarding" onClick={closeMobileNav} className="pt-1">
                <Button className="w-full">Start Free</Button>
              </Link>
            </div>
          </>
        ) : null}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pb-24 pt-12 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
                <span className="flex items-center gap-2">
                  <Zap className="size-4 text-primary" />
                  AI-Powered Fitness Coach
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              AI Gym Coach that{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                adapts to your progress
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Stop guessing your workouts and calories. Let AI handle everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Start Free
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                See how it works
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="font-bold text-2xl">10,000+</div>
                <div className="text-sm text-muted-foreground">Workouts Generated</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="font-bold text-2xl">95%</div>
                <div className="text-sm text-muted-foreground">Users See Progress</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-600/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl overflow-hidden border shadow-2xl bg-card">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1771586791190-97ed536c54af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMGd5bSUyMG1vZGVybnxlbnwxfHx8fDE3NzY0MDgzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fitness dashboard preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Tired of these problems?
          </h2>
          <p className="text-xl text-muted-foreground">
            You're not alone. Most people struggle with fitness planning.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: "Stuck in the gym with no progress",
              description: "You work out consistently but see no results because your plan doesn't evolve.",
            },
            {
              icon: Utensils,
              title: "Don't know how many calories to eat",
              description: "Guessing your nutrition needs leads to slow progress or even weight gain.",
            },
            {
              icon: Calendar,
              title: "Workout plans don't adapt",
              description: "Generic programs don't adjust to your unique progress and recovery.",
            },
          ].map((problem, i) => (
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

      {/* Solution Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            How AI Gym Coach Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Simple, smart, and personalized to you
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="size-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">Input Your Data</h3>
            <p className="text-muted-foreground">Height, weight, goals, and gym frequency</p>
          </div>
          <ArrowRight className="size-8 text-primary rotate-90 md:rotate-0" />
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="size-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
              <Brain className="size-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">AI Analyzes</h3>
            <p className="text-muted-foreground">Creates optimal workout and nutrition plan</p>
          </div>
          <ArrowRight className="size-8 text-primary rotate-90 md:rotate-0" />
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="size-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">✓</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">Get Personalized Plan</h3>
            <p className="text-muted-foreground">Auto-adjusts weekly based on your progress</p>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything you need to transform
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed for real results
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Smart Onboarding",
              description: "Quick setup that captures your goals and generates your personalized plan instantly.",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: Dumbbell,
              title: "AI Workout Generator",
              description: "Get customized workout splits (Push/Pull/Legs) with exercises, sets, and reps.",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: BarChart3,
              title: "Workout Logger",
              description: "Fast, friction-free logging to track weight and reps for every exercise.",
              gradient: "from-orange-500 to-red-500",
            },
            {
              icon: Brain,
              title: "Weekly AI Adjustment",
              description: "AI analyzes your progress and adjusts volume, intensity, and calories automatically.",
              gradient: "from-green-500 to-emerald-500",
            },
            {
              icon: Utensils,
              title: "Nutrition Tracker",
              description: "Just type what you ate. AI calculates calories, protein, and macros instantly.",
              gradient: "from-yellow-500 to-orange-500",
            },
            {
              icon: TrendingUp,
              title: "Progress Dashboard",
              description: "Beautiful charts showing weight trends, volume progression, and achievements.",
              gradient: "from-indigo-500 to-purple-500",
            },
          ].map((feature, i) => (
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

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Loved by fitness enthusiasts
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Lost 15kg in 4 months",
              quote: "AI Gym Coach removed all the guesswork. The workouts adapt perfectly to my progress!",
              avatar: "SJ",
            },
            {
              name: "Mike Chen",
              role: "Gained 8kg muscle",
              quote: "Finally a program that adjusts when I need it. The AI knows when to push harder or back off.",
              avatar: "MC",
            },
            {
              name: "Emma Williams",
              role: "Transformed body composition",
              quote: "The nutrition tracker is a game-changer. No more spreadsheets or complicated apps.",
              avatar: "EW",
            },
          ].map((testimonial, i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 border-t">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold">
            Start your transformation today
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of people getting real results with AI-powered fitness coaching
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="text-lg px-12">
                Start Free
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            {[
              { icon: Check, text: "No credit card required" },
              { icon: Check, text: "Setup in 2 minutes" },
              { icon: Check, text: "Cancel anytime" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-muted-foreground">
                <item.icon className="size-5 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="size-6 text-primary" />
              <span className="font-bold">AI Gym Coach</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 AI Gym Coach. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
