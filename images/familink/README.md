# Familink 画像（このリポジトリで自前ホスト）

Familink公式リポジトリ（`ktakahashi7755-creator/Familink`）の `docs/press/` から
取得した実機スクリーンショット等を、ここに同梱して**自前ホスト**しています。
公式 Pages（`/Familink/press/...`）が読めない環境でも確実に表示するためです。

各 `<img>` は `src` がこのローカル画像、`data-fallback` が公式URL（予備）です。
（js/main.js の initImgFallback：ローカル失敗時のみ公式へ、両方失敗なら非表示）

| ファイル | 内容 | 取得元（Familink/docs/press） |
|---|---|---|
| `app-icon.png` | アプリアイコン | app-icon-256.png |
| `home.jpg` | ホーム画面 | screens/home.png |
| `calendar.jpg` | カレンダー画面 | screens/calendar.png |
| `budget.jpg` | 家計画面 | screens/budget.png |
| `health.jpg` | 体調・成長画面 | screens/health.png |
| `tasks.jpg` | やること画面 | screens/tasks.png |
| `board.jpg` | 家族ボード画面 | screens/board.png |
| `hoku-screen.jpg` | Hoku 画面 | screens/hoku.png |
| `hoku.png` | Hoku キャラクター（透過） | hoku-soft.png |

スクリーンショットは表示サイズに合わせて幅620pxへ縮小しJPEG(q82)化、
アイコン/キャラクターは透過PNGのまま最適化しています（合計約0.7MB・遅延読込）。
最新の公式画像に差し替えたい場合は、同名でこのフォルダのファイルを置き換えてください。
