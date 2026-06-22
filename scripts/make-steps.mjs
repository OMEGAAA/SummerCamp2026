// 予約手順セクション用に、スマホのスクショをWeb用へ最適化（幅560pxにリサイズしてJPEG化）。
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const JOBS = [
  { src: "C:/Users/81806/Downloads/A58DB100-7248-4703-A2E2-A0A71235531A.jpeg", out: "src/assets/reserve-step1.jpg" },
  { src: "C:/Users/81806/Downloads/IMG_5958.png", out: "src/assets/reserve-step2.jpg" },
  { src: "C:/Users/81806/Downloads/IMG_5959.png", out: "src/assets/reserve-step3.jpg" },
  { src: "C:/Users/81806/Downloads/IMG_5960.png", out: "src/assets/reserve-step4.jpg" },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const job of JOBS) {
  const b64 = readFileSync(job.src).toString("base64");
  const mime = job.src.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
  const dataUrl = await page.evaluate(async ({ b64, mime }) => {
    const res = await fetch(`data:${mime};base64,${b64}`);
    const blob = await res.blob();
    const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
    const maxW = 560;
    const scale = Math.min(1, maxW / bmp.width);
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.82);
  }, { b64, mime });
  const out = Buffer.from(dataUrl.split(",")[1], "base64");
  writeFileSync(job.out, out);
  console.log("wrote", job.out, (out.length / 1024 | 0) + "KB");
}

await browser.close();
