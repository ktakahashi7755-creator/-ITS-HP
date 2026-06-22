# ITS合同会社 コーポレートサイト

テクノロジーで世界を輝かせる ― ITS合同会社のコーポレートサイト（v2.0）。
ポケモン株式会社コーポレートサイトの設計哲学（白基調・大型タイポグラフィ・贅沢な余白・洗練されたスクロールアニメーション）を、ITSのブランドアイデンティティ（Blue × Gold）へ落とし込んだ世界最高峰品質の静的サイトです。

## 技術スタック

- **HTML5** — セマンティックマークアップ / JSON-LD 構造化データ
- **CSS3** — Custom Properties によるデザイントークン（フレームワーク不使用）
- **Vanilla JavaScript** — IIFE パターン / 外部ライブラリ不使用
- **Google Fonts** — Noto Sans JP / Poppins / Cormorant Garamond
- **ホスティング** — GitHub Pages（静的配信・HTTPS）

## ファイル構成

```
├── index.html            # トップページ
├── services.html         # サービス詳細
├── familink.html         # 自社プロダクト Familink 製品ページ（LP・Familinkブランド・自己完結CSS）
├── css/
│   ├── style.css         # デザイントークン・base・nav・hero・footer（ITSサイト用）
│   ├── sections.css      # 各セクション固有スタイル（ITSサイト用）
│   └── animations.css    # スクロールリビール・カーソル・装飾モーション
├── js/
│   ├── main.js           # ナビ・スムーズスクロール・Canvasパーティクル・フォーム
│   └── animations.js     # スクロール演出
├── docs/                 # 要件定義・基本設計・詳細設計書
├── images/
│   ├── familink/lp/      # Familink LP の実機スクショ・マスコット・OGP（Familink repo由来）
│   └── ...               # ITSサイトの画像アセット
├── robots.txt
└── sitemap.xml
```

## Familink 製品ページ（familink.html）

ITS の自社プロダクト Familink の高コンバージョン LP。**Familink自身のブランド**（Primary `#0A84FF` / Secondary `#34C759` / Accent `#FF9F0A` / 背景 `#F2F2F7`、見出し Poppins・本文 Noto Sans JP）で構築し、`tokens.json`（Familinkリポジトリ）の正値に一致させています。1ファイル自己完結（インラインCSS / Vanilla JS）でITSサイトのCSSには依存しません。

**構成（狙い）**
1. ヒーロー — タグライン＋home実機モック＋浮かぶHoku＋CTA（第一印象とCV導線）
2. ★予定表まるごとOCR — 「写真1枚でカレンダーに」＋3ステップ（最大の差別化を最初に）
3. ★Hokuエージェント — 「話すだけで動く」＋できること一覧（AIの実用価値）
4. ★ファミコイン×着せ替え — 連続ログイン報酬（継続・習慣化の訴求）
5. 機能まとめ — calendar/tasks/budget/board/health/hoku の6カード
6. 世界観・会社 — 3児パパが作る／提供：ITS合同会社
7. CTA＋フッター

**画像の出典**：`images/familink/lp/` は Familink リポジトリ（`docs/press/`）の実機@3xスクショ・マスコット（`hoku-soft`）・`app-icon` をWeb最適化して自己ホスト。OGPカード（`ogp.png`）は本リポジトリで生成。

**要設定プレースホルダ（捏造せず空けてある箇所）**
- フッターの「利用規約」「プライバシーポリシー」リンク（現在 `href="#"`、`要設定` バッジ付き）→ 正式な法務ページURLに差し替え
- 正式な料金プラン表記（現状は「基本無料」のみ記載。有料/プレミアムの正式条件は未記載）

## デプロイ（GitHub Pages）

静的サイトのため**ビルド不要**。`main` ブランチへ push すると GitHub Pages（`Deploy to GitHub Pages` ワークフロー）が自動配信します。

```bash
git add -A && git commit -m "update" && git push origin main
# → https://ktakahashi7755-creator.github.io/-ITS-HP/
```

画像を**同名で差し替えた**場合はブラウザ/CDNキャッシュ対策として参照URLに `?v=N` を付与してください。

## アクセシビリティ / パフォーマンス

- `prefers-reduced-motion: reduce` で全モーション無効化
- `pointer: coarse`（タッチ端末）でカスタムカーソル・磁石ボタン・3Dティルトを無効化
- IntersectionObserver による軽量なスクロール検知 + passive scroll listener
- transform / opacity のみのアニメーションで 60fps を維持

## ローカル確認

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

---

© 2026 ITS合同会社 (ITS LLC). All rights reserved.
