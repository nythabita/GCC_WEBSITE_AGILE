// Smoke-test every route at 320/390/1280px: horizontal overflow, exactly one <h1>, console errors.
// Usage: node routes.mjs [baseUrl=http://localhost:5173]  (edit ROUTES when pages are added)
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:5173";
const ROUTES = [
  "/", "/discover", "/about", "/assessment", "/pilih-program", "/programs",
  "/learn", "/learn/growthcamp", "/apply", "/apply/growthx", "/apply/growthx/form", "/apply/growthconnect",
  "/grow", "/login", "/xyz",
];

const browser = await chromium.launch();
let problems = 0;
for (const width of [320, 390, 1280]) {
  const page = await (await browser.newContext({ viewport: { width, height: 800 } })).newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  for (const route of ROUTES) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    const m = await page.evaluate(() => ({
      path: location.pathname,
      h1: document.querySelectorAll("h1").length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    if (m.overflow > 0 || m.h1 !== 1) { problems++; console.log("!!", width, route, JSON.stringify(m)); }
    if (width === 390) console.log(route.padEnd(24), "->", m.path);
  }
  if (errors.length) { problems++; console.log("console errors @", width, [...new Set(errors)].slice(0, 5)); }
}
console.log(problems ? `${problems} problem(s)` : "all routes OK");
await browser.close();
