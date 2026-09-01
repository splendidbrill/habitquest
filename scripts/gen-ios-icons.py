"""Generate iOS AppIcon assets from a single square source PNG.

Usage: python scripts/gen-ios-icons.py [assets/icon.png]

iOS icons must be fully opaque — an alpha channel makes App Store Connect
reject the upload — so every size is flattened onto white before saving.
Filenames match ios/HabitQuest/Images.xcassets/AppIcon.appiconset/Contents.json.
"""
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONSET = os.path.join(ROOT, "ios", "HabitQuest", "Images.xcassets", "AppIcon.appiconset")
SIZES = [40, 58, 60, 80, 87, 120, 180, 1024]


def main():
    src_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "assets", "icon.png")
    if not os.path.exists(src_path):
        sys.exit(f"source icon not found: {src_path}")

    src = Image.open(src_path).convert("RGBA")
    if src.width != src.height:
        side = min(src.width, src.height)
        left, top = (src.width - side) // 2, (src.height - side) // 2
        src = src.crop((left, top, left + side, top + side))

    for size in SIZES:
        flat = Image.new("RGB", src.size, (255, 255, 255))
        flat.paste(src, mask=src.split()[3])
        out = os.path.join(ICONSET, f"icon-{size}.png")
        flat.resize((size, size), Image.LANCZOS).save(out)
        print(f"  icon-{size}.png")

    print(f"wrote {len(SIZES)} icons to {ICONSET}")


if __name__ == "__main__":
    main()
