# its-tokyo.com 本番公開手順（Xserver）

ITS合同会社 公式サイトを Xserver の本番環境（`its-tokyo.com`）へ公開する手順です。
配信用ファイルはすべて **`public_html/`** フォルダにまとまっています。

## 1. アップロード
`public_html/` の**中身**を、Xserver のドメイン公開フォルダ（`/home/<アカウント>/its-tokyo.com/public_html/`）へそのままアップロードします。

- FTP / SFTP（FileZilla 等）または Xserver ファイルマネージャを使用
- `public_html/` の**中身だけ**を置く（フォルダごとではなく、`index.html` 等が public_html 直下に来るように）
- 既存サイトと置き換える場合は、先に既存ファイルをバックアップしてから上書き

```
public_html/
├── index.html          ← トップページ
├── services.html       ← サービス
├── familink.html       ← プロダクト(Familink)
├── robots.txt / sitemap.xml / favicon.svg
├── .htaccess           ← HTTPS化・gzip・キャッシュ・セキュリティヘッダ
├── css/  js/  images/
```

## 2. ドメイン / SSL
- Xserver パネルでドメイン `its-tokyo.com` を追加し、**無料独自SSL**を有効化
- `.htaccess` に HTTPS 強制リダイレクトを設定済み（SSL有効後に自動でhttpsへ）
- `www` を使う/使わないは `.htaccess` 内のコメント部分で切替可能（既定は canonical に合わせ非www想定）

## 3. 反映確認
- https://its-tokyo.com/ /services.html /familink.html を表示確認
- スマホ・PC 両方でレイアウト確認（レスポンシブ対応済み）

## 4. 公開後（SEO）
- 旧 GitHub Pages（`ktakahashi7755-creator.github.io/-ITS-HP/`）は、公開後に
  停止または `its-tokyo.com` への301リダイレクト推奨（重複コンテンツ回避）
- Google Search Console に `its-tokyo.com` を登録し、`sitemap.xml` を送信

## 補足
- 本フォルダは全URLを `https://its-tokyo.com/` に統一済み（canonical / OGP / sitemap / robots）
- アプリ未完成のため、Familink の「無料ではじめる」「利用規約」等のリンクは未掲載
  （アプリ公開後にURLを設定して再掲載してください）
