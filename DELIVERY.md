# 納品・運用ガイド

## 納品物

配布時は、ルート直下の次の2点を同じ階層に置いてください。

- `index.html`
- `assets/`

`index.html` にはCSSとJavaScriptが埋め込まれています。画像だけを `assets/` から相対参照するため、フォルダー名や配置を変更しないでください。

Windowsアプリとして配布する場合は、`release/AGK-Summer-Camp-2026-1.0.0-portable.exe` の単体配布も可能です。EXEでは「ページ」メニューから公開LPと管理ページを切り替えられます。予約サイトは既定のWebブラウザで開きます。

現在のEXEはコード署名証明書を使用していません。社外配布時にWindows SmartScreenの警告を避ける必要がある場合は、納品先企業のコード署名証明書で署名してください。

## 公開方法

GitHub Pagesでは、`main` ブランチへのpushを契機に `.github/workflows/deploy.yml` が `npm run build` を実行し、`dist/` を公開します。

ローカルで納品物を再生成する場合は、Node.js 20以上で次を実行します。

```bash
npm ci
npm run build
npm run build:exe
```

ビルドの最後に、スケジュールデータ、CSS/JavaScriptの埋め込み、画像参照、ブランド名、予約URLを自動検証します。

## 空き状況の更新

1. 公開ページのURL末尾に `#admin` を付ける
2. 管理パスコードを入力する
3. 残席、休講、開催日を編集する
4. `scheduleData.js をダウンロード` を押す
5. ダウンロードしたファイルで `src/scheduleData.js` を置き換える
6. `src/scheduleData.js` をコミットして `main` にpushする
7. GitHub Actionsの `Deploy to GitHub Pages` が `npm run build` を実行し、LPのカレンダーを自動更新する

ローカル納品物を手元で確認・再生成したい場合だけ `npm run build` を実行してください。GitHub Pagesへの公開反映はpush後のGitHub Actionsが行います。

開催日の変更は、選択した日の全コマをまとめて移動します。既存枠がある日、お盆休み週、公開カレンダー外の日付には移動できません。

## セキュリティ上の注意

管理ページはクライアント側の簡易パスコード方式です。パスコードは閲覧者から完全には秘匿できません。個人情報、決済情報、非公開情報は保存しないでください。予約と決済は外部のhacomono予約サイトで処理します。

## 公開前チェック

- `npm run build` が成功する
- LPのクラス切り替え、対象フィルター、枠選択、FAQが動作する
- すべての申込導線がhacomono予約サイトを開く
- `#admin` でログイン、残席変更、休講変更、開催日移動、ファイル出力が動作する
- PC幅とスマートフォン幅で文字切れや横方向の崩れがない
