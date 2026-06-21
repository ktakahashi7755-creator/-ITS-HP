# Familink 画像（ローカル・フォールバック用）

サイトの Familink セクションの画像は、まず Familink 公式 Pages
（`https://ktakahashi7755-creator.github.io/Familink/press/...`）を読み込み、
**失敗した場合はこのフォルダ内の同名ファイルにフォールバック**します（js/main.js の initImgFallback）。

公式URLが読み込めない場合（例：press フォルダが Pages に公開されていない等）は、
下記のファイル名で**実機スクリーンショット等をこのフォルダに置く**と確実に表示されます。

| ローカルファイル名 | 内容 | 公式URL（1次ソース） |
|---|---|---|
| `app-icon.png` | アプリアイコン | press/app-icon-256.png |
| `home.png` | ホーム画面 | press/screens/home.png |
| `calendar.png` | カレンダー画面 | press/screens/calendar.png |
| `budget.png` | 家計画面 | press/screens/budget.png |
| `health.png` | 体調・成長画面 | press/screens/health.png |
| `tasks.png` | やること画面 | press/screens/tasks.png |
| `board.png` | 家族ボード画面 | press/screens/board.png |
| `hoku-screen.png` | Hoku 画面 | press/screens/hoku.png |
| `hoku.png` | Hoku キャラクター | press/hoku-soft.png |

※ ファイルを置いたら自動で表示されます（公式URLが生きていれば公式が優先）。
