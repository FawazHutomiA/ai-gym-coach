import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardForbiddenPage() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Akses ditolak</h1>
      <p className="text-muted-foreground max-w-md">
        Akun Anda tidak memiliki izin untuk fitur ini. Hubungi administrator jika menurut Anda ini kesalahan.
      </p>
      <Button asChild>
        <Link href="/dashboard">Kembali ke dashboard</Link>
      </Button>
    </div>
  );
}
