# エイジェックスポーツ科学総合センター 夏期講習LP

走り方・アジリティ夏期講習のランディングページ。React + Vite で構築し、GitHub Actions により GitHub Pages へ自動デプロイされます。

## 公開URL

https://omegaaa.github.io/SummerCamp2026/

- 管理ページ（空き状況の編集）: 上記URL末尾に `#admin` を付与

## 開発

必要環境: Node.js 20 以上

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発サーバー (http://127.0.0.1:5173)
npm run build    # 本番ビルド（単体HTML index.html と dist/ を生成）
```

`npm run build` は `scripts/pre.mjs`（ソース入口の復元）→ `vite build` → `scripts/bundle.mjs`（CSS/JSをインライン化した単体HTMLを生成）の順で実行されます。配布用の `index.html`・`assets/`・`dist/` はビルド生成物のため Git 管理対象外です。

## デプロイ

`main` ブランチに push すると、GitHub Actions（`.github/workflows/deploy.yml`）が自動でビルドし、GitHub Pages へ公開します。

> 初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を **「GitHub Actions」** に設定してください。

## 空き状況の編集（管理ページ）

1. 公開URL末尾に `#admin` を付けてアクセス
2. パスコードを入力（既定: `arrows2026` / 変更は `src/Admin.jsx` の `ADMIN_PASSCODE`）
3. 各クラスの残席・休講を編集
4. **「scheduleData.js をダウンロード」** → ダウンロードしたファイルで `src/scheduleData.js` を置き換え
5. `git add . && git commit -m "空き状況更新" && git push` で本番反映

## 申し込み導線

申し込みボタンは予約サイト（hacomono）へ遷移します。
https://center-agk-sp-science.hacomono.jp/home

## 主なファイル

| パス | 内容 |
| --- | --- |
| `src/App.jsx` | LP 本体 |
| `src/Admin.jsx` | 管理ページ（`#admin`） |
| `src/scheduleData.js` | スケジュール／空き状況データ（公開LPの参照元） |
| `src/styles.css` | スタイル |
| `src/assets/` | 使用画像 |
| `scripts/` | ビルド補助（`pre.mjs` / `bundle.mjs` / `entry.html`） |
| `使用写真/` | LP で使用している写真のコピー（参照用） |
| `.github/workflows/deploy.yml` | GitHub Pages 自動デプロイ |
