"""Split a Figma PDF export into frames: render PNGs, dump text lines, extract images.

Usage:
  python -I pdf_extract.py "<file.pdf>" <outdir> name:x:width:height [name:x:width:height ...] [--y0=100] [--zoom=1.5]

A Figma "section" export is one big page with several frames side by side. x/width/height
are the frame's position inside that page (Figma frame x offsets; y0 is the shared top, usually 100).
A single-frame export is just name:0:<page width>:<page height> with --y0=0.

Outputs in <outdir>:  <name>.png (render), <name>.txt (y x size text), img/<name>_<n>.png (embedded images,
alpha restored from the PDF soft mask; images that fail with "bad xref" are skipped).
Text fonts and colours are outlined in these PDFs, so match them by eye; sample colours from the render.
"""
import io
import os
import sys

import pymupdf
from PIL import Image


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    opts = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
    pdf, outdir, specs = args[0], args[1], args[2:]
    y0, zoom = float(opts.get("y0", 100)), float(opts.get("zoom", 1.5))
    os.makedirs(os.path.join(outdir, "img"), exist_ok=True)
    doc = pymupdf.open(pdf)
    page = doc[0]
    frames = []
    for spec in specs:
        name, x, w, h = spec.split(":")
        frames.append((name, float(x), float(w), float(h)))
        clip = pymupdf.Rect(float(x), y0, float(x) + float(w), y0 + float(h))
        page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip).save(os.path.join(outdir, f"{name}.png"))
        rows = []
        for block in page.get_text("dict", clip=clip)["blocks"]:
            for line in block.get("lines", []):
                text = "".join(s["text"] for s in line["spans"]).strip()
                if text:
                    rows.append((round(line["bbox"][1] - y0), round(line["bbox"][0] - float(x)), round(line["spans"][0]["size"], 1), text))
        rows.sort()
        with open(os.path.join(outdir, f"{name}.txt"), "w", encoding="utf-8") as f:
            f.write("\n".join(f"{y:5d} x{x_:3d} {size:5} {t}" for y, x_, size, t in rows))
        print(name, len(rows), "text lines")

    for i, info in enumerate(page.get_image_info(xrefs=True)):
        try:
            bx = info["bbox"]
            owner = next((f for f in frames if f[1] <= bx[0] + 1 < f[1] + f[2]), None)
            if owner is None:
                continue
            raw = doc.extract_image(info["xref"])
            img = Image.open(io.BytesIO(raw["image"])).convert("RGB")
            if raw.get("smask"):
                mask = Image.open(io.BytesIO(doc.extract_image(raw["smask"])["image"])).convert("L")
                img = img.convert("RGBA")
                img.putalpha(mask.resize(img.size))
            path = os.path.join(outdir, "img", f"{owner[0]}_{i}.png")
            img.save(path)
            print(f"  img {i}: {owner[0]} x={round(bx[0] - owner[1])} y={round(bx[1] - y0)} "
                  f"w={round(bx[2] - bx[0])} h={round(bx[3] - bx[1])} src={img.size}")
        except Exception as exc:  # noqa: BLE001 - some xrefs are not extractable
            print(f"  img {i}: skipped ({exc})")


if __name__ == "__main__":
    main()
