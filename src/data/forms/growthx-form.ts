import type { FormConfig } from "../../components/form/types";

// GrowthX application form, from the "3. PAGE APPLY (GROWTH X)" Figma export (5 steps + finished screen).
// Draft decisions (not in Figma): WhatsApp variant of the contact field, "terisi" wording on the review list.
export const growthxForm: FormConfig = {
  slug: "growthx",
  programName: "GrowthX",
  eyebrow: "Pendaftaran & kesiapan proyek",
  backTo: "/apply/growthx",
  backLabel: "Kembali ke GrowthX",
  steps: [
    {
      id: "profil",
      label: "Profil",
      title: "Tell Us About Yourself",
      description: "Lengkapi profil dan kontak agar konteks kesiapan proyekmu dapat dipahami.",
      fields: [
        { type: "text", id: "name", label: "Nama lengkap", placeholder: "Nama lengkapmu", required: true },
        {
          type: "radio",
          id: "contactType",
          label: "Pilih kontak utama",
          hint: "Gunakan salah satu: email atau WhatsApp.",
          required: true,
          defaultValue: "email",
          options: [
            { value: "email", label: "Email" },
            { value: "whatsapp", label: "WhatsApp" },
          ],
        },
        {
          type: "text",
          id: "contact",
          label: "Email utama",
          placeholder: "nama@contoh.com",
          hint: "Jika memilih WhatsApp, kolom berubah menjadi nomor WhatsApp aktif.",
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
        { type: "text", id: "city", label: "Kota / domisili", placeholder: "Kota tempat tinggal saat ini", required: true },
      ],
    },
    {
      id: "kontribusi",
      label: "Kontribusi",
      title: "Your Contribution",
      description: "Ceritakan bekal pembelajaran dan bidang yang paling siap kamu kontribusikan.",
      fields: [
        { type: "textarea", id: "motivation", label: "Apa yang membuatmu ingin mengikuti proyek GrowthX, dan kontribusi apa yang ingin kamu berikan?", placeholder: "Ceritakan motivasi dan kontribusi yang kamu harapkan...", required: true, maxWords: 100 },
        {
          type: "checkboxes",
          id: "background",
          label: "Apa bekal pembelajaranmu?",
          hint: "Pilih yang sesuai. Mengikuti GrowthCamp tidak menjadi syarat otomatis.",
          required: true,
          options: ["GrowthCamp", "Mata kuliah", "Pelatihan lain", "Belajar mandiri", "Pengalaman proyek"],
        },
        { type: "textarea", id: "backgroundDetail", label: "Jelaskan bekal pembelajaran yang paling relevan", placeholder: "Ceritakan pembelajaran yang mendukung kontribusimu...", required: true },
        {
          type: "checkboxes",
          id: "areas",
          label: "Pilih bidang kontribusi terkuatmu",
          required: true,
          max: 2,
          options: ["Riset pasar / pelanggan", "Analisis data", "Pemasaran", "Operasional", "Keuangan dasar", "Penyusunan rekomendasi / presentasi"],
        },
        {
          type: "perSelection",
          id: "abilities",
          from: "areas",
          label: "Untuk setiap bidang pilihanmu, apa yang sudah dapat kamu kerjakan sendiri dan apa yang masih membutuhkan bantuan?",
          hint: "Kolom mengikuti bidang yang kamu pilih. Bidang kedua hanya muncul jika kamu memilih dua bidang.",
          placeholder: "Kemampuan mandiri dan bagian yang masih perlu bantuan...",
          required: true,
          labels: ["Bidang pertama", "Bidang kedua (jika dipilih)"],
        },
      ],
    },
    {
      id: "bukti",
      label: "Bukti",
      title: "Show Your Experience",
      description: "Gunakan pengalaman nyata dari kuliah, organisasi, atau kegiatan lain untuk menjelaskan kontribusimu.",
      fields: [
        { type: "textarea", id: "experience", label: "Ceritakan satu tugas/proyek yang relevan: masalahnya, peranmu, tindakanmu, hasilnya, dan pelajaran yang diperoleh.", placeholder: "Tugas kuliah dan organisasi diperbolehkan...", required: true, maxWords: 200 },
        { type: "text", id: "portfolio", label: "Adakah contoh hasil kerja yang boleh kamu bagikan? (opsional)", hint: "Tautan opsional. Bagikan hanya hasil kerja yang boleh diakses; tidak perlu mengunggah dokumen rahasia.", placeholder: "https://...", inputMode: "url" },
        { type: "textarea", id: "portfolioRole", label: "Bagian mana yang kamu kerjakan pada hasil kerja tersebut? (opsional)", placeholder: "Jelaskan kontribusi pribadimu jika membagikan tautan..." },
        { type: "textarea", id: "tools", label: "Alat apa yang pernah kamu gunakan, dan untuk pekerjaan apa?", hint: "Boleh menjawab “belum pernah”. Jelaskan penggunaan nyata jika pernah mencoba.", placeholder: "Contoh: spreadsheet untuk membersihkan data, atau slide untuk presentasi...", required: true },
        { type: "textarea", id: "collab", label: "Ceritakan situasi ketika pendapatmu berbeda dengan anggota tim. Apa yang kamu lakukan?", placeholder: "Ceritakan situasi dan tindakanmu...", required: true, maxWords: 120 },
        { type: "textarea", id: "dataLimit", label: "Jika data klien belum cukup untuk mendukung rekomendasi, bagaimana kamu menanganinya?", placeholder: "Jelaskan bagaimana kamu menyikapi keterbatasan data...", required: true, maxWords: 100 },
      ],
    },
    {
      id: "komitmen",
      label: "Komitmen",
      title: ["Your Project", "Commitment"],
      description: "Sampaikan waktu, minat kasus, dan komitmen yang perlu dipertimbangkan sebelum penempatan.",
      nextLabel: "Tinjau Jawaban",
      fields: [
        {
          type: "group",
          id: "availability",
          label: "Berapa waktu yang realistis kamu sediakan, kapan kamu tersedia, dan adakah komitmen yang berpotensi berbenturan?",
          required: true,
          fields: [
            { type: "text", id: "hours", label: "Rentang waktu per minggu", placeholder: "Contoh: 3–5 jam per minggu", required: true },
            { type: "textarea", id: "schedule", label: "Hari / waktu yang tersedia", placeholder: "Tuliskan waktu yang realistis...", required: true },
            { type: "textarea", id: "conflicts", label: "Komitmen yang berpotensi berbenturan", placeholder: "Ceritakan batasan jadwal atau tulis “tidak ada”...", required: true },
          ],
        },
        { type: "textarea", id: "interest", label: "Jenis usaha atau masalah apa yang paling kamu minati?", placeholder: "Ceritakan minat kasus atau konteks usaha...", required: true },
        { type: "textarea", id: "relationship", label: "Adakah hubungan pribadi/usaha yang perlu diketahui sebelum penempatan? (opsional)", hint: "Pengungkapan hubungan bersifat opsional dan dibahas jika relevan.", placeholder: "Ceritakan jika ada hubungan yang relevan..." },
        { type: "textarea", id: "support", label: "Adakah kebutuhan dukungan yang membantu partisipasimu? (opsional)", placeholder: "Misalnya akses perangkat atau penyesuaian komunikasi..." },
        { type: "consent", id: "consent", label: "Konfirmasi pemahaman dan kerahasiaan", required: true, text: "Saya memahami bahwa penempatan bergantung pada kesiapan, kebutuhan proyek, dan kapasitas tim; serta bersedia menjaga kerahasiaan informasi klien." },
      ],
    },
  ],
  review: {
    title: "Review Your Answers",
    description: "Periksa dan ubah jawaban sebelum menyelesaikan simulasi formulir awal.",
    finishLabel: "Selesaikan Simulasi",
    sections: [
      {
        title: "Profil dan kontak",
        step: 0,
        items: [
          { label: "Profil pendidikan, domisili, dan kontak utama", fields: ["name", "contact", "university", "program", "semester", "city"] },
          { label: "Kontak alternatif", fields: ["altContact"], optional: true },
        ],
      },
      {
        title: "Kontribusi",
        step: 1,
        items: [
          { code: "GX-01", label: "Motivasi", fields: ["motivation"] },
          { code: "GX-02", label: "Bekal pembelajaran", fields: ["background", "backgroundDetail"] },
          { code: "GX-03", label: "Bidang pilihan", fields: ["areas"] },
          { code: "GX-04", label: "Kemampuan per bidang", fields: ["abilities"] },
        ],
      },
      {
        title: "Bukti pengalaman",
        step: 2,
        items: [
          { code: "GX-05", label: "Pengalaman", fields: ["experience"] },
          { code: "GX-06", label: "Hasil kerja", fields: ["portfolio", "portfolioRole"], optional: true },
          { code: "GX-07", label: "Penggunaan alat", fields: ["tools"] },
          { code: "GX-08", label: "Kolaborasi", fields: ["collab"] },
          { code: "GX-09", label: "Keterbatasan data", fields: ["dataLimit"] },
        ],
      },
      {
        title: "Komitmen",
        step: 3,
        items: [
          { code: "GX-10", label: "Waktu dan jadwal", fields: ["hours", "schedule", "conflicts"] },
          { code: "GX-11", label: "Minat kasus", fields: ["interest"] },
          { label: "Hubungan relevan dan dukungan", fields: ["relationship", "support"], optional: true },
          { code: "GX-12", label: "Konfirmasi", fields: ["consent"] },
        ],
      },
    ],
  },
  done: {
    title: "Simulasi Selesai",
    description: "Jawaban tidak dikirim atau disimpan.",
    backLabel: "Kembali ke GrowthX",
    exploreLabel: "Jelajahi Apply",
    exploreTo: "/apply",
  },
};
