import { useState } from "react";
import {
  CalendarCheck,
  CaretRight,
  CheckCircle,
  Lightning,
  ListChecks,
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
import priceSrc from "./assets/price-training.jpg";
import reserveStep1 from "./assets/reserve-step1.jpg";
import reserveStep2 from "./assets/reserve-step2.jpg";
import reserveStep3 from "./assets/reserve-step3.jpg";
import reserveStep4 from "./assets/reserve-step4.jpg";
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

const RESERVATION_SITE_URL = "https://center-agk-sp-science.hacomono.jp/home";

const reserveSteps = [
  {
    img: reserveStep1,
    alt: "予約サイトのメニュー画面",
    title: "予約サイトにログイン",
    text: "メニューを開き「予約」をタップ。初めての方は会員登録（無料）からお願いします。",
  },
  {
    img: reserveStep2,
    alt: "クラスの日時を選ぶカレンダー画面",
    title: "クラス・日時を選ぶ",
    text: "「アローズエリア」を選び、カレンダーから希望の日時・クラスをタップします。",
  },
  {
    img: reserveStep3,
    alt: "レッスン詳細とチケット購入の画面",
    title: "レッスン内容を確認",
    text: "残りの予約可能数を確認し「チケットを購入して予約する」へ進みます。",
  },
  {
    img: reserveStep4,
    alt: "チケットを選択して購入する画面",
    title: "チケットを購入して完了",
    text: "チケットを選択し、お支払い情報を入力すると予約完了です。",
  },
];

function findFirstSlot(typeId) {
  let fallback = null;
  for (const week of weeks) {
    for (const day of days) {
      for (const row of timeRows) {
        const slot = makeSlot(week.dates[day.key], day.key, row.key);
        if (!slot || slot.type !== typeId) continue;
        fallback ||= slot;
        if (!slot.closed && slot.remaining > 0) return slot;
      }
    }
  }
  return fallback;
}

export function App() {
  const [activeType, setActiveType] = useState("run");
  const [selectedSlot, setSelectedSlot] = useState(() => findFirstSlot("run"));
  const [openFaq, setOpenFaq] = useState("faq-1");

  const selectedType = classTypes.find((type) => type.id === activeType);

  function chooseType(typeId) {
    setActiveType(typeId);
    setSelectedSlot(findFirstSlot(typeId));
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="エイジェックスポーツ科学総合センター トップ">
          <span className="brand-name">エイジェックスポーツ科学<br />総合センター</span>
        </a>
        <nav className="nav-links" aria-label="主要ナビゲーション">
          <a href="#features"><Sparkle size={18} weight="fill" />特徴</a>
          <a href="#booking"><CalendarCheck size={18} weight="fill" />クラス選択</a>
          <a href="#steps"><ListChecks size={18} weight="fill" />予約方法</a>
          <a href="#price"><SlidersHorizontal size={18} weight="fill" />料金</a>
          <a href="#faq"><Question size={18} weight="fill" />FAQ</a>
        </nav>
        <a
          className="deadline-button"
          href={RESERVATION_SITE_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="予約サイトで申し込む（新しいタブで開きます）"
        >
          <CalendarCheck size={24} weight="fill" />
          <span><strong>各回３日前締切</strong><small>お早めにお申し込みください</small></span>
        </a>
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
            <a
              className="ghost-cta"
              href={RESERVATION_SITE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="予約サイトで申し込む（新しいタブで開きます）"
            >
              予約サイトで申し込み
            </a>
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
        <Feature icon={CalendarCheck} title="短期集中プログラム" text="都合に合わせて選べる複数日程" />
        <Feature icon={UsersThree} title="少人数制で安心" text="各クラス10名限定の細やかな指導" />
      </section>

      <section id="booking" className="booking-section">
        <div className="section-heading">
          <p>STEP 1</p>
          <h2>クラスを選んで空き状況を確認・予約</h2>
        </div>

        <div className="class-tabs" aria-label="クラス種別">
          {classTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                className={`class-tab ${type.tone} ${activeType === type.id ? "active" : ""}`}
                onClick={() => chooseType(type.id)}
                aria-pressed={activeType === type.id}
              >
                <Icon size={24} weight="fill" />
                <span>{type.label}</span>
                <small>{type.target}</small>
              </button>
            );
          })}
        </div>

        <div className="booking-tools">
          <div className="legend" aria-label="空き状況凡例">
            <span className="legend-open">空きあり</span>
            <span className="legend-low">残りわずか</span>
            <span className="legend-off">休講</span>
          </div>
        </div>

        <div className="booking-grid">
          <div
            id="schedule-panel"
            className="schedule-board"
            aria-label={`${selectedType.label}スケジュール`}
          >
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
                          const visible = slot && slot.type === activeType;
                          const status = slotStatus(slot);
                          const isSelected = visible && selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={`${week.label}-${row.key}-${day.key}`}
                              className={`slot-cell ${visible ? status : "empty"} ${isSelected ? "chosen" : ""}`}
                              disabled={!visible || status === "full" || status === "off"}
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
            {selectedSlot && !selectedSlot.closed && selectedSlot.remaining > 0 ? (
              <>
                <div className="selected-title">
                  {selectedSlot.activity === "run" ? <PersonSimpleRun size={34} weight="fill" /> : <Lightning size={34} weight="fill" />}
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
                <a
                  className="panel-cta"
                  href={RESERVATION_SITE_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="選択したクラスを予約サイトで申し込む（新しいタブで開きます）"
                >
                  このクラスを選択する<CaretRight size={22} weight="bold" />
                </a>
              </>
            ) : (
              <div className="selection-empty">
                <h3>現在予約できる枠がありません</h3>
                <p>別のクラスまたは対象を選んで空き状況をご確認ください。</p>
              </div>
            )}
            <div className="panel-note">
              <strong>選択のポイント</strong>
              <p>フォーム改善と加速力、または切り返し能力を目的に合わせて選べます。</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="steps" className="steps-section">
        <div className="section-heading">
          <p>STEP 2</p>
          <h2>予約方法</h2>
        </div>
        <div className="steps-grid">
          {reserveSteps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <div className="step-shot">
                <span className="step-num">{index + 1}</span>
                <img src={step.img} alt={step.alt} loading="lazy" />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="steps-cta">
          <a
            className="primary-cta"
            href={RESERVATION_SITE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="予約サイトへ進む（新しいタブで開きます）"
          >
            予約サイトへ進む<CaretRight size={22} weight="bold" />
          </a>
          <small>各回3日前締切です。お早めにお申し込みください。</small>
        </div>
      </section>

      <section className="reason-section">
        <div className="section-heading">
          <p>WHY SUMMER CAMP</p>
          <h2>夏期講習の4つのポイント</h2>
        </div>
        <div className="reason-grid">
          <Reason icon={Medal} title="専門コーチの指導" text="アローズ栃木のスポーツ科学トレーナーが一人ひとりを丁寧に指導。" />
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
            <li><CheckCircle size={20} weight="fill" />お支払いは予約サイトで事前決済</li>
            <li><CheckCircle size={20} weight="fill" />キャンセルは前日までにご連絡ください</li>
          </ul>
        </div>
        <div className="price-cards">
          <article>
            <span>一般参加</span>
            <strong>2,200<small>円（税込）／1回</small></strong>
          </article>
          <article className="member">
            <span>アローズ会員特別価格</span>
            <strong>1,650<small>円（税込）／1回</small></strong>
          </article>
        </div>
        <img className="price-image" src={priceSrc} alt="トレーニング中の選手" />
      </section>

      <section id="faq" className="faq-section">
        <div className="section-heading">
          <p>FAQ</p>
          <h2>よくある質問</h2>
        </div>
        <div className="faq-list">
          {[
            ["faq-1", "申し込み方法を教えてください", "予約サイトからお申し込みください。"],
            ["faq-2", "小学生と中学生で時間は違いますか？", "小学生は10:00-11:00または13:30-14:30、中学生は15:00-16:00です。"],
            ["faq-3", "定員は何名ですか？", "各クラス10名です。定員に達し次第、受付終了となります。"],
          ].map(([id, question, answer]) => (
            <article className={`faq-item ${openFaq === id ? "open" : ""}`} key={id}>
              <button
                aria-expanded={openFaq === id}
                aria-controls={`${id}-answer`}
                onClick={() => setOpenFaq(openFaq === id ? "" : id)}
              >
                <span>{question}</span>
                <CaretRight size={20} weight="bold" />
              </button>
              <p id={`${id}-answer`} hidden={openFaq !== id}>{answer}</p>
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
        <a
          href={RESERVATION_SITE_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="予約サイトへ進む（新しいタブで開きます）"
        >
          申し込みへ進む<CaretRight size={22} weight="bold" />
        </a>
        <strong>各回3日前締切</strong>
      </section>

      <footer className="site-footer">
        <div>
          <span className="footer-name">エイジェックスポーツ科学<br />総合センター</span>
          <span>夏休み期間限定 夏期講習</span>
        </div>
        <small>© 2026 エイジェックスポーツ科学総合センター</small>
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
