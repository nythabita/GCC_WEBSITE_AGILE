// Generic form walkthrough: for each form route, (1) submit empty -> errors, (2) auto-fill every step, (3) review has no
// unfinished required items, (4) finish -> "Simulasi Selesai". Works for any config-driven ProgramForm.
// Usage: node form-fill.mjs [baseUrl=http://localhost:5173]
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:5173";
const ROUTES = ["/apply/growthx/form", "/apply/growthconnect/form", "/learn/growthcamp/form"];
const browser = await chromium.launch();
let failed = 0;
const check = (name, ok) => { console.log(ok ? "ok  " : "FAIL", name); if (!ok) failed++; };

for (const route of ROUTES) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(base + route, { waitUntil: "networkidle" });
  const steps = await page.locator("ol[class*='grid-cols-5'] li").count();

  await page.locator("form button[type=submit]").click();
  check(`${route} empty step 1 shows errors`, (await page.getByRole("alert").count()) >= 3);

  for (let step = 0; step < steps - 1; step++) {
    await page.evaluate(() => {
      const fire = (el) => { el.dispatchEvent(new Event("input", { bubbles: true })); };
      void fire;
    });
    // text inputs and textareas
    for (const el of await page.locator("form input[type=text]:not([disabled]), form textarea").all()) {
      const mode = await el.getAttribute("inputmode");
      await el.fill(mode === "email" ? "a@b.co" : mode === "url" ? "https://contoh.id" : "jawaban uji");
    }
    // checkbox groups: tick the first enabled option in every group with nothing ticked
    for (const group of await page.locator("form fieldset[data-field]").all()) {
      const boxes = group.locator("input[type=checkbox]");
      if ((await boxes.count()) && (await group.locator("input[type=checkbox]:checked").count()) === 0) await boxes.first().check();
    }
    // radio groups by name: tick the first option when none is ticked
    const names = await page.locator("form input[type=radio]").evaluateAll((els) => [...new Set(els.map((e) => e.name))]);
    for (const name of names) {
      const radios = page.locator(`form input[type=radio][name="${name}"]`);
      if ((await radios.locator("xpath=self::*[@checked]").count()) === 0 && !(await page.locator(`form input[type=radio][name="${name}"]:checked`).count())) await radios.first().check();
    }
    // consent checkbox outside a fieldset
    for (const box of await page.locator("form div[data-field] input[type=checkbox]").all()) if (!(await box.isChecked())) await box.check();
    await page.locator("form button[type=submit]").click();
  }
  check(`${route} reached review`, (await page.locator("h1").innerText()).toLowerCase().includes("review"));
  const unfinished = await page.locator("section li", { hasText: "belum diisi" }).allInnerTexts();
  check(`${route} review only lists optional items as empty`, unfinished.every((text) => text.includes("opsional")));
  check(`${route} no incomplete warning`, (await page.getByText("Jawaban belum lengkap").count()) === 0);
  await page.getByRole("button", { name: "Selesaikan Simulasi" }).click();
  check(`${route} done screen`, (await page.locator("h1").innerText()).includes("Simulasi Selesai"));
  check(`${route} no console errors`, errors.length === 0);
  if (errors.length) console.log(errors);
  await page.close();
}
await browser.close();
process.exitCode = failed ? 1 : 0;
