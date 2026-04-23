"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, ArrowRight, Target, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";
import { useI18n } from "@/contexts/i18n-context";
import { LanguageSwitcher } from "@/components/language-switcher";

type Goal = "bulking" | "cutting";

export function OnboardingFlow() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    goal: "" as Goal | "",
    frequency: "",
  });
  const [results, setResults] = useState<{
    calories: number;
    protein: number;
    workoutPlanKey: "onboarding.plan.3day" | "onboarding.plan.upperLower" | "onboarding.plan.ppl";
  } | null>(null);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === totalSteps) {
      const weight = parseFloat(formData.weight);
      const baseCalories = formData.goal === "bulking" ? weight * 40 : weight * 30;
      const planKey =
        formData.frequency === "3"
          ? "onboarding.plan.3day"
          : formData.frequency === "4"
            ? "onboarding.plan.upperLower"
            : "onboarding.plan.ppl";
      setResults({
        calories: Math.round(baseCalories),
        protein: Math.round(weight * 2.2),
        workoutPlanKey: planKey,
      });
    } else {
      setStep(step + 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.height && formData.weight;
      case 2:
        return formData.goal;
      case 3:
        return formData.frequency;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (results) {
    const planLabel = t(results.workoutPlanKey);
    return (
      <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2">
            <CardHeader className="text-center pb-8">
              <div className="size-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                <Target className="size-10 text-white" />
              </div>
              <CardTitle className="text-3xl">{t("onboarding.results.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">{results.calories}</div>
                    <div className="text-sm text-muted-foreground mt-1">{t("onboarding.results.dailyCal")}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-500">{results.protein}g</div>
                    <div className="text-sm text-muted-foreground mt-1">{t("onboarding.results.proteinTarget")}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-xl font-bold text-purple-500">{planLabel}</div>
                    <div className="text-sm text-muted-foreground mt-1">{t("onboarding.results.program")}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">{t("onboarding.results.previewTitle")}</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span>{t("onboarding.results.bullet1", { plan: planLabel })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span>{t("onboarding.results.bullet2", { freq: formData.frequency })}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span>{t("onboarding.results.bullet3")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span>{t("onboarding.results.bullet4")}</span>
                  </li>
                </ul>
              </div>

              <Button size="lg" className="w-full text-lg" type="button" onClick={() => router.push("/dashboard")}>
                {t("onboarding.results.cta")}
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full min-w-0 max-w-2xl space-y-8">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Dumbbell className="size-8 text-primary shrink-0" />
            <span className="font-bold text-xl truncate">AI Gym Coach</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {t("onboarding.step.label", { current: step, total: totalSteps })}
            </div>
            <LanguageSwitcher variant="compact" className="shrink-0" />
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {step === 1 && t("onboarding.step1.title")}
                {step === 2 && t("onboarding.step2.title")}
                {step === 3 && t("onboarding.step3.title")}
                {step === 4 && t("onboarding.step4.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="height">{t("profile.heightCm")}</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">{t("profile.weightKg")}</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="75"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-4">
                  <Card
                    className={`cursor-pointer border-2 transition-all ${
                      formData.goal === "bulking"
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, goal: "bulking" })}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="size-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <TrendingUp className="size-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl mb-2">{t("onboarding.bulking.title")}</h3>
                        <p className="text-sm text-muted-foreground">{t("onboarding.bulking.desc")}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer border-2 transition-all ${
                      formData.goal === "cutting"
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, goal: "cutting" })}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="size-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <TrendingDown className="size-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl mb-2">{t("onboarding.cutting.title")}</h3>
                        <p className="text-sm text-muted-foreground">{t("onboarding.cutting.desc")}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-3 gap-4">
                  {["3", "4", "5"].map((freq) => (
                    <Card
                      key={freq}
                      className={`cursor-pointer border-2 transition-all ${
                        formData.frequency === freq
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setFormData({ ...formData, frequency: freq })}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-primary mb-2">{freq}x</div>
                        <div className="text-sm text-muted-foreground">{t("onboarding.freq.perWeek")}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg flex justify-between">
                    <span className="text-muted-foreground">{t("onboarding.review.height")}</span>
                    <span className="font-semibold">{formData.height} cm</span>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg flex justify-between">
                    <span className="text-muted-foreground">{t("onboarding.review.weight")}</span>
                    <span className="font-semibold">{formData.weight} kg</span>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg flex justify-between">
                    <span className="text-muted-foreground">{t("onboarding.review.goal")}</span>
                    <span className="font-semibold capitalize">
                      {formData.goal ? t(`onboarding.${formData.goal}.title`) : ""}
                    </span>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg flex justify-between">
                    <span className="text-muted-foreground">{t("onboarding.review.frequency")}</span>
                    <span className="font-semibold">
                      {t("onboarding.review.freqValue", { n: formData.frequency })}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button variant="outline" type="button" onClick={() => setStep(step - 1)} className="flex-1">
                    {t("onboarding.back")}
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1"
                  size="lg"
                >
                  {step === totalSteps ? t("onboarding.generate") : t("onboarding.next")}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
