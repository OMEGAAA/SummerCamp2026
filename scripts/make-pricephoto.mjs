// 料金セクション右の写真用に、縦長写真から人物の帯を切り出して横長バナー化する。
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "C:/Users/81806/Downloads/image.png";
const OUT = "src/assets/training-footer.jpg";

// 元画像 3024x4032。人物は上部に集中、下半分は芝生のみ。
// 人物の帯（上部）を切り出す。
const CROP = { sx: 0, sy: 980, sw: 3024, sh: 1560 }; // 人物の帯（頭〜足）約 1.94:1
const OUT_W = 1300;

const b64 = readFileSync(SRC).toString("base64");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const dataUrl = await page.evaluate(async ({ b64, CROP, OUT_W }) => {
  const res = await fetch("data:image/png;base64," + b64);
  const blob = await res.blob();
  const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
  const dw = OUT_W;
  const dh = Math.round((CROP.sh / CROP.sw) * OUT_W);
  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, CROP.sx, CROP.sy, CROP.sw, CROP.sh, 0, 0, dw, dh);
  return canvas.toDataURL("image/jpeg", 0.84);
}, { b64, CROP, OUT_W });

const out = Buffer.from(dataUrl.split(",")[1], "base64");
writeFileSync(OUT, out);
console.log("wrote", OUT, (out.length / 1024 | 0) + "KB");

await browser.close();
