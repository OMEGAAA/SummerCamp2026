import {
  existsSync,
  readFileSync,
} from "node:fs";
import { resolve } from "node:path";
import {
  buildSlot,
  days,
  schedule,
  slotStatus,
  statusText,
  timeRows,
  weeks,
} from "../src/scheduleData.js";

const root = resolve(".");
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const regularDates = new Set(
  weeks
    .filter((week) => !week.break)
    .flatMap((week) => days.map((day) => week.dates[day.key]))
    .filter(Boolean),
);
const breakDates = new Set(
  weeks
    .filter((week) => week.break)
    .flatMap((week) => days.map((day) => week.dates[day.key]))
    .filter(Boolean),
);
const rowKeys = new Set(timeRows.map((row) => row.key));

for (const [rawDate, entries] of Object.entries(schedule)) {
  const date = Number(rawDate);
  assert(Number.isInteger(date), `schedule の日付キーが整数ではありません: ${rawDate}`);
  assert(regularDates.has(date), `schedule の日付が通常週のカレンダー外です: 8/${rawDate}`);
  assert(!breakDates.has(date), `お盆休み週に開催枠があります: 8/${rawDate}`);
  assert(entries && typeof entries === "object", `8/${rawDate} の開催枠が不正です`);

  for (const [rowKey, entry] of Object.entries(entries || {})) {
    assert(rowKeys.has(rowKey), `8/${rawDate} に未知の時間帯があります: ${rowKey}`);
    assert(["run", "agility"].includes(entry.activity), `8/${rawDate} ${rowKey} の種目が不正です`);
    assert(Number.isInteger(entry.level) && entry.level >= 1 && entry.level <= 5, `8/${rawDate} ${rowKey} のレベルが不正です`);
    assert(Number.isInteger(entry.seats) && entry.seats >= 0 && entry.seats <= 10, `8/${rawDate} ${rowKey} の残席が0〜10の整数ではありません`);
    assert(entry.closed === undefined || typeof entry.closed === "boolean", `8/${rawDate} ${rowKey} の休講値が不正です`);
    assert(entry.room === undefined || typeof entry.room === "boolean", `8/${rawDate} ${rowKey} の会場値が不正です`);
  }
}

const closedSlot = buildSlot(
  { 3: { am: { activity: "agility", level: 1, seats: 10, closed: true } } },
  3,
  "mon",
  "am",
);
assert(closedSlot?.closed === true, "休講枠がLP用データから欠落します");
assert(slotStatus(closedSlot) === "off", "休講枠のステータスが off になりません");
assert(statusText(closedSlot) === "休講", "休講枠の表示文言が不正です");

const rootHtmlPath = resolve(root, "index.html");
const distHtmlPath = resolve(root, "dist/index.html");
assert(existsSync(rootHtmlPath), "ルートの index.html がありません");
assert(existsSync(distHtmlPath), "dist/index.html がありません");

if (existsSync(rootHtmlPath) && existsSync(distHtmlPath)) {
  const rootHtml = readFileSync(rootHtmlPath, "utf8");
  const distHtml = readFileSync(distHtmlPath, "utf8");

  assert(rootHtml === distHtml, "ルートと dist の index.html が一致しません");
  assert(rootHtml.includes("<style>"), "CSS が index.html に埋め込まれていません");
  assert(rootHtml.includes('<script type="module">'), "JavaScript が index.html に埋め込まれていません");
  assert(!/<script[^>]+src=["'][^"']+\.js/i.test(rootHtml), "外部JavaScript参照が残っています");
  assert(!/<link[^>]+href=["'][^"']+\.css/i.test(rootHtml), "外部CSS参照が残っています");
  assert(rootHtml.includes("https://center-agk-sp-science.hacomono.jp/home"), "予約サイトURLが納品物に含まれていません");
  assert(rootHtml.includes("エイジェックスポーツ科学総合センター"), "ブランド名が納品物に含まれていません");
  assert(!rootHtml.includes("Google Form"), "旧Google Form導線が納品物に残っています");

  const imageNames = [
    ...rootHtml.matchAll(/new URL\("assets\/([^"]+)"/g),
  ].map((match) => match[1]);
  assert(imageNames.length > 0, "画像参照を納品物から検出できません");
  for (const imageName of new Set(imageNames)) {
    assert(existsSync(resolve(root, "assets", imageName)), `ルート assets に画像がありません: ${imageName}`);
    assert(existsSync(resolve(root, "dist/assets", imageName)), `dist/assets に画像がありません: ${imageName}`);
  }
}

if (failures.length) {
  console.error("deliverable verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("deliverable verification passed");
}
