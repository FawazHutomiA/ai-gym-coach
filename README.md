# AI Gym Coach — UI Design

**AI Gym Coach** adalah aplikasi web untuk pengalaman pelatihan kebugaran yang diposisikan sebagai “coach gym berbasis AI”. Alurnya meliputi pemasaran, onboarding, dashboard, pencatatan sesi latihan (tersimpan di database), generator rencana latihan (UI), penyesuaian mingguan, dan pelacakan nutrisi. **Model AI sungguhan** dapat dihubungkan di tahap berikutnya; beberapa bagian masih berupa UI atau data contoh.

---

## Apa yang ada di dalam aplikasi?

| Area | Deskripsi |
|------|-----------|
| **Landing** (`/`) | Halaman publik: hero, fitur, cara kerja, tautan ke onboarding atau dashboard. **Tema terang/gelap** dan **Bahasa Indonesia / English** (i18n). |
| **Masuk / daftar** (`/sign-in`, `/sign-up`) | Autentikasi pengguna (Auth.js + kredensial). |
| **Onboarding** (`/onboarding`) | Alur pengenalan / pengaturan awal (UI). |
| **Dashboard** (`/dashboard`) | Beranda: ringkasan, grafik berat (jika ada data), **latihan terbaru** (satu sesi paling baru), **aktivitas terbaru** (hingga 5 log — bisa diklik ke detail). |
| **Profil** (`/dashboard/profile`) | Pengaturan akun / profil fitness. |
| **Generator latihan** (`/dashboard/workouts`) | UI rencana Push/Pull/Legs (belum persist ke DB sebagai “program”). |
| **Log latihan** (`/dashboard/log-workout`) | **Buat** sesi baru (judul & tanggal opsional, gerakan dari katalog, set berat/rep). **Daftar** sesi tersimpan; **lihat detail** (read-only), **edit**, **hapus**. |
| **Detail log** (`/dashboard/log-workout/[id]/detail`) | Tampilan lengkap per sesi: semua gerakan dan set (kg × rep). |
| **Edit log** (`/dashboard/log-workout/[id]`) | Form yang sama seperti log baru; menyimpan lewat `PATCH`. |
| **Penyesuaian mingguan** (`/dashboard/adjustment`) | UI rekomendasi / analisis (konten contoh). |
| **Pelacak nutrisi** (`/dashboard/nutrition`) | UI pelacakan asupan (konten contoh). |
| **Admin** (`/admin/...`) | Panel untuk peran yang berhak: pengguna, **katalog gerakan** (CRUD), dll. |
| **404** | Halaman tidak ditemukan. |

### API latihan (ringkas)

- `GET/POST /api/workouts` — daftar sesi (ringkas + jumlah gerakan) / buat sesi baru.
- `GET/PATCH/DELETE /api/workouts/[id]` — baca detail penuh, perbarui isi sesi, hapus sesi.

Akses fitur dibatasi lewat **permission** di database (`feature.dashboard`, `feature.log_workout`, dll.).

---

## Stack teknis

**Next.js 15** (App Router), **React 19**, **Bun** (disarankan), **Tailwind CSS 4**, **Radix UI**, **Drizzle ORM** + **PostgreSQL** (mis. Neon), **Auth.js**, **next-themes**, **next-intl-style** kamus di `src/i18n/`, serta **Motion**, **Recharts**, **React Hook Form**, dll.

---

## Prasyarat

- **[Bun](https://bun.sh)** (sesuai `packageManager`) — atau Node.js LTS untuk `npm` / `pnpm` / `yarn`.
- **PostgreSQL** dan variabel lingkungan — lihat **`/.env.example`** (mis. `DATABASE_URL`, secret Auth, dll.).

---

## Cara development

### 1. Instal dependensi

```bash
bun install
```

### 2. Lingkungan

Salin `.env.example` ke `.env` dan isi nilai yang wajib (database, auth, dll.).

### 3. Server pengembangan

```bash
bun dev
```

Secara default server pengembangan biasanya memakai **port 3000**; alamat lengkap (host + port) tercetak di terminal saat `bun dev` berjalan.

### 4. Build produksi

```bash
bun run build
bun run start
```

### 5. Pemeriksaan tipe TypeScript

```bash
bun run lint
```

(Menjalankan `tsc --noEmit`.)

### 6. Migrasi DB (Drizzle)

Pastikan `DATABASE_URL` di `.env` mengarah ke PostgreSQL yang valid. Skema didefinisikan di `src/db/schema.ts`; konfigurasi Drizzle ada di `drizzle.config.ts` (output artefak migrasi di folder `drizzle/`).

Perintah yang terdaftar di `package.json`:

| Skrip | Perintah yang dijalankan | Kegunaan |
|--------|---------------------------|----------|
| **`db:push`** | `drizzle-kit push` | Menyinkronkan skema ke database (cocok untuk development; mengubah DB sesuai definisi tabel saat ini). |
| **`db:studio`** | `drizzle-kit studio` | UI untuk menelusuri dan mengedit data di database. |
| **`db:seed`** | `bun run src/db/seed-permissions.ts` | Mengisi permission / role dasar di DB (jalankan setelah skema tersedia). |

Contoh dengan Bun:

```bash
bun run db:push
bun run db:seed
```

Untuk membuka Drizzle Studio:

```bash
bun run db:studio
```

*(Dengan npm: `npm run db:push`, dan seterusnya.)*

### 7. Struktur penting

- `src/app/` — App Router: layout, halaman, route API (`api/`), admin, dashboard.
- `src/sections/` — Konten halaman (landing, dashboard, log latihan, …).
- `src/components/` — Komponen bersama (`ui/`, toggle tema, switch bahasa, …).
- `src/contexts/` — Konteks i18n, tema, dll.
- `src/i18n/` — Kamus `en` / `id` dan string tambahan aplikasi.
- `src/db/` — Skema Drizzle, seed, koneksi DB.
- `src/lib/` — Auth, fitur aplikasi, validasi payload log latihan, dll.
- `drizzle.config.ts` — Konfigurasi migrasi Drizzle.
- `next.config.ts`, `postcss.config.mjs` — Next.js & Tailwind 4.

---

## Kredit

**AI Gym Coach UI Design** — pengembangan dan dokumentasi proyek ini oleh **Fawaz Hutomi Abdurahman**.
