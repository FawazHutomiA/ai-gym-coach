"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/contexts/i18n-context";
import type { AdminExerciseRow } from "@/lib/data/admin-lists";

type ExerciseRow = AdminExerciseRow;

const emptyForm = {
  slug: "",
  labelEn: "",
  labelId: "",
  sortOrder: "100",
};

type AdminExercisesPageProps = { initialExercises: ExerciseRow[] };

export function AdminExercisesPage({ initialExercises }: AdminExercisesPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [rows, setRows] = useState<ExerciseRow[]>(initialExercises);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({
    slug: "",
    labelEn: "",
    labelId: "",
    sortOrder: "",
  });
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialExercises);
  }, [initialExercises]);

  async function createExercise(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const sortOrder = parseInt(form.sortOrder, 10);
      const res = await fetch("/api/admin/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug.trim().toLowerCase(),
          labelEn: form.labelEn.trim(),
          labelId: form.labelId.trim(),
          sortOrder: Number.isFinite(sortOrder) ? sortOrder : 100,
          isActive: true,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? t("admin.exercises.toast.createError"));
        return;
      }
      toast.success(t("admin.exercises.toast.created"));
      setForm(emptyForm);
      router.refresh();
    } catch {
      toast.error(t("admin.exercises.toast.createError"));
    } finally {
      setCreating(false);
    }
  }

  function startEdit(row: ExerciseRow) {
    setEditingId(row.id);
    setEditDraft({
      slug: row.slug,
      labelEn: row.labelEn,
      labelId: row.labelId,
      sortOrder: String(row.sortOrder),
    });
  }

  async function saveEdit(id: string) {
    setSavingId(id);
    try {
      const sortOrder = parseInt(editDraft.sortOrder, 10);
      const res = await fetch(`/api/admin/exercises/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: editDraft.slug.trim().toLowerCase(),
          labelEn: editDraft.labelEn.trim(),
          labelId: editDraft.labelId.trim(),
          sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? t("admin.exercises.toast.saveError"));
        return;
      }
      toast.success(t("admin.exercises.toast.saved"));
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error(t("admin.exercises.toast.saveError"));
    } finally {
      setSavingId(null);
    }
  }

  async function toggleOrDelete(row: ExerciseRow) {
    try {
      const res = await fetch(`/api/admin/exercises/${row.id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string; mode?: string };
      if (!res.ok) {
        toast.error(data.error ?? t("admin.exercises.toast.actionError"));
        return;
      }
      toast.success(
        data.mode === "deleted" ? t("admin.exercises.toast.deleted") : t("admin.exercises.toast.deactivated"),
      );
      router.refresh();
    } catch {
      toast.error(t("admin.exercises.toast.actionError"));
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t("admin.exercises.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-2xl">{t("admin.exercises.intro")}</p>
      </div>

      <Card className="border-2 border-border dark:border-border shadow-sm dark:shadow-black/20">
        <CardHeader>
          <CardTitle>{t("admin.exercises.addTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createExercise} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="ex-slug">{t("admin.exercises.slugLabel")}</Label>
              <Input
                id="ex-slug"
                placeholder={t("admin.exercises.slugPlaceholder")}
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ex-en">{t("admin.exercises.labelEn")}</Label>
              <Input
                id="ex-en"
                value={form.labelEn}
                onChange={(e) => setForm((f) => ({ ...f, labelEn: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ex-id">{t("admin.exercises.labelId")}</Label>
              <Input
                id="ex-id"
                value={form.labelId}
                onChange={(e) => setForm((f) => ({ ...f, labelId: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ex-sort">{t("admin.exercises.sortLabel")}</Label>
              <Input
                id="ex-sort"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <Button type="submit" disabled={creating}>
                {creating ? t("admin.exercises.submitting") : t("admin.exercises.submit")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-2 border-border dark:border-border shadow-sm dark:shadow-black/20">
        <CardHeader>
          <CardTitle>{t("admin.exercises.listTitle", { count: rows.length })}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.exercises.colSlug")}</TableHead>
                <TableHead>{t("admin.exercises.colNameEn")}</TableHead>
                <TableHead>{t("admin.exercises.colNameId")}</TableHead>
                <TableHead className="w-[90px]">{t("admin.exercises.colSort")}</TableHead>
                <TableHead className="w-[100px]">{t("admin.exercises.colStatus")}</TableHead>
                <TableHead className="w-[220px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">
                    {editingId === r.id ? (
                      <Input
                        value={editDraft.slug}
                        onChange={(e) => setEditDraft((d) => ({ ...d, slug: e.target.value }))}
                        className="h-8"
                      />
                    ) : (
                      r.slug
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === r.id ? (
                      <Input
                        value={editDraft.labelEn}
                        onChange={(e) => setEditDraft((d) => ({ ...d, labelEn: e.target.value }))}
                        className="h-8"
                      />
                    ) : (
                      r.labelEn
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === r.id ? (
                      <Input
                        value={editDraft.labelId}
                        onChange={(e) => setEditDraft((d) => ({ ...d, labelId: e.target.value }))}
                        className="h-8"
                      />
                    ) : (
                      r.labelId
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === r.id ? (
                      <Input
                        type="number"
                        value={editDraft.sortOrder}
                        onChange={(e) => setEditDraft((d) => ({ ...d, sortOrder: e.target.value }))}
                        className="h-8 w-20"
                      />
                    ) : (
                      r.sortOrder
                    )}
                  </TableCell>
                  <TableCell>
                    {r.isActive ? (
                      <Badge variant="secondary">{t("admin.exercises.statusActive")}</Badge>
                    ) : (
                      <Badge variant="outline">{t("admin.exercises.statusInactive")}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {editingId === r.id ? (
                      <>
                        <Button
                          size="sm"
                          type="button"
                          variant="secondary"
                          disabled={savingId === r.id}
                          onClick={() => saveEdit(r.id)}
                        >
                          {savingId === r.id ? t("admin.exercises.submitting") : t("admin.exercises.save")}
                        </Button>
                        <Button size="sm" type="button" variant="ghost" onClick={() => setEditingId(null)}>
                          {t("admin.exercises.cancel")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" type="button" variant="outline" onClick={() => startEdit(r)}>
                          {t("admin.exercises.edit")}
                        </Button>
                        <Button
                          size="sm"
                          type="button"
                          variant="destructive"
                          onClick={() => toggleOrDelete(r)}
                        >
                          {r.isActive ? t("admin.exercises.deactivateOrDelete") : t("admin.exercises.deletePermanently")}
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
