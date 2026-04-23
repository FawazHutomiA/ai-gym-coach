"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Ruler, Weight, Bell, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/i18n-context";

export type UserProfileData = {
  displayName: string;
  email: string;
  phone: string;
  goal: "cutting" | "bulking" | "maintenance";
  bio: string;
  weightKg: string;
  heightCm: string;
  emailNotifications: boolean;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type UserProfileProps = { initialData: UserProfileData };

export function UserProfile({ initialData }: UserProfileProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileData>(initialData);
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof UserProfileData>(key: K, value: UserProfileData[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const goalLabel = (g: UserProfileData["goal"]) => t(`profile.goal.${g}`);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profile.displayName,
          phone: profile.phone,
          goal: profile.goal,
          bio: profile.bio,
          heightCm: profile.heightCm,
          weightKg: profile.weightKg,
          emailNotifications: profile.emailNotifications,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? t("profile.toast.error"));
        return;
      }
      toast.success(t("profile.toast.saved"), {
        description: t("profile.toast.savedDesc"),
      });
      router.refresh();
    } catch {
      toast.error(t("profile.toast.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t("profile.title")}</h1>
        <p className="text-muted-foreground">{t("profile.subtitle")}</p>
      </div>

      <Card className="border-2 overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar className="size-24 border-2 border-primary/20 text-2xl">
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                {initials(profile.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold">{profile.displayName || "—"}</h2>
                <Badge variant="secondary">{goalLabel(profile.goal)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t("profile.memberNote")}</p>
            </div>
            <Button onClick={handleSave} disabled={saving} className="shrink-0 gap-2 sm:self-start">
              <Save className="size-4" />
              {t("profile.saveChanges")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="size-5 text-primary" />
              {t("profile.personalInfo")}
            </CardTitle>
            <CardDescription>{t("profile.personalInfoDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t("profile.displayName")}</Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                placeholder={t("profile.displayNamePh")}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="size-3.5" />
                {t("profile.email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                disabled
                className="bg-muted/50"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="size-3.5" />
                {t("profile.phone")}{" "}
                <span className="text-muted-foreground font-normal">{t("profile.phoneOptional")}</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder={t("profile.phonePh")}
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("profile.fitnessGoal")}</Label>
              <Select value={profile.goal} onValueChange={(v) => update("goal", v as UserProfileData["goal"])}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("profile.selectGoal")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cutting">{t("profile.goal.cutting")}</SelectItem>
                  <SelectItem value="bulking">{t("profile.goal.bulking")}</SelectItem>
                  <SelectItem value="maintenance">{t("profile.goal.maintenance")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">{t("profile.bio")}</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder={t("profile.bioPh")}
                rows={4}
                className="resize-y min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-primary" />
                {t("profile.bodyMetrics")}
              </CardTitle>
              <CardDescription>{t("profile.bodyMetricsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="height" className="flex items-center gap-2">
                    <Ruler className="size-3.5" />
                    {t("profile.heightCm")}
                  </Label>
                  <Input
                    id="height"
                    inputMode="decimal"
                    value={profile.heightCm}
                    onChange={(e) => update("heightCm", e.target.value)}
                    placeholder="175"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center gap-2">
                    <Weight className="size-3.5" />
                    {t("profile.weightKg")}
                  </Label>
                  <Input
                    id="weight"
                    inputMode="decimal"
                    value={profile.weightKg}
                    onChange={(e) => update("weightKg", e.target.value)}
                    placeholder="72"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="size-5 text-primary" />
                {t("profile.notifications")}
              </CardTitle>
              <CardDescription>{t("profile.notificationsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{t("profile.emailUpdates")}</p>
                  <p className="text-xs text-muted-foreground">{t("profile.emailUpdatesDesc")}</p>
                </div>
                <Switch
                  checked={profile.emailNotifications}
                  onCheckedChange={(v) => update("emailNotifications", v)}
                  aria-label={t("profile.emailNotifAria")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{t("profile.footerNote")}</p>
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          <Save className="size-4" />
          {t("profile.saveProfile")}
        </Button>
      </div>
    </div>
  );
}
