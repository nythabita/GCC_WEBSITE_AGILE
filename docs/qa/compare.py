"""Side by side: ours (left) vs Figma render (right), cut into slices.

Usage: python -I compare.py <ours.png> <design.png> <outprefix> [slice=1100] [only=<index>]
Writes <outprefix>_<n>.png. Prints both heights.
"""
import sys

from PIL import Image


def main() -> None:
    ours, design, prefix = sys.argv[1:4]
    step = int(sys.argv[4]) if len(sys.argv) > 4 else 1100
    only = int(sys.argv[5]) if len(sys.argv) > 5 else None
    a, b = Image.open(ours).convert("RGB"), Image.open(design).convert("RGB")
    print("ours", a.size, "design", b.size)
    n = 0
    for y in range(0, max(a.size[1], b.size[1]), step):
        if only is None or only == n:
            c = Image.new("RGB", (a.size[0] + b.size[0] + 10, step), "black")
            c.paste(a.crop((0, y, a.size[0], y + step)), (0, 0))
            c.paste(b.crop((0, y, b.size[0], y + step)), (a.size[0] + 10, 0))
            c.save(f"{prefix}_{n}.png")
        n += 1
    print("slices", n)


if __name__ == "__main__":
    main()
