"""Generate Android launcher icons from a single square source PNG.

Usage: python scripts/gen-android-icons.py [assets/icon.png]

Produces, for every density:
  - ic_launcher.png / ic_launcher_round.png  (legacy, pre-API 26)
  - ic_launcher_background.png               (adaptive background = full art)
  - ic_launcher_foreground.png               (transparent; art lives in background)

The source art is full-bleed, so it is used as the adaptive *background* layer.
Android's mask shows the centre ~66% of that layer, which keeps the cat inside
the safe zone while the purple gradient bleeds to every mask edge.
"""
import os
import sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")

# density -> (legacy 48dp px, adaptive 108dp px)
DENSITIES = {
    "mdpi": (48, 108),
    "hdpi": (72, 162),
    "xhdpi": (96, 216),
    "xxhdpi": (144, 324),
    "xxxhdpi": (192, 432),
}


def rounded(img, size):
    """Legacy round icon: circular crop of the art."""
    out = img.resize((size, size), Image.LANCZOS).convert("RGBA")
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    out.putalpha(mask.resize((size, size), Image.LANCZOS))
    return out


def main():
    src_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "assets", "icon.png")
    if not os.path.exists(src_path):
        sys.exit(f"source icon not found: {src_path}")

    src = Image.open(src_path).convert("RGBA")
    if src.width != src.height:
        side = min(src.width, src.height)
        left, top = (src.width - side) // 2, (src.height - side) // 2
        src = src.crop((left, top, left + side, top + side))
    print(f"source: {src_path} ({src.width}x{src.height})")

    for density, (legacy, adaptive) in DENSITIES.items():
        out_dir = os.path.join(RES, f"mipmap-{density}")
        os.makedirs(out_dir, exist_ok=True)

        src.resize((legacy, legacy), Image.LANCZOS).save(os.path.join(out_dir, "ic_launcher.png"))
        rounded(src, legacy).save(os.path.join(out_dir, "ic_launcher_round.png"))
        src.resize((adaptive, adaptive), Image.LANCZOS).save(
            os.path.join(out_dir, "ic_launcher_background.png")
        )
        Image.new("RGBA", (adaptive, adaptive), (0, 0, 0, 0)).save(
            os.path.join(out_dir, "ic_launcher_foreground.png")
        )
        print(f"  mipmap-{density}: {legacy}px legacy, {adaptive}px adaptive")

    # Play Console store listing asset
    play = os.path.join(ROOT, "assets", "play-store-icon-512.png")
    src.resize((512, 512), Image.LANCZOS).convert("RGB").save(play)
    print(f"play store icon: {play}")


if __name__ == "__main__":
    main()
