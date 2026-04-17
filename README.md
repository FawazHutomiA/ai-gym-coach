# AI Gym Coach — UI Design

**AI Gym Coach** adalah antarmuka web (front-end) untuk pengalaman pelatihan kebugaran yang diposisikan sebagai “coach gym berbasis AI”. Aplikasi ini menyajikan alur mulai dari halaman pemasaran, onboarding pengguna baru, hingga dashboard operasional: pembuatan rencana latihan, pencatatan sesi, penyesuaian mingguan, dan pelacakan nutrisi. Saat ini fokusnya adalah **desain UI/UX dan interaksi di browser**; integrasi backend atau model AI sungguhan dapat ditambahkan di tahap berikutnya.

---

## Apa yang ada di dalam aplikasi?

| Area | Deskripsi |
|------|-----------|
| **Landing** (`/`) | Halaman publik dengan hero, fitur, cara kerja, dan tautan ke onboarding atau dashboard. Mendukung **tema terang/gelap**. |
| **Onboarding** (`/onboarding`) | Alur pengenalan / pengaturan awal pengguna (UI flow). |
| **Dashboard** (`/dashboard`) | Layout utama setelah masuk ke area aplikasi. |
| **Beranda dashboard** (`/dashboard`) | Ringkasan dan akses cepat ke modul lain. |
| **Generator latihan** (`/dashboard/workouts`) | UI untuk menyusun atau membuat rencana latihan. |
| **Log latihan** (`/dashboard/log-workout`) | UI untuk mencatat sesi latihan yang sudah dilakukan. |
| **Penyesuaian mingguan** (`/dashboard/adjustment`) | UI untuk menyesuaikan program berdasarkan progres mingguan. |
| **Pelacak nutrisi** (`/dashboard/nutrition`) | UI untuk memantau asupan atau target nutrisi. |
| **404** | Halaman tidak ditemukan untuk rute yang tidak dikenal. |

Stack teknis utama: **Next.js 15** (App Router), **React 19**, **Bun** sebagai runtime dan manajer paket, **Tailwind CSS 4**, komponen **Radix UI** dan pola UI tambahan (**MUI Icons**, **Emotion**, dll.), serta utilitas seperti **Motion**, **Recharts**, dan **React Hook Form** untuk animasi, grafik, dan formulir.

---

## Prasyarat

- **[Bun](https://bun.sh)** (disarankan, sesuai `packageManager` di proyek) — atau Node.js LTS jika Anda memilih menjalankan skrip dengan `npm` / `pnpm` / `yarn`

---

## Cara development

### 1. Instal dependensi

```bash
bun install
```

### 2. Menjalankan server pengembangan

```bash
bun dev
```

Secara default Next.js berjalan di `http://localhost:3000` (cek terminal jika port berbeda).

### 3. Build produksi dan menjalankan server

```bash
bun run build
bun run start
```

### 4. Pemeriksaan tipe TypeScript

```bash
bun run lint
```

(Menjalankan `tsc --noEmit`.)

### 5. Struktur penting untuk pengembangan

- `src/app/` — **App Router**: `layout.tsx`, `page.tsx`, `providers.tsx`, `globals.css`, serta folder rute (`onboarding/`, `dashboard/`, …)
- `src/sections/` — konten halaman (landing, onboarding, dashboard, dll.) yang di-import oleh `page.tsx`
- `src/components/` — komponen UI bersama (`ui/`, `figma/`)
- `src/styles/` — stylesheet global (di-import lewat `globals.css`)
- `next.config.ts` — konfigurasi Next.js (misalnya pola gambar remote)
- `postcss.config.mjs` — Tailwind CSS 4 lewat `@tailwindcss/postcss`

---

## Kredit

**AI Gym Coach UI Design** — pengembangan dan dokumentasi proyek ini oleh **Fawaz Hutomi Abdurahman**.
