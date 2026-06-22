import { useEffect, useMemo, useRef, useState } from "react";
import {
  days,
  timeRows,
  weeks,
  schedule as defaultSchedule,
  levelMark,
  buildSlot,
  slotStatus,
} from "./scheduleData.js";
// scheduleData.js の元ソース（ビルド時に文字列として取り込む）。
// 編集後の schedule で差し替えて、ファイルごとダウンロードできるようにする。
import scheduleDataSource from "./scheduleData.js?raw";

// 簡易パスコード（クライアント側のみのゲート。強固な認証ではありません）。
// 変更する場合はこの値を書き換えて再ビルドしてください。
const ADMIN_PASSCODE = "arrows2026";
const DRAFT_KEY = "arrows-admin-schedule-draft";
const SESSION_KEY = "arrows-admin-authed";
const ROW_KEYS = ["am", "pm", "jr"];

const clone = (obj) => JSON.parse(JSON.stringify(obj));

function activityLabel(activity) {
  return activity === "run" ? "走り方" : "アジリティ";
}

function statusLabel(entry) {
  if (!entry) return "";
  if (entry.closed) return "休講";
  const slot = { remaining: entry.seats };
  const s = slotStatus(slot);
  if (s === "full") return "満員";
  if (s === "low") return `残り${entry.seats}名`;
  return `空き${entry.seats}名`;
}

// 編集中データから、scheduleData.js に貼り付けられるコードを生成する。
function generateCode(data) {
  const lines = ["export const schedule = {"];
  Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((date) => {
      lines.push(`  ${date}: {`);
      ROW_KEYS.forEach((rk) => {
        const e = data[date] && data[date][rk];
        if (!e) return;
        const parts = [
          `activity: "${e.activity}"`,
          `level: ${e.level}`,
          `seats: ${e.seats}`,
        ];
        if (e.room) parts.push("room: true");
        if (e.closed) parts.push("closed: true");
        lines.push(`    ${rk}: { ${parts.join(", ")} },`);
      });
      lines.push("  },");
    });
  lines.push("};");
  return lines.join("\n");
}

// scheduleData.js の元ソースの schedule ブロック（マーカー間）を、生成コードで差し替える。
function buildScheduleDataFile(code) {
  const re = /(\/\/ ▼▼▼.*\r?\n)[\s\S]*?(\r?\n\/\/ ▲▲▲.*)/;
  if (!re.test(scheduleDataSource)) return null;
  return scheduleDataSource.replace(re, (_m, start, end) => start + code + end);
}

export function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [pass, setPass] = useState("");
  const [authErr, setAuthErr] = useState("");

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore */
    }
    return clone(defaultSchedule);
  });
  const [note, setNote] = useState("");
  const codeRef = useRef(null);

  const code = useMemo(() => generateCode(data), [data]);
  const fullFile = useMemo(() => buildScheduleDataFile(code), [code]);

  const dirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(defaultSchedule),
    [data],
  );

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(""), 2600);
    return () => clearTimeout(t);
  }, [note]);

  function login(e) {
    e.preventDefault();
    if (pass === ADMIN_PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setAuthErr("");
    } else {
      setAuthErr("パスコードが違います。");
    }
  }

  function updateEntry(date, rowKey, patch) {
    setData((prev) => {
      const next = clone(prev);
      if (next[date] && next[date][rowKey]) {
        Object.assign(next[date][rowKey], patch);
      }
      return next;
    });
  }

  function setSeats(date, rowKey, raw) {
    let v = parseInt(raw, 10);
    if (Number.isNaN(v)) v = 0;
    v = Math.max(0, Math.min(10, v));
    updateEntry(date, rowKey, { seats: v });
  }

  function saveDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    setNote("下書きをこのブラウザに保存しました。");
  }

  function resetDefaults() {
    setData(clone(defaultSchedule));
    localStorage.removeItem(DRAFT_KEY);
    setNote("確定済みの内容に戻しました。");
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setNote("コードをコピーしました。src/scheduleData.js に貼り付けて再ビルドしてください。");
      return;
    } catch {
      /* file:// などではクリップボードAPIが使えないためフォールバック */
    }
    if (codeRef.current) {
      codeRef.current.select();
      try {
        document.execCommand("copy");
        setNote("コードをコピーしました。src/scheduleData.js に貼り付けて再ビルドしてください。");
        return;
      } catch {
        /* ignore */
      }
    }
    setNote("自動コピーできませんでした。下のコードを手動で全選択してコピーしてください。");
  }

  function downloadFile(name, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <main className="admin-shell">
        <form className="admin-login" onSubmit={login}>
          <h1>管理ページ</h1>
          <p>空き状況を編集するにはパスコードを入力してください。</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="パスコード"
            autoFocus
          />
          {authErr && <span className="admin-error">{authErr}</span>}
          <button type="submit">ログイン</button>
          <a className="admin-back" href="#">← LPに戻る</a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-head">
        <div>
          <h1>空き状況の編集</h1>
          <p>残席を変更して「scheduleData.js をダウンロード」→ ダウンロードしたファイルで <code>src/scheduleData.js</code> を丸ごと置き換え → 再ビルドで公開LPに反映されます。</p>
        </div>
        <div className="admin-head-actions">
          <a className="admin-back" href="#">LPを開く ↗</a>
          <button
            className="ghost"
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setAuthed(false);
            }}
          >
            ログアウト
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        <button onClick={saveDraft}>下書き保存（このブラウザ）</button>
        <button
          onClick={() => downloadFile("scheduleData.js", fullFile || code)}
          className="primary"
        >
          scheduleData.js をダウンロード
        </button>
        <button onClick={copyCode}>コードをコピー</button>
        <button onClick={() => downloadFile("schedule.json", JSON.stringify(data, null, 2))}>JSON をダウンロード</button>
        <button onClick={resetDefaults} className="ghost">確定済みに戻す</button>
        {dirty && <span className="admin-dirty">未反映の変更があります</span>}
      </div>

      {note && <div className="admin-note">{note}</div>}

      <div className="admin-weeks">
        {weeks.map((week) => {
          const hasSlots = !week.break && Object.values(week.dates).some(
            (d) => d && data[d] && ROW_KEYS.some((rk) => data[d][rk]),
          );
          if (!hasSlots) return null;
          return (
            <section className="admin-week" key={week.label}>
              <h2>
                {week.label} <small>{week.range}</small>
              </h2>
              <div className="admin-grid">
                <div className="admin-grid-head">
                  <span>時間</span>
                  {days.map((day) => <span key={day.key}>{day.label}</span>)}
                </div>
                {timeRows.map((row) => (
                  <div className="admin-grid-row" key={row.key}>
                    <span className="admin-time">
                      {row.label}
                      <small>{row.target}</small>
                    </span>
                    {days.map((day) => {
                      const date = week.dates[day.key];
                      const entry = date && data[date] && data[date][row.key];
                      if (!entry) {
                        return <span className="admin-cell empty" key={day.key}>–</span>;
                      }
                      const status = entry.closed ? "off" : slotStatus({ remaining: entry.seats });
                      return (
                        <div className={`admin-cell ${status}`} key={day.key}>
                          <span className="admin-cell-date">8/{date}</span>
                          <span className="admin-cell-label">
                            {activityLabel(entry.activity)}{levelMark(entry.level)}
                            {entry.room ? " 🏠" : ""}
                          </span>
                          <div className="admin-cell-edit">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={entry.seats}
                              disabled={entry.closed}
                              onChange={(e) => setSeats(date, row.key, e.target.value)}
                              aria-label={`8月${date}日 ${row.label} 残席`}
                            />
                            <span className="admin-unit">名</span>
                          </div>
                          <label className="admin-closed">
                            <input
                              type="checkbox"
                              checked={!!entry.closed}
                              onChange={(e) => updateEntry(date, row.key, { closed: e.target.checked })}
                            />
                            休講
                          </label>
                          <span className="admin-status">{statusLabel(entry)}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="admin-code">
        <h2>生成コード（src/scheduleData.js に貼り付け）</h2>
        <textarea ref={codeRef} readOnly value={code} spellCheck="false" />
      </section>

      <p className="admin-foot">
        ※ このパスコードはクライアント側の簡易ガードです。公開LPの空き状況は、上記コードを反映して再ビルドした時点で更新されます。
      </p>
    </main>
  );
}
