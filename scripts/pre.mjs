// Restore the source-entry index.html before a vite build.
// The deliverable index.html (built, single-file) doubles as vite's build entry,
// so we overwrite it with the real source entry first, then build from src/.
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

copyFileSync(resolve("scripts/entry.html"), resolve("index.html"));
console.log("source entry restored to index.html");
