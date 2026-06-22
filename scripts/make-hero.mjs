import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "C:/Users/81806/Downloads/IMG_4886.jpeg";
const OUTS = [
  "src/assets/training-hero.jpg",
  "assets/training-hero-C-UB5uod.jpg",
  "dist/assets/training-hero-C-UB5uod.jpg",
];

const b64 = readFileSync(SRC).toString("base64");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const dataUrl = await page.evaluate(async (b64) => {
  const res = await fetch("data:image/jpeg;base64," + b64);
  const blob = await res.blob();
  // Respect EXIF orientation so the photo is upright.
  const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });

  // Target: portrait hero, capped at 1100px on the long edge.
  const maxLong = 1100;
  let { width: w, height: h } = bmp;
  const scale = Math.min(1, maxLong / Math.max(w, h));
  w = Math.round(w * scale);
  h = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}, b64);

const out = Buffer.from(dataUrl.split(",")[1], "base64");
for (const p of OUTS) {
  writeFileSync(p, out);
}
console.log("wrote", out.length, "bytes to", OUTS.length, "files");

await browser.close();
