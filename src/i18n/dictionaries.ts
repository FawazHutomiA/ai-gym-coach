import { extraMessagesEn, extraMessagesId } from "./extra-messages";

export type Locale = "en" | "id";

/** Flat message keys shared across the app */
export const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    "common.save": "Save",
    "common.language": "Language",
    "lang.en": "English",
    "lang.id": "Indonesia",

    "notFound.title": "Page not found",
    "notFound.home": "Back to Home",

    "nav.dashboard": "Dashboard",
    "nav.profile": "Profile",
    "nav.workouts": "Workouts",
    "nav.logWorkout": "Log Workout",
    "nav.adjustment": "AI Adjustment",
    "nav.nutrition": "Nutrition",
    "nav.backLanding": "← Back to Landing",

    "dashboard.welcome": "Welcome back!",
    "dashboard.subtitle": "Here's your fitness progress and today's plan",
    "dashboard.profileBtn": "Profile",
    "dashboard.stat.calories": "Daily Calorie Target",
    "dashboard.stat.protein": "Protein Goal",
    "dashboard.stat.weightChange": "Weight Change",
    "dashboard.stat.workoutsMonth": "Workouts This Month",
    "dashboard.todayWorkout": "Today's Workout - Push Day",
    "dashboard.logWorkout": "Log Workout",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.trackNutrition": "Track Nutrition",
    "dashboard.viewAiInsights": "View AI Insights",
    "dashboard.thisWeek": "This Week",
    "dashboard.workoutsCompleted": "Workouts Completed",
    "dashboard.nutritionLogged": "Nutrition Logged",
    "dashboard.weightProgress": "Weight Progress",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.activity.0.text": "Completed Pull Day workout",
    "dashboard.activity.0.time": "2 hours ago",
    "dashboard.activity.1.text": "Logged lunch - 650 calories, 45g protein",
    "dashboard.activity.1.time": "4 hours ago",
    "dashboard.activity.2.text": "AI suggested increasing volume by 10%",
    "dashboard.activity.2.time": "1 day ago",
    "dashboard.activity.3.text": "Completed Leg Day workout",
    "dashboard.activity.3.time": "2 days ago",

    "profile.title": "Profile",
    "profile.subtitle": "Manage your account and preferences for AI Gym Coach.",
    "profile.saveChanges": "Save changes",
    "profile.saveProfile": "Save profile",
    "profile.memberNote": "Member · progress synced locally in this browser",
    "profile.personalInfo": "Personal info",
    "profile.personalInfoDesc": "How we address you and reach you.",
    "profile.displayName": "Display name",
    "profile.displayNamePh": "Your name",
    "profile.email": "Email",
    "profile.emailPh": "you@example.com",
    "profile.phone": "Phone",
    "profile.phonePh": "+1 …",
    "profile.phoneOptional": "(optional)",
    "profile.fitnessGoal": "Fitness goal",
    "profile.selectGoal": "Select goal",
    "profile.goal.cutting": "Cutting — lose fat",
    "profile.goal.bulking": "Bulking — build muscle",
    "profile.goal.maintenance": "Maintenance — stay lean",
    "profile.bio": "Bio",
    "profile.bioPh": "Short intro, injuries to note, favorite lifts…",
    "profile.bodyMetrics": "Body metrics",
    "profile.bodyMetricsDesc": "Used to personalize calorie and volume suggestions.",
    "profile.heightCm": "Height (cm)",
    "profile.weightKg": "Weight (kg)",
    "profile.notifications": "Notifications",
    "profile.notificationsDesc": "Control reminders in this demo (stored locally).",
    "profile.emailUpdates": "Email updates",
    "profile.emailUpdatesDesc":
      "Tips, streaks, and weekly summaries (when email is connected).",
    "profile.emailNotifAria": "Email notifications",
    "profile.footerNote":
      "Data is saved only in your browser (localStorage). Connect a backend later for sync across devices.",
    "profile.toast.saved": "Profile saved",
    "profile.toast.savedDesc": "Your settings are stored in this browser.",
    "profile.toast.error": "Could not save profile",

    "landing.nav.features": "Features",
    "landing.nav.howItWorks": "How it works",
    "landing.nav.startFree": "Start Free",
    "landing.a11y.closeMenu": "Close menu",
    "landing.a11y.openMenu": "Open menu",
    "landing.hero.badge": "AI-Powered Fitness Coach",
    "landing.hero.titleBefore": "AI Gym Coach that",
    "landing.hero.titleHighlight": "adapts to your progress",
    "landing.hero.subtitle": "Stop guessing your workouts and calories. Let AI handle everything.",
    "landing.hero.ctaPrimary": "Start Free",
    "landing.hero.ctaSecondary": "See how it works",
    "landing.hero.statsWorkouts": "Workouts Generated",
    "landing.hero.statsUsers": "Users See Progress",
    "landing.hero.imageAlt": "Fitness dashboard preview",

    "landing.problems.title": "Tired of these problems?",
    "landing.problems.subtitle": "You're not alone. Most people struggle with fitness planning.",
    "landing.problems.0.title": "Stuck in the gym with no progress",
    "landing.problems.0.desc":
      "You work out consistently but see no results because your plan doesn't evolve.",
    "landing.problems.1.title": "Don't know how many calories to eat",
    "landing.problems.1.desc":
      "Guessing your nutrition needs leads to slow progress or even weight gain.",
    "landing.problems.2.title": "Workout plans don't adapt",
    "landing.problems.2.desc":
      "Generic programs don't adjust to your unique progress and recovery.",

    "landing.how.title": "How AI Gym Coach Works",
    "landing.how.subtitle": "Simple, smart, and personalized to you",
    "landing.how.step1Title": "Input Your Data",
    "landing.how.step1Desc": "Height, weight, goals, and gym frequency",
    "landing.how.step2Title": "AI Analyzes",
    "landing.how.step2Desc": "Creates optimal workout and nutrition plan",
    "landing.how.step3Title": "Get Personalized Plan",
    "landing.how.step3Desc": "Auto-adjusts weekly based on your progress",

    "landing.features.title": "Everything you need to transform",
    "landing.features.subtitle": "Powerful features designed for real results",
    "landing.features.0.title": "Smart Onboarding",
    "landing.features.0.desc":
      "Quick setup that captures your goals and generates your personalized plan instantly.",
    "landing.features.1.title": "AI Workout Generator",
    "landing.features.1.desc":
      "Get customized workout splits (Push/Pull/Legs) with exercises, sets, and reps.",
    "landing.features.2.title": "Workout Logger",
    "landing.features.2.desc":
      "Fast, friction-free logging to track weight and reps for every exercise.",
    "landing.features.3.title": "Weekly AI Adjustment",
    "landing.features.3.desc":
      "AI analyzes your progress and adjusts volume, intensity, and calories automatically.",
    "landing.features.4.title": "Nutrition Tracker",
    "landing.features.4.desc":
      "Just type what you ate. AI calculates calories, protein, and macros instantly.",
    "landing.features.5.title": "Progress Dashboard",
    "landing.features.5.desc":
      "Beautiful charts showing weight trends, volume progression, and achievements.",

    "landing.testimonials.title": "Loved by fitness enthusiasts",
    "landing.testimonials.0.name": "Sarah Johnson",
    "landing.testimonials.0.role": "Lost 15kg in 4 months",
    "landing.testimonials.0.quote":
      "AI Gym Coach removed all the guesswork. The workouts adapt perfectly to my progress!",
    "landing.testimonials.1.name": "Mike Chen",
    "landing.testimonials.1.role": "Gained 8kg muscle",
    "landing.testimonials.1.quote":
      "Finally a program that adjusts when I need it. The AI knows when to push harder or back off.",
    "landing.testimonials.2.name": "Emma Williams",
    "landing.testimonials.2.role": "Transformed body composition",
    "landing.testimonials.2.quote":
      "The nutrition tracker is a game-changer. No more spreadsheets or complicated apps.",

    "landing.cta.title": "Start your transformation today",
    "landing.cta.subtitle":
      "Join thousands of people getting real results with AI-powered fitness coaching",
    "landing.cta.bullet1": "No credit card required",
    "landing.cta.bullet2": "Setup in 2 minutes",
    "landing.cta.bullet3": "Cancel anytime",

    "landing.footer.copyright": "© 2026 AI Gym Coach. All rights reserved.",
    ...extraMessagesEn,
  },
  id: {
    "common.save": "Simpan",
    "common.language": "Bahasa",
    "lang.en": "English",
    "lang.id": "Indonesia",

    "notFound.title": "Halaman tidak ditemukan",
    "notFound.home": "Kembali ke beranda",

    "nav.dashboard": "Dasbor",
    "nav.profile": "Profil",
    "nav.workouts": "Latihan",
    "nav.logWorkout": "Catat latihan",
    "nav.adjustment": "Penyesuaian AI",
    "nav.nutrition": "Nutrisi",
    "nav.backLanding": "← Kembali ke beranda",

    "dashboard.welcome": "Selamat datang kembali!",
    "dashboard.subtitle": "Ini progres kebugaran dan rencana hari ini",
    "dashboard.profileBtn": "Profil",
    "dashboard.stat.calories": "Target kalori harian",
    "dashboard.stat.protein": "Target protein",
    "dashboard.stat.weightChange": "Perubahan berat",
    "dashboard.stat.workoutsMonth": "Latihan bulan ini",
    "dashboard.todayWorkout": "Latihan hari ini - Hari push",
    "dashboard.logWorkout": "Catat latihan",
    "dashboard.quickActions": "Aksi cepat",
    "dashboard.trackNutrition": "Catat nutrisi",
    "dashboard.viewAiInsights": "Lihat wawasan AI",
    "dashboard.thisWeek": "Minggu ini",
    "dashboard.workoutsCompleted": "Latihan selesai",
    "dashboard.nutritionLogged": "Nutrisi tercatat",
    "dashboard.weightProgress": "Progres berat badan",
    "dashboard.recentActivity": "Aktivitas terbaru",
    "dashboard.activity.0.text": "Menyelesaikan latihan Pull Day",
    "dashboard.activity.0.time": "2 jam lalu",
    "dashboard.activity.1.text": "Mencatat makan siang - 650 kal, 45g protein",
    "dashboard.activity.1.time": "4 jam lalu",
    "dashboard.activity.2.text": "AI menyarankan menaikkan volume 10%",
    "dashboard.activity.2.time": "1 hari lalu",
    "dashboard.activity.3.text": "Menyelesaikan latihan Leg Day",
    "dashboard.activity.3.time": "2 hari lalu",

    "profile.title": "Profil",
    "profile.subtitle": "Kelola akun dan preferensi Anda di AI Gym Coach.",
    "profile.saveChanges": "Simpan perubahan",
    "profile.saveProfile": "Simpan profil",
    "profile.memberNote": "Anggota · progres disinkronkan lokal di browser ini",
    "profile.personalInfo": "Info pribadi",
    "profile.personalInfoDesc": "Cara kami menyapa dan menghubungi Anda.",
    "profile.displayName": "Nama tampilan",
    "profile.displayNamePh": "Nama Anda",
    "profile.email": "Email",
    "profile.emailPh": "nama@email.com",
    "profile.phone": "Telepon",
    "profile.phonePh": "+62 …",
    "profile.phoneOptional": "(opsional)",
    "profile.fitnessGoal": "Tujuan fitness",
    "profile.selectGoal": "Pilih tujuan",
    "profile.goal.cutting": "Cutting — turunkan lemak",
    "profile.goal.bulking": "Bulking — bangun otot",
    "profile.goal.maintenance": "Maintenance — pertahankan bentuk",
    "profile.bio": "Bio",
    "profile.bioPh": "Perkenalan singkat, cedera yang perlu diperhatikan, latihan favorit…",
    "profile.bodyMetrics": "Metrik tubuh",
    "profile.bodyMetricsDesc": "Digunakan untuk menyesuaikan saran kalori dan volume.",
    "profile.heightCm": "Tinggi (cm)",
    "profile.weightKg": "Berat (kg)",
    "profile.notifications": "Notifikasi",
    "profile.notificationsDesc": "Atur pengingat dalam demo ini (disimpan lokal).",
    "profile.emailUpdates": "Update email",
    "profile.emailUpdatesDesc":
      "Tips, streak, dan ringkasan mingguan (saat email terhubung).",
    "profile.emailNotifAria": "Notifikasi email",
    "profile.footerNote":
      "Data hanya disimpan di browser Anda (localStorage). Hubungkan backend nanti untuk sinkron antar perangkat.",
    "profile.toast.saved": "Profil disimpan",
    "profile.toast.savedDesc": "Pengaturan Anda tersimpan di browser ini.",
    "profile.toast.error": "Tidak dapat menyimpan profil",

    "landing.nav.features": "Fitur",
    "landing.nav.howItWorks": "Cara kerja",
    "landing.nav.startFree": "Mulai gratis",
    "landing.a11y.closeMenu": "Tutup menu",
    "landing.a11y.openMenu": "Buka menu",
    "landing.hero.badge": "Pelatih kebugaran bertenaga AI",
    "landing.hero.titleBefore": "AI Gym Coach yang",
    "landing.hero.titleHighlight": "menyesuaikan progres Anda",
    "landing.hero.subtitle":
      "Berhenti menebak latihan dan kalori. Biarkan AI yang mengatur.",
    "landing.hero.ctaPrimary": "Mulai gratis",
    "landing.hero.ctaSecondary": "Lihat cara kerjanya",
    "landing.hero.statsWorkouts": "Latihan dibuat",
    "landing.hero.statsUsers": "Pengguna melihat progres",
    "landing.hero.imageAlt": "Pratinjau dasbor kebugaran",

    "landing.problems.title": "Lelah menghadapi masalah ini?",
    "landing.problems.subtitle":
      "Anda tidak sendirian. Banyak orang kesulitan merencanakan fitness.",
    "landing.problems.0.title": "Stagnan di gym tanpa progres",
    "landing.problems.0.desc":
      "Anda latihan rutin tapi tidak ada hasil karena program tidak berkembang.",
    "landing.problems.1.title": "Tidak tahu berapa kalori yang harus dimakan",
    "landing.problems.1.desc":
      "Menebak kebutuhan nutrisi membuat progres lambat atau bahkan naik berat badan.",
    "landing.problems.2.title": "Program latihan tidak adaptif",
    "landing.problems.2.desc":
      "Program generik tidak menyesuaikan progres dan pemulihan unik Anda.",

    "landing.how.title": "Cara kerja AI Gym Coach",
    "landing.how.subtitle": "Sederhana, cerdas, dan personal untuk Anda",
    "landing.how.step1Title": "Masukkan data Anda",
    "landing.how.step1Desc": "Tinggi, berat, tujuan, dan frekuensi gym",
    "landing.how.step2Title": "AI menganalisis",
    "landing.how.step2Desc": "Membuat rencana latihan dan nutrisi optimal",
    "landing.how.step3Title": "Dapatkan rencana personal",
    "landing.how.step3Desc": "Menyesuaikan mingguan berdasarkan progres Anda",

    "landing.features.title": "Semua yang Anda butuhkan untuk bertransformasi",
    "landing.features.subtitle": "Fitur andal untuk hasil nyata",
    "landing.features.0.title": "Onboarding cerdas",
    "landing.features.0.desc":
      "Setup cepat yang menangkap tujuan Anda dan membuat rencana personal secara instan.",
    "landing.features.1.title": "Generator latihan AI",
    "landing.features.1.desc":
      "Split latihan (Push/Pull/Legs) dengan latihan, set, dan rep yang disesuaikan.",
    "landing.features.2.title": "Pencatat latihan",
    "landing.features.2.desc":
      "Mencatat berat dan rep dengan cepat untuk setiap latihan.",
    "landing.features.3.title": "Penyesuaian mingguan AI",
    "landing.features.3.desc":
      "AI menganalisis progres dan menyesuaikan volume, intensitas, dan kalori.",
    "landing.features.4.title": "Pelacak nutrisi",
    "landing.features.4.desc":
      "Cukup ketik apa yang Anda makan. AI menghitung kalori, protein, dan makro.",
    "landing.features.5.title": "Dasbor progres",
    "landing.features.5.desc":
      "Grafik berat badan, volume, dan pencapaian yang mudah dibaca.",

    "landing.testimonials.title": "Disukai penggemar fitness",
    "landing.testimonials.0.name": "Sarah Johnson",
    "landing.testimonials.0.role": "Turun 15kg dalam 4 bulan",
    "landing.testimonials.0.quote":
      "AI Gym Coach menghilangkan tebakan. Latihan menyesuaikan progres saya dengan sempurna!",
    "landing.testimonials.1.name": "Mike Chen",
    "landing.testimonials.1.role": "Naik 8kg otot",
    "landing.testimonials.1.quote":
      "Akhirnya program yang bisa disesuaikan. AI tahu kapan harus lebih keras atau mengurangi.",
    "landing.testimonials.2.name": "Emma Williams",
    "landing.testimonials.2.role": "Komposisi tubuh berubah",
    "landing.testimonials.2.quote":
      "Pelacak nutrisi mengubah segalanya. Tidak perlu spreadsheet atau aplikasi rumit.",

    "landing.cta.title": "Mulai transformasi Anda hari ini",
    "landing.cta.subtitle":
      "Bergabung dengan ribuan orang yang mendapat hasil nyata dengan coaching AI",
    "landing.cta.bullet1": "Tanpa kartu kredit",
    "landing.cta.bullet2": "Siap dalam 2 menit",
    "landing.cta.bullet3": "Batalkan kapan saja",

    "landing.footer.copyright": "© 2026 AI Gym Coach. Hak cipta dilindungi.",
    ...extraMessagesId,
  },
};

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  let text = dictionaries[locale][key];
  if (text === undefined) text = dictionaries.en[key];
  if (text === undefined) return key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.split(`{{${k}}}`).join(String(v));
    }
  }
  return text;
}
