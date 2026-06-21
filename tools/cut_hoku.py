#!/usr/bin/env python3
"""
Hoku 切り抜きツール — 1キャラ/プレーン背景の画像を、背景透過の軽量WebPに変換。

使い方:
  pip install rembg onnxruntime pillow
  python3 tools/cut_hoku.py <入力画像> images/familink/hoku/<name>.webp
  # グリッド(2行3列など)をまとめて切る場合:
  python3 tools/cut_hoku.py --grid 3x2 <grid.png> images/familink/hoku  name1 name2 ...

出力後、familink.html の #hoku-data に
  {"file":"images/familink/hoku/<name>.webp","role":"○○のHoku","sub":"...説明..."}
を1行足せばショーケースに自動で反映されます。
"""
import sys, os
from PIL import Image
from rembg import remove, new_session

_session = new_session("u2net")

def cut(img):
    out = remove(img, session=_session, alpha_matting=True,
                 alpha_matting_foreground_threshold=245,
                 alpha_matting_background_threshold=15,
                 alpha_matting_erode_size=11).convert("RGBA")
    bb = out.getbbox()
    if bb:
        x0, y0, x1, y1 = bb
        p = 10
        out = out.crop((max(0, x0 - p), max(0, y0 - p),
                        min(out.width, x1 + p), min(out.height, y1 + p)))
    return out

def save(img, path, tw=480):
    if img.width > tw:
        img = img.resize((tw, round(img.height * tw / img.width)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "WEBP", quality=90, method=6)
    print(os.path.basename(path), img.size, f"{os.path.getsize(path)//1024}KB")

def main():
    a = sys.argv[1:]
    if a[:1] == ["--grid"]:
        cols, rows = (int(x) for x in a[1].split("x"))
        src, outdir = a[2], a[3]
        names = a[4:]
        g = Image.open(src).convert("RGB")
        W, H = g.size; cw, ch = W // cols, H // rows
        i = 0
        for r in range(rows):
            for c in range(cols):
                if i >= len(names): break
                cell = g.crop((c*cw, r*ch, (c+1)*cw, (r+1)*ch))
                save(cut(cell), os.path.join(outdir, names[i] + ".webp"))
                i += 1
    else:
        src, out = a[0], a[1]
        tw = 560 if "main" in os.path.basename(out) else 480
        save(cut(Image.open(src).convert("RGB")), out, tw)

if __name__ == "__main__":
    main()
