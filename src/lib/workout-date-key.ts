import { format, parseISO } from "date-fns";

/**
 * Kunci tanggal kalender (yyyy-MM-dd) dari `loggedAt` ISO — sama dengan yang dipakai di grafik/riwayat.
 * Catatan: mengikuti zona waktu environment (Node vs browser) seperti `date-fns` + `format`.
 */
export function sessionCalendarDateKey(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd");
}
