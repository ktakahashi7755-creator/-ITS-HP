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
├── index.html            # トップページ（14セクション）
├── services.html         # サービス詳細
├── familink.html         # 自社プロダクト Familink
├── css/
│   ├── style.css         # デザイントークン・base・nav・hero・footer
│   ├── sections.css      # 各セクション固有スタイル
│   └── animations.css    # スクロールリビール・カーソル・装飾モーション
├── js/
│   ├── main.js           # ナビ・スムーズスクロール・Canvasパーティクル・フォーム
│   └── animations.js     # スクロール演出 11関数（counter / text-reveal / magnetic 他）
├── docs/                 # 要件定義・基本設計・詳細設計書（v2.0）
├── images/               # 画像アセット
├── robots.txt
└── sitemap.xml
```

## 主なセクション（index.html）

1. Hero — Canvasパーティクル + 大型テキスト + 2CTA
2. Marquee Band — 技術キーワードティッカー
3. Philosophy — 大型哲学ステートメント（Cormorant Garamond）
4. About — Mission / Vision / Value / Product
5. Stats — カウンターアニメーション
6. Services — 4サービス（スタガー + 3Dティルト）
7. Familink Showcase — 自社プロダクト（iPhoneモックアップ）
8. Strengths — 選ばれる6つの理由
9. Works — 実績
10. CEO Message — 代表メッセージ
11. Company — 会社概要
12. CTA Band — 問い合わせ誘導
13. Contact — お問い合わせフォーム（バリデーション付き）
14. Footer

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
