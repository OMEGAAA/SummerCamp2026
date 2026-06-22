import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CaretRight,
  CheckCircle,
  Clock,
  Funnel,
  Lightning,
  MapPin,
  Medal,
  PersonSimpleRun,
  Question,
  SealCheck,
  SlidersHorizontal,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react";
import heroSrc from "./assets/training-hero.jpg";
import footerSrc from "./assets/training-footer.jpg";
import step1Src from "./assets/reserve-step1.jpg";
import step2Src from "./assets/reserve-step2.jpg";
import step3Src from "./assets/reserve-step3.jpg";
import step4Src from "./assets/reserve-step4.jpg";
import {
  days,
  timeRows,
  weeks,
  levelMark,
  makeSlot,
  slotStatus,
  statusText,
  classLabel,
} from "./scheduleData.js";

const classTypes = [
  { id: "agility", label: "アジリティ", target: "小学生", tone: "blue", icon: Lightning },
  { id: "run", label: "走り方", target: "小学生", tone: "green", icon: PersonSimpleRun },
  { id: "junior", label: "中学生クラス", target: "中学生", tone: "violet", icon: Medal },
];

const initialSelected = makeSlot(18, "tue", "pm");

// 申し込みは外部の予約サイト(hacomono)へ遷移する。
const RESERVE_URL = "https://center-agk-sp-science.hacomono.jp/home";

// 予約サイトでの申し込み手順（スクリーンショット付き）。
const reserveSteps = [
  {
    num: 1,
    img: step1Src,
    title: "ログインして「予約」を開く",
    text: "予約サイトにログイン（未登録の方は会員登録）し、メニューから「予約」を選びます。",
  },
  {
    num: 2,
    img: step2Src,
    title: "アローズエリアを選ぶ",
    text: "エリアで「アローズエリア」を選び、希望の日付・時間のレッスンを選択します。",
  },
  {
    num: 3,
    img: step3Src,
    title: "内容を確認して進む",
    text: "レッスン内容と空き状況を確認し、「チケットを購入して予約する」へ進みます。",
  },
  {
    num: 4,
    img: step4Src,
    title: "チケット購入で予約完了",
    text: "チケットを選び、支払い方法を選択して予約を確定します。",
  },
];

export function App() {
  const [activeType, setActiveType] = useState("run");
  const [selectedSlot, setSelectedSlot] = useState(initialSelected);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState("faq-1");

  const selectedType = classTypes.find((type) => type.id === activeType);
  const filteredSlots = useMemo(() => {
    const slots = [];
    weeks.forEach((week) => {
      days.forEach((day) => {
        timeRows.forEach((row) => {
          const slot = makeSlot(week.dates[day.key], day.key, row.key);
          if (!slot) return;
          if (activeType !== slot.type) return;
          if (gradeFilter !== "all" && slot.target !== gradeFilter) return;
          slots.push(slot);
        });
      });
    });
    return slots;
  }, [activeType, gradeFilter]);

  const lowCount = filteredSlots.filter((slot) => slot.remaining <= 3).length;
  const openCount = filteredSlots.filter((slot) => slot.remaining >= 6).length;

  function chooseType(typeId) {
    setActiveType(typeId);
    const next = filteredFirstSlot(typeId, gradeFilter);
    if (next) setSelectedSlot(next);
  }

  function filteredFirstSlot(typeId, grade) {
    for (const week of weeks) {
      for (const day of days) {
        for (const row of timeRows) {
          const slot = makeSlot(week.dates[day.key], day.key, row.key);
          if (!slot || slot.type !== typeId) continue;
          if (grade !== "all" && slot.target !== grade) continue;
          return slot;
        }
      }
    }
    return null;
  }

  function applyNow() {
    window.open(RESERVE_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="エイジェックスポーツ科学総合センター トップ">
          <span className="brand-name">エイジェックスポーツ科学総合センター</span>
        </a>
        <nav className="nav-links" aria-label="主要ナビゲーション">
          <a href="#features"><Sparkle size={18} weight="fill" />特徴</a>
          <a href="#booking"><CalendarCheck size={18} weight="fill" />クラス選択</a>
          <a href="#price"><SlidersHorizontal size={18} weight="fill" />料金</a>
          <a href="#faq"><Question size={18} weight="fill" />FAQ</a>
        </nav>
        <button className="deadline-button" onClick={applyNow}>
          <CalendarCheck size={24} weight="fill" />
          <span><strong>各回３日前締切</strong><small>お早めにお申し込みください</small></span>
        </button>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-copy">
          <p className="season-badge">8月限定 <span>2026年</span></p>
          <h1>夏期講習</h1>
          <p className="hero-lead">走り方・アジリティ特化</p>
          <p className="hero-target">小学生・中学生対象</p>
          <div className="hero-meta">
            <span><CalendarCheck size={21} weight="fill" />8月1日(土) - 8月31日(月)</span>
            <span><MapPin size={21} weight="fill" />エイジェックスポーツ科学総合センター</span>
          </div>
          <div className="hero-actions">
            <a className="primary-cta" href="#booking">空き状況を確認<CaretRight size={22} weight="bold" /></a>
            <button className="ghost-cta" onClick={applyNow}>予約サイトで申し込み</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img src={heroSrc} alt="" />
          <div className="capacity-badge"><span>各クラス</span><strong>10</strong><span>名限定</span></div>
        </div>
      </section>

      <section id="features" className="feature-strip" aria-label="講習の特徴">
        <Feature icon={PersonSimpleRun} title="走り方が速くなる" text="正しいフォームと加速力を身につける" />
        <Feature icon={Lightning} title="アジリティUP" text="素早い動き・切り返しで運動能力を向上" />
        <Feature icon={CalendarCheck} title="短期集中プログラム" text="平日を中心に通いやすい4週間" />
        <Feature icon={UsersThree} title="少人数制で安心" text="各クラス10名限定の細やかな指導" />
      </section>

      <section id="booking" className="booking-section">
        <div className="section-heading">
          <p>STEP 1</p>
          <h2>クラスを選んで空き状況を確認・予約</h2>
        </div>

        <div className="class-tabs" role="tablist" aria-label="クラス種別">
          {classTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                className={`class-tab ${type.tone} ${activeType === type.id ? "active" : ""}`}
                onClick={() => chooseType(type.id)}
                role="tab"
                aria-selected={activeType === type.id}
              >
                <Icon size={24} weight="fill" />
                <span>{type.label}</span>
                <small>{type.target}</small>
              </button>
            );
          })}
        </div>

        <div className="booking-tools">
          <div className="filter-group" aria-label="対象フィルター">
            <Funnel size={19} weight="fill" />
            {["all", "小学生", "中学生"].map((grade) => (
              <button
                key={grade}
                className={gradeFilter === grade ? "selected" : ""}
                onClick={() => {
                  setGradeFilter(grade);
                  const next = filteredFirstSlot(activeType, grade);
                  if (next) setSelectedSlot(next);
                }}
              >
                {grade === "all" ? "全対象" : grade}
              </button>
            ))}
          </div>
          <div className="legend" aria-label="空き状況凡例">
            <span className="legend-open">空きあり</span>
            <span className="legend-low">残りわずか</span>
            <span className="legend-off">休講</span>
          </div>
        </div>

        <div className="booking-grid">
          <div className="schedule-board" aria-label={`${selectedType.label}スケジュール`}>
            <div className="calendar-head">
              <span>時間</span>
              {days.map((day) => <span key={day.key}>{day.label}</span>)}
            </div>
            {weeks.map((week) => (
              <div className={`week-block ${week.break ? "break-week" : ""}`} key={week.label}>
                <div className="week-label">
                  <strong>{week.label}</strong>
                  <small>{week.range}</small>
                </div>
                {week.break ? (
                  <div className="obon-row">お盆休み</div>
                ) : (
                  <div className="time-grid">
                    {timeRows.map((row) => (
                      <div className="time-line" key={row.key}>
                        <div className="time-cell">
                          <strong>{row.label}</strong>
                          <small>{row.target}</small>
                        </div>
                        {days.map((day) => {
                          const date = week.dates[day.key];
                          const slot = makeSlot(date, day.key, row.key);
                          const visible = slot && slot.type === activeType && (gradeFilter === "all" || slot.target === gradeFilter);
                          const status = slotStatus(slot);
                          const isSelected = visible && selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={`${week.label}-${row.key}-${day.key}`}
                              className={`slot-cell ${visible ? status : "empty"} ${isSelected ? "chosen" : ""}`}
                              disabled={!visible || status === "full"}
                              onClick={() => setSelectedSlot(slot)}
                              aria-label={visible ? `${date}日 ${row.label} ${classLabel(slot)} ${statusText(slot)}` : `${date || ""} 予約枠なし`}
                            >
                              <span className="date">{date ? `8/${date}` : ""}</span>
                              {visible && slot.level ? <span className="lvl">{levelMark(slot.level)}</span> : null}
                              {visible ? <strong>{statusText(slot)}</strong> : <span className="dash">-</span>}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <p className="schedule-note">定員に達し次第、受付を終了いたします。アジリティは月・水、走り方は火・木（4週目のみ金）に開催。①②③はレベル（進度）の目安、中学生15:00クラスの月曜アジリティは室内練習場を使用します。</p>
          </div>

          <aside className="selection-panel" aria-live="polite">
            <p className="panel-kicker">選択中のクラス</p>
            <div className="selected-title">
              {selectedSlot?.activity === "run" ? <PersonSimpleRun size={34} weight="fill" /> : <Lightning size={34} weight="fill" />}
              <h3>{classLabel(selectedSlot)}</h3>
            </div>
            <dl className="selected-details">
              <div><dt>日程</dt><dd>8月{selectedSlot.date}日（{days.find((day) => day.key === selectedSlot.dayKey)?.label}）</dd></div>
              <div><dt>時間</dt><dd>{selectedSlot.time}</dd></div>
              <div><dt>対象</dt><dd>{selectedSlot.target}</dd></div>
              {selectedSlot.room ? <div><dt>会場</dt><dd>室内練習場</dd></div> : null}
              <div><dt>定員</dt><dd>10名</dd></div>
            </dl>
            <div className="seat-meter">
              <span>残り人数</span>
              <div className="meter-rail"><i style={{ width: `${selectedSlot.remaining * 10}%` }} /></div>
              <strong>{selectedSlot.remaining}名</strong>
              <small>{selectedSlot.remaining <= 3 ? "残りわずか" : "空きあり"}</small>
            </div>
            <button className="panel-cta" onClick={applyNow}>このクラスを選択する<CaretRight size={22} weight="bold" /></button>
            <div className="panel-note">
              <strong>選択のポイント</strong>
              <p>フォーム改善と加速力、または切り返し能力を目的に合わせて選べます。</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="reserve-steps" className="steps-section">
        <div className="section-heading">
          <p>HOW TO RESERVE</p>
          <h2>予約サイトでの申し込み手順</h2>
        </div>
        <div className="steps-grid">
          {reserveSteps.map((step) => (
            <article className="step-card" key={step.num}>
              <div className="step-shot">
                <span className="step-num">{step.num}</span>
                <img src={step.img} alt={`手順${step.num}：${step.title}`} loading="lazy" />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="steps-cta">
          <button className="primary-cta" onClick={applyNow}>予約サイトを開く<CaretRight size={22} weight="bold" /></button>
          <small>※ ご予約には予約サイト（hacomono）の会員登録・チケット購入が必要です。</small>
        </div>
      </section>

      <section className="reason-section">
        <div className="section-heading">
          <p>WHY US</p>
          <h2>エイジェックスポーツ科学総合センターの夏期講習が選ばれる理由</h2>
        </div>
        <div className="reason-grid">
          <Reason icon={Medal} title="専門コーチの指導" text="走り方・アジリティの専門コーチが一人ひとりを丁寧に指導。" />
          <Reason icon={SealCheck} title="基礎から実践まで" text="正しい姿勢づくりから、競技につながる動きまで段階的に習得。" />
          <Reason icon={UsersThree} title="少人数制" text="各クラス10名限定。初めてでも参加しやすい密度でサポート。" />
          <Reason icon={CheckCircle} title="短期集中" text="8月限定の集中トレーニングで、夏休みに成果を実感。" />
        </div>
      </section>

      <section id="price" className="price-section">
        <div className="price-copy">
          <p>料金（税込）</p>
          <h2>1回ごとに参加しやすい料金設定</h2>
          <ul>
            <li><CheckCircle size={20} weight="fill" />各クラス10名限定</li>
            <li><CheckCircle size={20} weight="fill" />お支払いは当日現金払い</li>
            <li><CheckCircle size={20} weight="fill" />キャンセルは前日までにご連絡ください</li>
          </ul>
        </div>
        <div className="price-cards">
          <article>
            <span>ビジター</span>
            <strong>2,200<small>円（税込）/ 　1回</small></strong>
          </article>
          <article className="member">
            <span>ジム会員</span>
            <strong>1,500<small>円（税込）/ 　1回</small></strong>
          </article>
        </div>
        <img className="price-image" src={footerSrc} alt="トレーニング中の選手" />
      </section>

      <section id="faq" className="faq-section">
        <div className="section-heading">
          <p>FAQ</p>
          <h2>よくある質問</h2>
        </div>
        <div className="faq-list">
          {[
            ["faq-1", "申し込み方法を教えてください", "予約サイトからお申し込みください。各申し込みボタンから予約サイト（hacomono）に移動できます。"],
            ["faq-2", "小学生と中学生で時間は違いますか？", "小学生は10:00-11:00または13:30-14:30、中学生は15:00-16:00です。"],
            ["faq-3", "定員は何名ですか？", "各クラス10名です。定員に達し次第、受付終了となります。"],
          ].map(([id, question, answer]) => (
            <article className={`faq-item ${openFaq === id ? "open" : ""}`} key={id}>
              <button onClick={() => setOpenFaq(openFaq === id ? "" : id)}>
                <span>{question}</span>
                <CaretRight size={20} weight="bold" />
              </button>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <CalendarCheck size={58} weight="fill" />
        <div>
          <h2>予約サイトで申し込み</h2>
          <p>クラスを選んで、空き状況を確認してからお申し込みください。</p>
        </div>
        <button onClick={applyNow}>申し込みへ進む<CaretRight size={22} weight="bold" /></button>
        <strong>各回3日前締切</strong>
      </section>

      <footer className="site-footer">
        <span className="footer-name">エイジェックスポーツ科学総合センター</span>
        <span>夏休み期間限定 夏期講習</span>
        <a href="#faq">よくある質問</a>
        <button onClick={applyNow}>お問い合わせ</button>
      </footer>
    </main>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <article className="feature-item">
      <Icon size={38} weight="fill" />
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function Reason({ icon: Icon, title, text }) {
  return (
    <article className="reason-item">
      <Icon size={42} weight="fill" />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
