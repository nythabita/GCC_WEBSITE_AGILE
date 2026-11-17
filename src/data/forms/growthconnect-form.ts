import type { FormConfig } from "../../../shared/form-types.ts";

// GrowthConnect business-challenge form, from the "4. PAGE APPLY - GROWTHCONNECT" Figma export (5 steps + finished screen).
// Draft decisions (not in Figma): WhatsApp variant of the contact field, "terisi" wording on the review list, and the
// budget range field is shown only after choosing "Memiliki kisaran" (Figma shows it in the empty state with a hint saying so).
const option = (value: string) => ({ value, label: value });

export const growthconnectForm: FormConfig = {
  slug: "growthconnect",
  programName: "GrowthConnect",
  eyebrow: "Pengajuan tantangan bisnis",
  backTo: "/apply/growthconnect",
  backLabel: "Kembali ke GrowthConnect",
  steps: [
    {
      id: "kontak",
      label: "Kontak",
      title: "Your Business Contact",
      description: "Mulai dengan kontak penghubung dan lokasi usaha agar kebutuhan komunikasi dapat dipahami.",
      fields: [
        { type: "text", id: "name", label: "Nama penghubung usaha", placeholder: "Nama lengkap Anda", required: true },
        { type: "radio", id: "contactType", label: "Pilih kontak utama", hint: "Gunakan salah satu: email atau WhatsApp.", required: true, defaultValue: "email", options: [{ value: "email", label: "Email" }, { value: "whatsapp", label: "WhatsApp" }] },
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
        { type: "text", id: "role", label: "Peran Anda dalam usaha", placeholder: "Contoh: pemilik atau pengelola usaha", required: true },
        { type: "text", id: "district", label: "Kecamatan lokasi usaha", placeholder: "Nama kecamatan", required: true },
        { type: "text", id: "city", label: "Kota / kabupaten lokasi usaha", hint: "Tidak perlu menuliskan alamat rumah lengkap.", placeholder: "Nama kota atau kabupaten", required: true },
        { type: "note", id: "aboutNote", label: "", title: "Tentang pengajuan", text: "Formulir awal membantu GCC memahami konteks usaha. Pengajuan belum berarti proyek diterima; kebutuhan dan lingkup dibahas lebih lanjut." },
      ],
    },
    {
      id: "usaha",
      label: "Usaha",
      title: ["Tell Us About Your", "Business"],
      description: "Ceritakan kegiatan usaha, pelanggan, dan cara penjualan Anda.",
      fields: [
        {
          type: "group",
          id: "bizProfile",
          label: "Apa nama usaha dan produk/jasa utama yang ditawarkan?",
          required: true,
          fields: [
            { type: "text", id: "bizName", label: "Nama usaha", placeholder: "Nama usaha Anda", required: true },
            { type: "textarea", id: "product", label: "Produk / jasa utama", placeholder: "Ceritakan produk atau jasa utama...", required: true },
          ],
        },
        {
          type: "radio",
          id: "sector",
          label: "Usaha bergerak di bidang apa?",
          hint: "Pilih bidang yang paling sesuai dengan kegiatan utama usaha.",
          required: true,
          options: ["Makanan / minuman", "Perdagangan", "Jasa", "Produksi / kerajinan", "Pertanian", "Lainnya"].map(option),
        },
        {
          type: "group",
          id: "bizSize",
          label: "Sudah berapa lama usaha berjalan dan berapa orang yang terlibat?",
          required: true,
          fields: [
            { type: "text", id: "age", label: "Lama usaha berjalan", placeholder: "Tuliskan rentang waktu; contoh: 1–2 tahun", required: true },
            { type: "text", id: "people", label: "Orang yang terlibat", placeholder: "Tuliskan jumlah atau rentang orang", required: true },
          ],
        },
        {
          type: "group",
          id: "bizCustomers",
          label: "Siapa pelanggan utama dan melalui saluran apa mereka membeli?",
          required: true,
          fields: [
            { type: "textarea", id: "customer", label: "Pelanggan utama", placeholder: "Ceritakan kelompok pelanggan utama...", required: true },
            { type: "checkboxes", id: "channels", label: "Saluran pembelian", hint: "Pilih yang sesuai dengan usaha Anda.", required: true, options: ["Toko", "WhatsApp", "Media sosial", "Marketplace", "Reseller", "Lainnya"] },
          ],
        },
      ],
    },
    {
      id: "masalah",
      label: "Masalah",
      title: "Describe the Challenge",
      description: "Tidak perlu memiliki rumusan masalah yang sempurna. Mulai dengan situasi yang sedang Anda hadapi.",
      backLabel: "Kembali ke Profil Usaha",
      fields: [
        { type: "textarea", id: "problem", label: "Apa satu masalah paling penting yang ingin dibantu saat ini? Jika ada beberapa, pilih yang paling mendesak.", placeholder: "Ceritakan satu masalah prioritas...", required: true, maxWords: 150 },
        { type: "textarea", id: "since", label: "Sejak kapan masalah tersebut terasa? Ceritakan satu kejadian atau perubahan yang Anda amati.", placeholder: "Jelaskan waktunya dan contoh kejadian...", required: true },
        { type: "checkboxes", id: "impact", label: "Apa dampaknya terhadap usaha?", hint: "Pilih yang sesuai, lalu jelaskan dampaknya.", required: true, options: ["Pesanan berkurang", "Biaya meningkat", "Stok menumpuk", "Pekerjaan terlambat", "Keluhan pelanggan", "Dampak lain"] },
        { type: "textarea", id: "impactDetail", label: "Jelaskan dampak yang Anda rasakan", placeholder: "Ceritakan dampaknya terhadap kegiatan usaha...", required: true },
        { type: "textarea", id: "records", label: "Apakah ada angka atau catatan yang membantu menggambarkan masalah? (opsional)", hint: "Perkiraan diperbolehkan. Tandai angka perkiraan dengan jelas.", placeholder: "Ceritakan catatan yang tersedia atau tulis “belum tercatat”..." },
        { type: "textarea", id: "tried", label: "Apa yang sudah pernah dicoba untuk mengatasinya, dan bagaimana hasilnya?", hint: "Boleh menjawab “belum pernah”.", placeholder: "Ceritakan upaya sebelumnya dan hasil yang diamati...", required: true },
        { type: "textarea", id: "cause", label: "Menurut Anda, apa yang mungkin menyebabkan masalah tersebut? (opsional)", hint: "Dugaan tidak diperlakukan sebagai penyebab yang sudah terbukti.", placeholder: "Ceritakan dugaan Anda atau tulis “belum tahu”..." },
      ],
    },
    {
      id: "kebutuhan",
      label: "Kebutuhan",
      title: ["Your Needs and", "Expectations"],
      description: "Jelaskan hasil yang diharapkan, informasi yang tersedia, dan batasan yang perlu dibahas bersama.",
      backLabel: "Kembali ke Masalah",
      nextLabel: "Tinjau Jawaban",
      fields: [
        { type: "textarea", id: "decision", label: "Keputusan apa yang ingin lebih mudah Anda ambil setelah mendapat bantuan GCC?", placeholder: "Ceritakan keputusan yang ingin Anda dukung...", required: true },
        { type: "textarea", id: "change", label: "Perubahan seperti apa yang akan dianggap membantu? Apakah ada waktu tertentu yang perlu diperhatikan?", hint: "Boleh belum memiliki target angka. Jika belum ada waktu tertentu, jelaskan kondisi tersebut.", placeholder: "Ceritakan perubahan yang diharapkan dan kebutuhan waktunya...", required: true },
        { type: "checkboxes", id: "notes", label: "Catatan apa yang tersedia untuk dibahas nanti?", hint: "Pilih yang tersedia. “Belum ada” tidak dipilih bersama jenis catatan lainnya.", required: true, exclusive: "Belum ada", options: ["Penjualan", "Biaya", "Stok", "Pelanggan", "Media sosial", "Proses kerja", "Belum ada"] },
        { type: "note", id: "notesNote", label: "", text: "Cukup informasi ketersediaannya. Tidak perlu mengunggah laporan keuangan atau data pelanggan pada tahap awal. Kebutuhan dan penggunaan data dibahas sesuai persetujuan." },
        {
          type: "group",
          id: "contactPerson",
          label: "Siapa yang dapat menjelaskan kondisi usaha dan menyetujui ruang lingkup proyek? Kapan dapat dihubungi?",
          required: true,
          fields: [
            { type: "textarea", id: "decider", label: "Peran penghubung / pengambil keputusan", placeholder: "Jelaskan peran yang berwenang dalam usaha...", required: true },
            { type: "textarea", id: "when", label: "Waktu yang dapat dihubungi", placeholder: "Hari / waktu yang memungkinkan...", required: true },
          ],
        },
        { type: "checkboxes", id: "limits", label: "Adakah batasan yang perlu GCC ketahui? (opsional)", hint: "Pilih jika ada, lalu jelaskan sesuai kebutuhan.", options: ["Waktu", "Anggaran", "Tenaga", "Akses data", "Lainnya"] },
        { type: "textarea", id: "limitsDetail", label: "Penjelasan batasan (opsional)", placeholder: "Ceritakan batasan yang perlu dipertimbangkan..." },
        { type: "radio", id: "budget", label: "Apakah ada anggaran untuk pendampingan ini? (opsional)", hint: "Jawaban membantu pembahasan lingkup dan biaya; terpisah dari penilaian mutu kasus.", options: ["Belum ditentukan", "Ingin mendiskusikan", "Memiliki kisaran", "Belum tersedia"].map(option) },
        { type: "text", id: "budgetRange", label: "Kisaran anggaran, jika ingin dibagikan (opsional)", hint: "Ditampilkan jika memilih “Memiliki kisaran”. Nominal tetap opsional.", placeholder: "Tuliskan kisaran dalam rupiah...", showIf: { field: "budget", equals: "Memiliki kisaran" } },
        { type: "textarea", id: "support", label: "Adakah bantuan atau penyesuaian komunikasi yang Anda perlukan? (opsional)", placeholder: "Misalnya bantuan pengisian formulir..." },
      ],
    },
  ],
  review: {
    title: "Review Your Submission",
    description: "Periksa dan ubah jawaban sebelum menyelesaikan simulasi pengajuan tantangan bisnis.",
    finishLabel: "Selesaikan Simulasi",
    sections: [
      {
        title: "Kontak dan lokasi",
        step: 0,
        items: [
          { label: "Nama, kontak utama, peran, kecamatan, kota / kabupaten", fields: ["name", "contact", "role", "district", "city"] },
          { label: "Kontak alternatif", fields: ["altContact"], optional: true },
        ],
      },
      {
        title: "Profil usaha",
        step: 1,
        items: [
          { code: "GB-01", label: "Nama dan produk/jasa", fields: ["bizName", "product"] },
          { code: "GB-02", label: "Bidang usaha", fields: ["sector"] },
          { code: "GB-03", label: "Lama usaha dan orang terlibat", fields: ["age", "people"] },
          { code: "GB-04", label: "Pelanggan dan saluran", fields: ["customer", "channels"] },
        ],
      },
      {
        title: "Masalah prioritas",
        step: 2,
        items: [
          { code: "GB-05", label: "Masalah utama", fields: ["problem"] },
          { code: "GB-06", label: "Kejadian dan waktu", fields: ["since"] },
          { code: "GB-07", label: "Dampak dan penjelasan", fields: ["impact", "impactDetail"] },
          { code: "GB-08", label: "Catatan angka", fields: ["records"], optional: true },
          { code: "GB-09", label: "Upaya sebelumnya", fields: ["tried"] },
          { code: "GB-10", label: "Dugaan penyebab", fields: ["cause"], optional: true },
        ],
      },
      {
        title: "Kebutuhan dan lingkup",
        step: 3,
        items: [
          { code: "GB-11", label: "Keputusan yang diharapkan", fields: ["decision"] },
          { code: "GB-12", label: "Perubahan dan waktu", fields: ["change"] },
          { code: "GB-13", label: "Ketersediaan catatan", fields: ["notes"] },
          { code: "GB-14", label: "Peran penghubung dan waktu", fields: ["decider", "when"] },
          { code: "GB-15", label: "Batasan", fields: ["limits", "limitsDetail"], optional: true },
          { code: "GB-16", label: "Anggaran", fields: ["budget", "budgetRange"], optional: true },
          { label: "Bantuan pengisian / komunikasi", fields: ["support"], optional: true },
        ],
      },
    ],
  },
  done: {
    title: "Simulasi Selesai",
    description: "Jawaban tidak dikirim atau disimpan.",
    backLabel: "Kembali ke GrowthConnect",
    exploreLabel: "Jelajahi Apply",
    exploreTo: "/apply",
  },
};
