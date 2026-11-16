// Walkthrough of the demo login flow (/login): validation, code entry, Google and sign-up detours, resend, done -> home.
// Usage: node login-flow.mjs [baseUrl=http://localhost:5173]
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:5173";
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
let failed = 0;
const check = (name, ok) => { console.log(ok ? "ok  " : "FAIL", name); if (!ok) failed++; };
const h1 = async () => (await page.locator("h1").first().innerText()).trim();
const wait = () => page.waitForTimeout(1100); // splash is 900ms

await page.goto(`${base}/login`, { waitUntil: "networkidle" });
check("no site navbar/footer", (await page.locator("nav").count()) === 0 && (await page.locator("footer").count()) === 0);
check("sign in heading", (await h1()) === "Sign in to GCC");

// empty email -> error
const email = page.getByLabel("Email address");
await email.focus();
check("focus fills demo email", (await email.inputValue()) === "student@example.com");
await email.fill("");
await page.getByRole("button", { name: "Continue", exact: true }).click();
check("empty email error", (await page.getByText("Enter your email address to continue.").count()) === 1);
await email.click(); // empty field: the demo email is filled and selected, so typing replaces it
await page.keyboard.type("salah");
check("typing replaces demo email", (await email.inputValue()) === "salah");
await page.getByRole("button", { name: "Continue", exact: true }).click();
check("invalid email error", (await page.getByText("Enter a valid email address.").count()) === 1);

// valid -> verify
await email.fill("student@example.com");
await page.getByRole("button", { name: "Continue", exact: true }).click();
check("splash shown", (await page.getByRole("status").count()) >= 1);
await wait();
check("verify heading", (await h1()) === "Check your email");

// wrong code, then right code
await page.getByRole("button", { name: "Verify and continue" }).click();
check("wrong code error", (await page.getByRole("alert").count()) === 1);
await page.getByLabel("Digit 1").click();
await page.keyboard.type("123456");
check("digits auto-advance", (await page.getByLabel("Digit 6").inputValue()) === "6");

// resend detour
await page.getByRole("button", { name: "Resend code" }).click();
check("resend screen", (await h1()) === "Code ready to resend");
await page.getByRole("button", { name: "Back to verification" }).click();
check("back to verification", (await h1()) === "Check your email");
await page.getByLabel("Digit 1").click();
await page.keyboard.type("123456");
await page.getByRole("button", { name: "Verify and continue" }).click();
await wait();
check("signed in", (await h1()) === "You’re signed in");
await page.getByRole("button", { name: "Continue to homepage" }).click();
await wait();
check("lands on homepage", new URL(page.url()).pathname === "/");

// Google and sign-up detours
await page.goto(`${base}/login`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Continue with Google" }).click();
check("google screen", (await h1()) === "Continue with Google");
await page.getByRole("button", { name: "Back to sign in" }).click();
await page.getByRole("button", { name: "Sign up" }).click();
check("sign up screen", (await h1()) === "Create Your GCC Account");
await page.getByRole("button", { name: "Create Account" }).click();
await wait();
check("account created (demo)", (await h1()) === "You’re signed in");
check("no console errors", errors.length === 0);
if (errors.length) console.log(errors);
await browser.close();
process.exitCode = failed ? 1 : 0;
