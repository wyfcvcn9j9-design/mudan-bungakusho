# 無断文学賞

原文では普通。切り取ると名文。TypeScript + Viteで構成した、サーバー不要のMVPです。本文は原文そのままに表示します。

## 起動・検証

Node.js 22.12以上を使用します。

```sh
npm install
npm run dev
npm run test
npm run build
npm run preview
```

開発サーバーはターミナルに表示されるURLで開きます。ビルド出力は `dist/` です。

## 操作

- 本文をタップ／クリック、またはフォーカスしてEnter・Space：出典を開閉。
- 左スワイプ：次へ。右スワイプ：直前へ。
- 下部の前後ボタン、キーボードの左右矢印でも移動。Escapeで答え合わせを閉じます。
- 縦操作はページスクロールに任せ、横55px以上で切り替えます。縦操作やドラッグはタップとして扱いません。
- 動きを減らすOS設定に従います。セーフエリアを考慮しています。

## 標本の追加・修正・削除

`src/specimens.ts` の配列を編集してください。UI変更は不要です。

```ts
{
 id: 'unique-id',
 text: '原文と完全一致する一文',
 source: '出典名',
 url: 'https://example.com/article',
 context: '元記事での用途を簡潔に説明。',
 status: 'draft', // published: 公開、draft: 非公開
 verification: { status: 'needs-review' }
}
```

実際のURL・本文・文脈を確認した後にのみ `status: 'published'` と `verification: { status: 'verified', checkedAt: 'YYYY-MM-DD' }` に変更します。未確認は画面に出ません。本文に表示用の括弧、改行や文学的な解説を加えないでください。既存データの編集・配列からの削除で修正・削除できます。IDは一意かつ固定にします。

初期2文は2026-10-15に指定URLを開き、完全一致を確認しました。

- https://baycrews.jp/feature/detail/6084 「上質感のある生地を取り入れる」節
- https://leadbrain.co.jp/contents/lb/8802/ 「なくなる」と誤解される最大の原因は106万円の壁との混同」節

## 履歴

localStorageの `mudan-bungakusho:history:v1` に既読IDと直近500件の表示順を保存。初回はランダム、以降は未読からランダムに選び、全件既読なら直前と異なる標本をランダム表示します（1件の場合を除く）。戻ると実際に見た文章へ戻り、その後の次へは履歴をたどります。再読み込みは現在位置から新しく選び、未読を優先します。削除・非公開になったIDは復元時に除外します。保存が制限される環境ではそのタブ内のみ動作します。

## 公開

`npm run build` が成功した後、`dist/` 全体を静的ホスティングへ配置します。

### Vercel

このディレクトリをGitリポジトリとして登録。Framework PresetはVite、Build Commandは `npm run build`、Output Directoryは `dist`。環境変数やデータベースは不要です。

### GitHub Pages

リポジトリのSettings → Pages → SourceをGitHub Actionsに設定。Node.js 22で `npm ci`、`npm run build` を実行し、`actions/upload-pages-artifact` で `dist` をアップロード、`actions/deploy-pages` で配信してください。`pages: write`、`id-token: write` と `github-pages` environmentを設定します。アセットは相対パスのためサブディレクトリにも対応します。

公開後はiPhone Safari実機で、タップ、左右スワイプ、縦スクロール、再訪時の履歴を確認してください。履歴は端末・ブラウザ・ドメインごとで、別端末とは共有しません。

## 今回の確認結果

- TypeScript型チェックと本番ビルド成功。
- 履歴ロジックのテスト成功（ランダム初期表示、未読優先、前後履歴、再読込、破損データ、追加・削除・空データ）。
- Chromiumで390×844と1440×900を確認。本文の開閉、リンク、前後ボタン、矢印キー、再読込、横・縦ジェスチャー、動き軽減、横はみ出しとJSエラーなしを確認。
- iPhone Safari実機は未検証。
- この環境にはSites公開ヘルパーがインストールされていないため、ホスティングへの配置は未実施。

## GitHub Pagesの自動公開設定

`.github/workflows/deploy-pages.yml` を追加済みです。公開リポジトリの `main` にpushすると、テスト・ビルド後にGitHub Pagesへ自動公開します。Actions画面の `Deploy to GitHub Pages` → `Run workflow` から手動再公開もできます。

初回のみ、GitHubのリポジトリで Settings → Pages → Build and deployment → Source を **GitHub Actions** に設定します。無料プランの場合は公開リポジトリを使用します。URLはActionsのdeployジョブ、またはSettings → Pagesに表示されます。

以降は `src/specimens.ts` などを修正し、mainへコミット・pushするだけです。GitHub上でファイルを編集してCommit changesしても自動公開されます。Actionsが緑の成功表示になってからSafariを再読み込みしてください。
