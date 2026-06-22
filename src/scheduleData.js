// 夏期講習スケジュールの共通データ。LP（App）と管理ページ（Admin）の両方が参照する。
// 空き状況を変更したいときは、管理ページ(#admin)で編集 → 生成されたコードを
// この schedule にそのまま貼り替えて再ビルドしてください（npm run build）。

export const days = [
  { key: "sun", label: "日" },
  { key: "mon", label: "月" },
  { key: "tue", label: "火" },
  { key: "wed", label: "水" },
  { key: "thu", label: "木" },
  { key: "fri", label: "金" },
  { key: "sat", label: "土" },
];

export const timeRows = [
  { key: "am", label: "10:00-11:00", target: "小学生" },
  { key: "pm", label: "13:30-14:30", target: "小学生" },
  { key: "jr", label: "15:00-16:00", target: "中学生" },
];

export const weeks = [
  { label: "1週目", range: "8/1", dates: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: 1 } },
  { label: "2週目", range: "8/2-8/8", dates: { sun: 2, mon: 3, tue: 4, wed: 5, thu: 6, fri: 7, sat: 8 } },
  { label: "3週目", range: "8/9-8/15", dates: { sun: 9, mon: 10, tue: 11, wed: 12, thu: 13, fri: 14, sat: 15 }, break: true },
  { label: "4週目", range: "8/16-8/22", dates: { sun: 16, mon: 17, tue: 18, wed: 19, thu: 20, fri: 21, sat: 22 } },
  { label: "5週目", range: "8/23-8/29", dates: { sun: 23, mon: 24, tue: 25, wed: 26, thu: 27, fri: 28, sat: 29 } },
];

// 各開催日の枠。activity: agility=アジリティ / run=走り方、level=レベル(①②③)、
// room=室内練習場使用、seats=残席、closed=休講。jr 行は中学生クラス。
// ▼▼▼ ここから管理ページが生成するコードで置き換え可能 ▼▼▼
export const schedule = {
  3: {
    am: { activity: "agility", level: 1, seats: 10 },
    pm: { activity: "agility", level: 2, seats: 10 },
    jr: { activity: "agility", level: 1, seats: 10, room: true },
  },
  4: {
    am: { activity: "run", level: 1, seats: 10 },
    pm: { activity: "run", level: 2, seats: 10 },
    jr: { activity: "run", level: 1, seats: 10 },
  },
  5: {
    am: { activity: "agility", level: 2, seats: 10 },
    pm: { activity: "agility", level: 3, seats: 10 },
    jr: { activity: "agility", level: 2, seats: 10 },
  },
  6: {
    am: { activity: "run", level: 2, seats: 7 },
    pm: { activity: "run", level: 3, seats: 10 },
    jr: { activity: "run", level: 2, seats: 10 },
  },
  17: {
    am: { activity: "agility", level: 3, seats: 10 },
    pm: { activity: "agility", level: 1, seats: 10 },
    jr: { activity: "agility", level: 3, seats: 10, room: true },
  },
  18: {
    am: { activity: "run", level: 3, seats: 10 },
    pm: { activity: "run", level: 1, seats: 10 },
    jr: { activity: "run", level: 3, seats: 10 },
  },
  19: {
    am: { activity: "agility", level: 1, seats: 10 },
    pm: { activity: "agility", level: 2, seats: 10 },
    jr: { activity: "agility", level: 1, seats: 10 },
  },
  21: {
    am: { activity: "run", level: 1, seats: 10 },
    pm: { activity: "run", level: 2, seats: 10 },
    jr: { activity: "run", level: 1, seats: 10 },
  },
  24: {
    am: { activity: "agility", level: 1, seats: 10 },
    pm: { activity: "agility", level: 2, seats: 10 },
    jr: { activity: "agility", level: 1, seats: 10, room: true },
  },
  25: {
    am: { activity: "run", level: 1, seats: 10 },
    pm: { activity: "run", level: 2, seats: 10 },
    jr: { activity: "run", level: 1, seats: 10 },
  },
};
// ▲▲▲ ここまで ▲▲▲

const levelMarks = ["", "①", "②", "③", "④", "⑤"];

export function levelMark(level) {
  return levelMarks[level] || "";
}

// 任意の schedule オブジェクトから1枠を組み立てる（管理ページの編集中データにも使える）。
export function buildSlot(scheduleObj, date, dayKey, rowKey) {
  const entry = date && scheduleObj[date] && scheduleObj[date][rowKey];
  if (!entry || entry.closed) return null;
  const isJunior = rowKey === "jr";
  return {
    id: `${date}-${rowKey}`,
    date,
    dayKey,
    rowKey,
    activity: entry.activity,
    level: entry.level,
    room: !!entry.room,
    type: isJunior ? "junior" : entry.activity,
    target: isJunior ? "中学生" : "小学生",
    time: timeRows.find((row) => row.key === rowKey).label,
    remaining: entry.seats,
  };
}

// 公開LP用：確定済みの schedule を使う。
export function makeSlot(date, dayKey, rowKey) {
  return buildSlot(schedule, date, dayKey, rowKey);
}

export function slotStatus(slot) {
  if (!slot) return "none";
  if (slot.remaining <= 0) return "full";
  if (slot.remaining <= 3) return "low";
  return "open";
}

export function statusText(slot) {
  const status = slotStatus(slot);
  if (status === "low") return `残り${slot.remaining}名`;
  if (status === "open") return `空き${slot.remaining}名`;
  if (status === "full") return "満員";
  return "-";
}

export function classLabel(slot) {
  if (!slot) return "";
  const base = slot.activity === "run" ? "走り方" : "アジリティ";
  const grade = slot.type === "junior" ? "（中学生）" : "（小学生）";
  return `${base}${levelMark(slot.level)}${grade}`;
}
