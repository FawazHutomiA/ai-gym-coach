"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { SUPER_ADMIN_ACCOUNT_EMAIL } from "@/lib/auth/super-admin-account";
import { useI18n } from "@/contexts/i18n-context";
import type { AdminUserRow } from "@/lib/data/admin-lists";

function editsFromUsers(users: AdminUserRow[]) {
  const next: Record<string, { name: string; role: string }> = {};
  for (const u of users) {
    next[u.id] = { name: u.name, role: u.role };
  }
  return next;
}

type AdminUsersPageProps = { initialUsers: AdminUserRow[] };

export function AdminUsersPage({ initialUsers }: AdminUsersPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [edits, setEdits] = useState(() => editsFromUsers(initialUsers));
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    setUsers(initialUsers);
    setEdits(editsFromUsers(initialUsers));
  }, [initialUsers]);

  async function saveUser(id: string) {
    const e = edits[id];
    if (!e) return;
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: e.name, role: e.role }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? t("admin.users.toast.saveError"));
        return;
      }
      toast.success(t("admin.users.toast.updated"));
      router.refresh();
    } catch {
      toast.error(t("admin.users.toast.saveError"));
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("admin.users.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("admin.users.intro", { email: SUPER_ADMIN_ACCOUNT_EMAIL })}
        </p>
      </div>

      <Card className="border-2 border-border dark:border-border shadow-sm dark:shadow-black/20">
        <CardHeader>
          <CardTitle>{t("admin.users.listTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.users.colEmail")}</TableHead>
                <TableHead>{t("admin.users.colName")}</TableHead>
                <TableHead>{t("admin.users.colRole")}</TableHead>
                <TableHead className="w-[140px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isSuperAccount = u.email.toLowerCase() === SUPER_ADMIN_ACCOUNT_EMAIL.toLowerCase();
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-sm">{u.email}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Label className="sr-only" htmlFor={`name-${u.id}`}>
                          {t("admin.users.nameLabel")}
                        </Label>
                        <Input
                          id={`name-${u.id}`}
                          value={edits[u.id]?.name ?? ""}
                          onChange={(ev) =>
                            setEdits((prev) => ({
                              ...prev,
                              [u.id]: { ...prev[u.id], name: ev.target.value, role: prev[u.id]?.role ?? u.role },
                            }))
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {isSuperAccount ? (
                        <span className="inline-flex items-center h-10 px-3 text-sm font-medium">
                          {t("admin.users.roleSuperAdmin")}
                        </span>
                      ) : (
                        <Select
                          value={edits[u.id]?.role ?? u.role}
                          onValueChange={(role) =>
                            setEdits((prev) => ({
                              ...prev,
                              [u.id]: { name: prev[u.id]?.name ?? u.name, role },
                            }))
                          }
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">user</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        type="button"
                        disabled={savingId === u.id}
                        onClick={() => saveUser(u.id)}
                      >
                        {savingId === u.id ? t("admin.users.saving") : t("admin.users.save")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
