# Hoku キャラクター（ショーケース用・背景透過WebP）

Familinkページ「Hoku」セクションのスポットライト・カルーセルで使う、
背景透過済みのHokuたちです（rembg でAI切り抜き→自動トリミング→WebP化）。

## 新しいHokuを追加する手順
1. 1キャラ＝プレーン背景の画像を用意（複数まとめたグリッドでもOK）。
2. 切り抜き（透過WebP化）：
   ```
   pip install rembg onnxruntime pillow
   python3 tools/cut_hoku.py 入力画像.png images/familink/hoku/<name>.webp
   # グリッドの場合（例：3列2行）:
   python3 tools/cut_hoku.py --grid 3x2 grid.png images/familink/hoku name1 name2 name3 name4 name5 name6
   ```
3. `familink.html` の `<script id="hoku-data">` に1行追加：
   ```json
   {"file":"images/familink/hoku/<name>.webp","role":"○○のHoku","sub":"ひとことキャプション"}
   ```
4. これだけでショーケースに自動反映されます（順番＝配列の順番）。

現在の登録（カルーセル12体）: firefighter / doctor / teacher / astronaut / pirate / detective / chef / rain / graduate / police / summer / pajama（＋floating用 main）
