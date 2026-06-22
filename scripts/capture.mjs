import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const outDir = resolve("qa-screenshots");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1821 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
await page.screenshot({ path: resolve(outDir, "desktop-full.png"), fullPage: true });

await page.locator(".class-tab.violet").click();
await page.locator(".panel-cta").click();
await page.screenshot({ path: resolve(outDir, "desktop-modal.png"), fullPage: false });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
await mobile.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
await mobile.screenshot({ path: resolve(outDir, "mobile-top.png"), fullPage: false });

await browser.close();
console.log(`screenshots saved to ${outDir}`);
