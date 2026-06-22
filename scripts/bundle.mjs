// Post-build: turn the vite output (external JS/CSS, images referenced relative
// to the JS) into the standalone deliverable used by this repo — a single
// index.html with the CSS and JS inlined and images loaded from a sibling
// `assets/` folder. Produces the standalone file at both the repo root and dist/.
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  copyFileSync,
  rmSync,
  mkdirSync,
} from "node:fs";
import { resolve } from "node:path";

const root = resolve(".");
const dist = resolve("dist");
const distAssets = resolve("dist/assets");
const rootAssets = resolve("assets");

const imageExt = /\.(jpe?g|png|webp|svg|gif|avif)$/i;
const assetFiles = readdirSync(distAssets);
const imageFiles = assetFiles.filter((f) => imageExt.test(f));
const jsFile = assetFiles.find((f) => f.endsWith(".js"));
const cssFile = assetFiles.find((f) => f.endsWith(".css"));

let js = readFileSync(resolve(distAssets, jsFile), "utf8");
// vite (base "./") references images as bare filenames relative to the JS file.
// Re-point them at the `assets/` folder so they resolve relative to index.html.
for (const img of imageFiles) {
  js = js.split(`new URL("${img}"`).join(`new URL("assets/${img}"`);
}

let html = readFileSync(resolve(dist, "index.html"), "utf8");

// Inline the stylesheet (<link rel="stylesheet" href="./assets/xxx.css">).
if (cssFile) {
  const css = readFileSync(resolve(distAssets, cssFile), "utf8");
  html = html.replace(
    /<link rel="stylesheet"[^>]*href="\.\/assets\/[^"]+\.css"[^>]*>/,
    () => `<style>\n${css}\n</style>`,
  );
}

// Inline the module script (<script type="module" ... src="./assets/xxx.js">).
html = html.replace(
  /<script type="module"[^>]*src="\.\/assets\/[^"]+\.js"><\/script>/,
  () => `<script type="module">\n${js}\n</script>`,
);

// Write the standalone HTML to root and dist.
writeFileSync(resolve(root, "index.html"), html);
writeFileSync(resolve(dist, "index.html"), html);

// Sync images into root/assets (replace stale files). The folder may not exist
// yet on a fresh checkout (it is a build output), so create it first.
mkdirSync(rootAssets, { recursive: true });
for (const f of readdirSync(rootAssets)) {
  rmSync(resolve(rootAssets, f));
}
for (const img of imageFiles) {
  copyFileSync(resolve(distAssets, img), resolve(rootAssets, img));
}
// The inlined JS/CSS are no longer needed as separate files in dist/assets.
rmSync(resolve(distAssets, jsFile));
if (cssFile) rmSync(resolve(distAssets, cssFile));

console.log("standalone bundle written. images:", imageFiles.join(", "));
