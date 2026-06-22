アローズ夏期講習LP

開き方:
- このフォルダ内の index.html をダブルクリックしてください。
- このindex.htmlはCSS/JSを埋め込んだ単体HTMLです。
- 画像は assets フォルダから読み込みます。index.html と assets フォルダを同じ場所に置いてください。

管理ページ（空き状況の編集）:
- ブラウザで index.html を開き、アドレスの末尾に #admin を付けてアクセスします。
  例) ファイルを開いた状態で、URL末尾に「#admin」を追加（…/index.html#admin）。
- パスコード: arrows2026 （変更する場合は src/Admin.jsx の ADMIN_PASSCODE を編集して再ビルド）
- 各クラスの残席を編集し、休講のオン/オフも切り替えられます。
- 「scheduleData.js をダウンロード」→ ダウンロードしたファイルで src/scheduleData.js を丸ごと置き換え →
  再ビルド（npm run build）で公開LPに反映されます。
  （「コードをコピー」で schedule 部分だけを貼り替えることも可能です）
- 編集はこの端末・ブラウザ内のプレビュー用で、再ビルドするまで公開LPは変わりません。

編集用ソース:
- src/App.jsx        … LP本体
- src/Admin.jsx      … 管理ページ
- src/scheduleData.js … スケジュール／空き状況のデータ（公開LPはここを参照）
- src/styles.css

ビルド:
- npm run build  （src/ から index.html・assets・dist を再生成します）

注意:
- Google Form URLは未設定です。公開時に申込ボタンの遷移先を設定してください。
- 管理ページのパスコードはクライアント側の簡易ガードです（強固な認証ではありません）。
