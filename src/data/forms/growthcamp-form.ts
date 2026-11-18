import type { FormConfig } from "../../../shared/form-types.ts";

// GrowthCamp registration form, from the "2. PAGE LEARN" Figma export (5 steps + finished screen).
// Draft decisions (not in Figma): WhatsApp variant of the contact field and "terisi" wording on the review list.
const option = (value: string) => ({ value, label: value });

export const growthcampForm: FormConfig = {
  slug: "growthcamp",
  programName: "GrowthCamp",
  eyebrow: "Pendaftaran & kesiapan belajar",
  backTo: "/learn/growthcamp",
  backLabel: "Kembali ke GrowthCamp",
  startBackLabel: "Kembali ke program",
  steps: [
    {
      id: "profil",
      label: "Profil",
      title: "Tell Us About Yourself",
      description: "Mulai dengan profil dan kontak utama agar konteks belajarmu dapat dipahami.",
      fields: [
        { type: "text", id: "name", label: "Nama lengkap", placeholder: "Nama lengkapmu", required: true },
        { type: "radio", id: "contactType", label: "Pilih kontak utama", hint: "Gunakan salah satu: email atau WhatsApp.", required: true, defaultValue: "email", options: [{ value: "email", label: "Email" }, { value: "whatsapp", label: "WhatsApp" }] },
        {
          type: "text",
          id: "contact",
          label: "Email utama",
          placeholder: "nama@contoh.com",
          hint: "Kolom mengikuti kontak yang dipilih. Jika memilih WhatsApp, isi nomor WhatsApp aktif.",
          required: true,
          inputMode: "email",
          dynamic: {
            by: "contactType",
            map: {
              email: { label: "Email utama", placeholder: "nama@contoh.com", inputMode: "email" },
              whatsapp: { label: "Nomor WhatsApp aktif", placeholder: "Contoh: 081234567890", inputMode: "tel" },
            },
          },
        },
        { type: "text", id: "altContact", label: "Kontak alternatif (opsional)", placeholder: "Email atau WhatsApp cadangan" },
        { type: "text", id: "university", label: "Universitas", placeholder: "Nama universitas", required: true },
        { type: "text", id: "program", label: "Program studi", placeholder: "Nama program studi", required: true },
        { type: "text", id: "semester", label: "Semester / status studi", placeholder: "Semester atau status studi saat ini", required: true },
        { type: "text", id: "city", label: "Kota / domisili", hint: "Cukup kota atau domisili; tidak perlu alamat rumah lengkap.", placeholder: "Kota tempat tinggal saat ini", required: true },
      ],
    },
    {
      id: "tujuan",
      label: "Tujuan",
      title: "Your Learning Goals",
      description: "Ceritakan tujuan, alasan, dan materi yang paling ingin kamu pelajari.",
      fields: [
        { type: "checkboxes", id: "goals", label: "Apa yang ingin kamu capai setelah mengikuti GrowthCamp?", required: true, max: 2, options: ["Memahami consulting", "Belajar menganalisis masalah", "Mengolah data", "Menyampaikan rekomendasi", "Mempersiapkan proyek", "Mengeksplorasi karier", "Lainnya"] },
        { type: "textarea", id: "why", label: "Mengapa tujuan tersebut penting untukmu saat ini?", placeholder: "Ceritakan alasan personalmu...", required: true, maxWords: 100 },
        { type: "checkboxes", id: "topics", label: "Topik apa yang paling ingin kamu pelajari?", required: true, max: 3, options: ["Memahami masalah", "Riset pelanggan / pasar", "Analisis data dasar", "Pemasaran", "Operasional", "Keuangan dasar", "Presentasi rekomendasi"] },
      ],
    },
    {
      id: "belajar",
      label: "Belajar",
      title: "How You Learn",
      description: "Pengalaman awal membantu GCC memahami kebutuhan belajarmu. Pemula tetap dapat menjawab sesuai kondisi sebenarnya.",
      fields: [
        { type: "checkboxes", id: "experience", label: "Pengalaman belajar apa yang pernah kamu coba terkait topik tersebut?", hint: "Pilih yang sesuai. “Belum pernah” tidak dipilih bersamaan dengan pengalaman lain.", required: true, exclusive: "Belum pernah", options: ["Kuliah", "Belajar mandiri", "Organisasi", "Kompetisi", "Membantu usaha", "Belum pernah"] },
        { type: "textarea", id: "experienceDetail", label: "Penjelasan pengalaman belajar", hint: "Wajib hanya jika ada pengalaman yang dipilih. Jika memilih “Belum pernah”, bagian ini dilewati.", placeholder: "Jelaskan singkat jika pernah mencoba...", requiredWhen: { field: "experience", anyBut: "Belum pernah" } },
        { type: "textarea", id: "situation", label: "Ceritakan satu situasi saat kamu perlu mempelajari sesuatu yang belum kamu kuasai. Apa yang kamu lakukan?", placeholder: "Boleh dari kuliah atau kegiatan sehari-hari...", required: true, maxWords: 120 },
        {
          type: "matrix",
          id: "comfort",
          label: "Seberapa nyaman kamu melakukan aktivitas berikut?",
          hint: "Pilih satu jawaban untuk setiap aktivitas. Tidak ada jawaban yang otomatis menggugurkan pemula.",
          required: true,
          rows: ["Membaca data sederhana", "Mencari informasi", "Bekerja dalam kelompok", "Mempresentasikan ide"],
          options: ["Belum pernah mencoba.", "Pernah mencoba dengan bantuan.", "Dapat mengerjakan sendiri untuk tugas sederhana.", "Pernah membantu orang lain mengerjakannya."],
        },
        {
          type: "group",
          id: "questions",
          label: "Pemilik kedai berkata, “Pelanggan belakangan berkurang.” Dua hal apa yang ingin kamu tanyakan sebelum memberikan saran?",
          hint: "Tuliskan dua pertanyaan. Tujuannya memahami rasa ingin tahu dan cara berpikirmu.",
          required: true,
          fields: [
            { type: "textarea", id: "q1", label: "Pertanyaan pertama", placeholder: "Apa yang ingin kamu ketahui?", required: true },
            { type: "textarea", id: "q2", label: "Pertanyaan kedua", placeholder: "Pertanyaan lain yang ingin kamu gali...", required: true },
          ],
        },
      ],
    },
    {
      id: "komitmen",
      label: "Komitmen",
      title: "Your Commitment",
      description: "Sampaikan komitmen waktu yang realistis dan dukungan yang dapat membantu.",
      backLabel: "Kembali ke Cara Belajar",
      nextLabel: "Tinjau Jawaban",
      fields: [
        { type: "note", id: "scheduleNote", label: "", title: "Jadwal belum tersedia", text: "Pertanyaan pilihan sesi dan benturan jadwal akan muncul setelah jadwal program tersedia. Saat ini bagian tersebut tidak perlu dijawab." },
        { type: "text", id: "hours", label: "Di luar sesi, berapa waktu belajar yang realistis kamu sediakan setiap minggu?", hint: "Tuliskan rentang jam, atau pilih “Belum bisa memastikan”.", placeholder: "Contoh: 1–2 jam per minggu", alternative: "Belum bisa memastikan", required: true },
        { type: "textarea", id: "support", label: "Apa yang mungkin membuatmu kesulitan mengikuti program, dan dukungan apa yang membantu? (opsional)", placeholder: "Misalnya akses perangkat, waktu, atau penyesuaian komunikasi..." },
        { type: "radio", id: "willing", label: "Apakah kamu bersedia mengikuti latihan, menerima masukan, dan berkolaborasi selama program?", hint: "Pilih salah satu. “Perlu penjelasan” menjadi bahan klarifikasi GCC.", required: true, options: ["Ya", "Perlu penjelasan"].map(option) },
      ],
    },
  ],
  review: {
    title: "Review Your Answers",
    description: "Periksa dan ubah jawaban sebelum mengirim pengajuan. Ringkasan ini mengikuti isian pada langkah sebelumnya.",
    finishLabel: "Selesaikan Simulasi",
    sections: [
      {
        title: "Profil dan kontak",
        step: 0,
        items: [
          { label: "Nama, kontak utama, universitas, prodi, semester / status, kota", fields: ["name", "contact", "university", "program", "semester", "city"] },
          { label: "Kontak alternatif", fields: ["altContact"], optional: true },
        ],
      },
      {
        title: "Tujuan belajar",
        step: 1,
        items: [
          { code: "GC-01", label: "Tujuan", fields: ["goals"] },
          { code: "GC-02", label: "Alasan", fields: ["why"] },
          { code: "GC-03", label: "Topik", fields: ["topics"] },
        ],
      },
      {
        title: "Cara belajar",
        step: 2,
        items: [
          { code: "GC-04", label: "Pengalaman", fields: ["experience", "experienceDetail"] },
          { code: "GC-05", label: "Situasi belajar", fields: ["situation"] },
          { code: "GC-06", label: "Empat aktivitas", fields: ["comfort"] },
          { code: "GC-07", label: "Dua pertanyaan", fields: ["q1", "q2"] },
        ],
      },
      {
        title: "Komitmen dan dukungan",
        step: 3,
        items: [
          { code: "GC-08", label: "Pilihan sesi", fields: [], static: "tidak ditanyakan; jadwal belum tersedia" },
          { code: "GC-09", label: "Waktu belajar", fields: ["hours"] },
          { code: "GC-10", label: "Dukungan", fields: ["support"], optional: true },
          { code: "GC-11", label: "Kesediaan", fields: ["willing"] },
        ],
      },
    ],
  },
  done: {
    title: "Simulasi Selesai",
    description: "Jawaban tidak dikirim atau disimpan.",
    card: { title: "Terima kasih sudah mencoba alur pendaftaran GrowthCamp.", text: "Ini adalah konfirmasi simulasi, bukan bukti pendaftaran atau keputusan penerimaan peserta." },
    backLabel: "Kembali ke GrowthCamp",
    exploreLabel: "Jelajahi Learn",
    exploreTo: "/learn",
  },
};
