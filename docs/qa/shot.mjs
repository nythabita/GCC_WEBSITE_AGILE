// Full-page screenshot via Playwright.
// Usage: node shot.mjs <url> <out.png> [width=390] [height=844] [deviceScaleFactor=1]
import { chromium } from "playwright-core";

const [, , url, out, w = "390", h = "844", scale = "1"] = process.argv;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +scale });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: out, fullPage: true });
console.log(out, await page.evaluate(() => `${document.documentElement.scrollWidth}x${document.documentElement.scrollHeight}`));
await browser.close();
