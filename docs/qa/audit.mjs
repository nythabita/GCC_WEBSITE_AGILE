// Vertical position audit: compares y of text blocks on our page with the Figma <name>.txt dump.
// Usage: node audit.mjs <url> <design.txt> [width=392]
// Prints one row per matched block: design y, our y, delta; and a summary.
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

const [, , url, txt, w = "392"] = process.argv;
const lines = readFileSync(txt, "utf8").split(/\r?\n/).map((l) => l.match(/^\s*(\d+) x\s*\d+\s+[\d.]+ (.*)$/)).filter(Boolean).map((m) => ({ y: +m[1], t: m[2].trim() }));
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: +w, height: 844 } })).newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const words = await page.evaluate(() => {
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode;
    const re = /\S+/g;
    let m;
    while ((m = re.exec(n.textContent))) {
      const r = document.createRange();
      r.setStart(n, m.index);
      r.setEnd(n, m.index + m[0].length);
      const b = r.getBoundingClientRect();
      out.push({ w: m[0], y: Math.round(b.top + scrollY) });
    }
  }
  return out;
});
await browser.close();
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const flat = words.map((x) => ({ k: norm(x.w), y: x.y }));
let cursor = 0;
let n = 0, sum = 0, worst = 0;
for (const l of lines) {
  const ws = l.t.split(/\s+/).map(norm).filter(Boolean).slice(0, 3);
  if (ws.join("").length < 6) continue;
  let hit = -1;
  for (let i = cursor; i < Math.min(flat.length - ws.length, cursor + 120); i++) {
    if (ws.every((w, j) => flat[i + j].k === w)) { hit = i; break; }
  }
  if (hit < 0) { console.log(`${String(l.y).padStart(5)}  --   MISSING  ${l.t.slice(0, 40)}`); continue; }
  cursor = hit + 1;
  const d = flat[hit].y - l.y;
  n++; sum += d; worst = Math.max(worst, Math.abs(d));
  console.log(`${String(l.y).padStart(5)} ${String(flat[hit].y).padStart(5)} ${String(d).padStart(5)}  ${l.t.slice(0, 40)}`);
}
console.log(`matched ${n}, mean delta ${(sum / Math.max(n, 1)).toFixed(1)}, worst ${worst}`);
