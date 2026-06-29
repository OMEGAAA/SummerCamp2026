import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { resolve } from "node:path";

const releaseDir = resolve("release");
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert(existsSync(releaseDir), "release フォルダーがありません");

const exeFiles = existsSync(releaseDir)
  ? readdirSync(releaseDir).filter((name) => name.toLowerCase().endsWith(".exe"))
  : [];
assert(exeFiles.length === 1, `ポータブルEXEは1件である必要があります（検出: ${exeFiles.length}件）`);

if (exeFiles.length === 1) {
  const exePath = resolve(releaseDir, exeFiles[0]);
  const size = statSync(exePath).size;
  const signature = readFileSync(exePath).subarray(0, 2).toString("ascii");
  assert(size > 50 * 1024 * 1024, "EXEのサイズが想定より小さく、パッケージが不完全な可能性があります");
  assert(signature === "MZ", "Windows実行ファイルのMZシグネチャを確認できません");
}

if (failures.length) {
  console.error("exe verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`exe verification passed: ${exeFiles[0]}`);
}
