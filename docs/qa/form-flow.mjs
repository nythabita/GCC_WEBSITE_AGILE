// Smoke test for the GrowthX multi-step form: validation, per-step navigation, review state, finish.
// Usage: node form-flow.mjs [baseUrl=http://localhost:5173]
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:5173";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const check = (name, ok) => { console.log(ok ? "ok  " : "FAIL", name); if (!ok) process.exitCode = 1; };

await page.goto(`${base}/apply/growthx/form`, { waitUntil: "networkidle" });
check("step 1 heading", (await page.locator("h1").innerText()).includes("Tell Us About Yourself"));
await page.getByRole("button", { name: /^Lanjut/ }).click();
check("empty step 1 shows errors", (await page.getByRole("alert").count()) >= 5);
await page.getByLabel(/Nama lengkap/).fill("Test Nama");
await page.getByLabel(/Email utama/).fill("salah");
await page.getByLabel(/Universitas/).fill("Univ Uji");
await page.getByLabel(/Program studi/).fill("Prodi");
await page.getByLabel(/Semester/).fill("5");
await page.getByLabel(/Kota/).fill("Bandung");
await page.getByRole("button", { name: /^Lanjut/ }).click();
check("invalid email blocked", (await page.locator("h1").innerText()).includes("Tell Us"));
await page.getByLabel(/Email utama/).fill("a@b.co");
await page.getByRole("button", { name: /^Lanjut/ }).click();
check("step 2", (await page.locator("h1").innerText()).includes("Your Contribution"));

// step 2: checkbox cap of two
await page.getByLabel("Riset pasar / pelanggan").check();
await page.getByLabel("Analisis data").check();
check("third area disabled", await page.getByLabel("Pemasaran").isDisabled());
await page.getByRole("button", { name: /^Lanjut/ }).click();
check("step 2 required errors", (await page.getByRole("alert").count()) >= 3);
await page.getByLabel(/Apa yang membuatmu/).fill("Saya ingin belajar dan berkontribusi.");
await page.getByLabel("GrowthCamp").first().check();
await page.getByLabel(/Jelaskan bekal pembelajaran/).fill("Mata kuliah terkait.");
await page.getByLabel(/Bidang pertama/).fill("Bisa riset sendiri.");
await page.getByLabel(/Bidang kedua/).fill("Perlu bantuan analisis.");
await page.getByRole("button", { name: /^Lanjut/ }).click();
check("step 3", (await page.locator("h1").innerText()).includes("Show Your Experience"));

await page.getByLabel(/Ceritakan satu tugas/).fill("Proyek kuliah X.");
await page.getByLabel(/Alat apa/).fill("Spreadsheet.");
await page.getByLabel(/pendapatmu berbeda/).fill("Kami berdiskusi.");
await page.getByLabel(/data klien belum cukup/).fill("Saya minta data tambahan.");
await page.getByRole("button", { name: /^Lanjut/ }).click();
check("step 4", (await page.locator("h1").innerText()).includes("Commitment"));

// leave a required field empty -> review should warn and block finishing
await page.getByLabel(/Rentang waktu/).fill("3 jam");
await page.getByLabel(/Hari \/ waktu/).fill("Sabtu");
await page.getByLabel(/Komitmen yang berpotensi/).fill("Tidak ada");
await page.getByLabel(/Jenis usaha/).fill("Kuliner");
await page.getByRole("button", { name: "Tinjau Jawaban" }).click();
check("consent required", (await page.locator("h1").innerText()).includes("Commitment"));
await page.getByLabel(/Saya memahami bahwa/).check();
await page.getByRole("button", { name: "Tinjau Jawaban" }).click();
check("review step", (await page.locator("h1").innerText()).includes("Review Your Answers"));
check("no incomplete warning", (await page.getByText("Jawaban belum lengkap").count()) === 0);
check("review shows filled", (await page.getByText("GX-01 Motivasi: terisi.").count()) === 1);

// go back, clear a required answer, expect warning + disabled finish
await page.getByRole("button", { name: /Ubah jawaban Kontribusi/ }).click();
await page.getByLabel(/Apa yang membuatmu/).fill("");
await page.getByRole("button", { name: /^Lanjut/ }).click();
check("blocked on cleared answer", (await page.getByRole("alert").count()) >= 1);
await page.getByLabel(/Apa yang membuatmu/).fill("Lagi.");
await page.getByRole("button", { name: /^Lanjut/ }).click();
await page.getByRole("button", { name: /^Lanjut/ }).click();
await page.getByRole("button", { name: "Tinjau Jawaban" }).click();
await page.getByRole("button", { name: "Selesaikan Simulasi" }).click();
check("done screen", (await page.locator("h1").innerText()).includes("Simulasi Selesai"));
check("no console errors", errors.length === 0);
if (errors.length) console.log(errors);
await browser.close();
