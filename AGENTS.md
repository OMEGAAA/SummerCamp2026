# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Project decisions

- ヘッダー左上のブランド表記は「エイジェックスポーツ科学総合センター」にする。
- スケジュール／空き状況のデータは `src/scheduleData.js` の `schedule` が単一の真実。LP(`src/App.jsx`)と管理ページ(`src/Admin.jsx`)が両方ここを参照する。
- 管理ページはハッシュルート `#admin`（`src/main.jsx` の Root で分岐）。簡易パスコード方式（`ADMIN_PASSCODE`、現在 `arrows2026`、クライアント側のみ）。
- 空き状況の運用方針は「データ生成のみ」: 管理ページで編集 → 生成コードを `scheduleData.js` に貼り付け → 再ビルドで公開反映。バックエンドは持たない。
- 配布物はルートの単体 `index.html`（CSS/JS埋め込み、画像は `assets/`）。これは Vite のビルド入口も兼ねるため、ビルドは `npm run build`（= `scripts/pre.mjs` でソース入口 `scripts/entry.html` を復元 → `vite build` → `scripts/bundle.mjs` でインライン化）で行うこと。`vite build` 単体は実行しない（古い埋め込みを再出力し画像ハッシュが累積する）。
