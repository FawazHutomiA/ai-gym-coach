"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useI18n } from "@/contexts/i18n-context";

export function WeeklyAdjustment() {
  const { t } = useI18n();

  const volumeData = useMemo(
    () => [
      { week: t("adjustment.week.1"), sets: 32 },
      { week: t("adjustment.week.2"), sets: 35 },
      { week: t("adjustment.week.3"), sets: 38 },
      { week: t("adjustment.week.4"), sets: 40 },
    ],
    [t],
  );

  const strengthData = useMemo(
    () => [
      { week: t("adjustment.week.1"), bench: 75, squat: 95, deadlift: 115 },
      { week: t("adjustment.week.2"), bench: 77.5, squat: 97.5, deadlift: 120 },
      { week: t("adjustment.week.3"), bench: 80, squat: 100, deadlift: 122.5 },
      { week: t("adjustment.week.4"), bench: 80, squat: 100, deadlift: 125 },
    ],
    [t],
  );

  const benchName = t("adjustment.chart.bench");
  const squatName = t("adjustment.chart.squat");
  const deadliftName = t("adjustment.chart.deadlift");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t("adjustment.title")}</h1>
        <p className="text-muted-foreground">{t("adjustment.subtitle")}</p>
      </div>

      <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-purple-600/10 to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Brain className="size-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">{t("adjustment.aiSummaryTitle")}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{t("adjustment.aiSummaryDesc")}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-background/50 backdrop-blur rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="size-5 text-green-500" />
                <span className="font-semibold">{t("adjustment.metric.weightProgress")}</span>
              </div>
              <div className="text-2xl font-bold text-green-500">-0.6 kg</div>
              <div className="text-sm text-muted-foreground">{t("adjustment.metric.thisWeek")}</div>
            </div>
            <div className="p-4 bg-background/50 backdrop-blur rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="size-5 text-blue-500" />
                <span className="font-semibold">{t("adjustment.metric.trainingVolume")}</span>
              </div>
              <div className="text-2xl font-bold text-blue-500">+5%</div>
              <div className="text-sm text-muted-foreground">{t("adjustment.metric.vsLastWeek")}</div>
            </div>
            <div className="p-4 bg-background/50 backdrop-blur rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-5 text-orange-500" />
                <span className="font-semibold">{t("adjustment.metric.recoveryScore")}</span>
              </div>
              <div className="text-2xl font-bold text-orange-500">85%</div>
              <div className="text-sm text-muted-foreground">{t("adjustment.metric.goodRecovery")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            {t("adjustment.recsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="size-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="size-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{t("adjustment.rec1.title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("adjustment.rec1.desc")}</p>
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    {t("adjustment.rec1.badge")}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="size-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{t("adjustment.rec2.title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("adjustment.rec2.desc")}</p>
                  <Badge variant="outline" className="border-blue-500 text-blue-500">
                    {t("adjustment.rec2.badge")}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="size-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="size-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{t("adjustment.rec3.title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("adjustment.rec3.desc")}</p>
                  <Badge variant="outline" className="border-orange-500 text-orange-500">
                    {t("adjustment.rec3.badge")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" className="w-full" type="button">
            {t("adjustment.apply")}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t("adjustment.chart.volumeTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sets" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{t("adjustment.chart.volumeCaption")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t("adjustment.chart.strengthTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={strengthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bench"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={benchName}
                />
                <Line
                  type="monotone"
                  dataKey="squat"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={squatName}
                />
                <Line
                  type="monotone"
                  dataKey="deadlift"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={deadliftName}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="p-2 bg-blue-500/10 rounded text-center">
                <div className="text-xs text-muted-foreground">{t("adjustment.chart.benchShort")}</div>
                <div className="font-semibold text-blue-500">+5kg</div>
              </div>
              <div className="p-2 bg-green-500/10 rounded text-center">
                <div className="text-xs text-muted-foreground">{t("adjustment.chart.squatShort")}</div>
                <div className="font-semibold text-green-500">+5kg</div>
              </div>
              <div className="p-2 bg-orange-500/10 rounded text-center">
                <div className="text-xs text-muted-foreground">{t("adjustment.chart.deadliftShort")}</div>
                <div className="font-semibold text-orange-500">+10kg</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>{t("adjustment.metricsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold mb-3">{t("adjustment.perfTitle")}</h3>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("adjustment.workoutCompletion")}</span>
                  <span className="font-semibold">{t("adjustment.sessions5")}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("adjustment.volumeTarget")}</span>
                  <span className="font-semibold">{t("adjustment.sets4038")}</span>
                </div>
                <Progress value={105} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("adjustment.intensityRpe")}</span>
                  <span className="font-semibold">7.8/10</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold mb-3">{t("adjustment.nutritionTitle")}</h3>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("adjustment.calorieConsistency")}</span>
                  <span className="font-semibold">{t("adjustment.days67")}</span>
                </div>
                <Progress value={86} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("adjustment.proteinTarget")}</span>
                  <span className="font-semibold">{t("adjustment.proteinAvg")}</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("adjustment.loggedMeals")}</span>
                  <span className="font-semibold">{t("adjustment.meals1921")}</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
