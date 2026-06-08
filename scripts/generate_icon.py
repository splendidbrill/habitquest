"""
Generate HabitQuest app icons for iOS and Android from a single vector design.

Design: brand diagonal gradient (purple -> pink -> coral, matching the app's
LinearGradients) with a white four-point "quest spark" glyph. The four points
nod to the four pillars (Nutrition, Activity, Sleep, Confidence).

Run:  python scripts/generate_icon.py
Requires Pillow only.
"""
import math
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Brand gradient stops (top-left -> centre -> bottom-right)
STOPS = [(0xC0, 0x84, 0xFC), (0xEC, 0x48, 0x99), (0xFB, 0x72, 0x85)]

SS = 4  # supersample factor for crisp edges


def _lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(size):
    """Diagonal 3-stop gradient, full-bleed square (RGB)."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    m = 2 * (size - 1) if size > 1 else 1
    for y in range(size):
        for x in range(size):
            t = (x + y) / m  # 0..1 across the diagonal
            if t < 0.5:
                c = _lerp(STOPS[0], STOPS[1], t / 0.5)
            else:
                c = _lerp(STOPS[1], STOPS[2], (t - 0.5) / 0.5)
            px[x, y] = c
    return img


def spark_points(cx, cy, outer, inner, rot=0.0):
    """8-vertex 4-point star (sparkle) centred at cx,cy."""
    pts = []
    for i in range(8):
        ang = math.radians(rot + i * 45)
        r = outer if i % 2 == 0 else inner
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    return pts


def draw_glyph(size, scale=0.34):
    """Transparent layer with the white quest-spark glyph centred."""
    S = size * SS
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx = cy = S / 2
    outer = S * scale
    inner = outer * 0.36  # sharp sparkle
    # Main spark (rotated 45deg so points face up/down/left/right reads as a star)
    d.polygon(spark_points(cx, cy, outer, inner, rot=0), fill=(255, 255, 255, 255))
    # Small accent spark, upper-right, for a playful "magic" feel
    ao = outer * 0.34
    d.polygon(
        spark_points(cx + outer * 0.82, cy - outer * 0.82, ao, ao * 0.36, rot=0),
        fill=(255, 255, 255, 255),
    )
    return layer.resize((size, size), Image.LANCZOS)


def rounded_mask(size, radius):
    S = size * SS
    m = Image.new("L", (S, S), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, S - 1, S - 1], radius=radius * SS, fill=255)
    return m.resize((size, size), Image.LANCZOS)


def circle_mask(size):
    S = size * SS
    m = Image.new("L", (S, S), 0)
    ImageDraw.Draw(m).ellipse([0, 0, S - 1, S - 1], fill=255)
    return m.resize((size, size), Image.LANCZOS)


def icon_square(size, glyph_scale=0.34):
    base = gradient(size).convert("RGBA")
    base.alpha_composite(draw_glyph(size, glyph_scale))
    return base


def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path)
    print("  ", os.path.relpath(path, ROOT))


# ---------------------------------------------------------------- iOS
def build_ios():
    print("iOS:")
    appicon = os.path.join(ROOT, "ios/HabitQuest/Images.xcassets/AppIcon.appiconset")
    for s in (40, 58, 60, 80, 87, 120, 180, 1024):
        img = icon_square(s).convert("RGB")  # iOS: no alpha, system masks corners
        save(img, os.path.join(appicon, f"icon-{s}.png"))


# ---------------------------------------------------------------- Android
ANDROID_LEGACY = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
ANDROID_FG = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}

ADAPTIVE_XML = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
"""


def build_android():
    print("Android:")
    res = os.path.join(ROOT, "android/app/src/main/res")
    for dens, size in ANDROID_LEGACY.items():
        d = os.path.join(res, f"mipmap-{dens}")
        # Legacy square (rounded) + round, for launchers without adaptive support
        sq = icon_square(size).copy()
        sq.putalpha(rounded_mask(size, size * 0.22))
        save(sq, os.path.join(d, "ic_launcher.png"))
        rd = icon_square(size).copy()
        rd.putalpha(circle_mask(size))
        save(rd, os.path.join(d, "ic_launcher_round.png"))
    # Adaptive: foreground glyph (safe-zone scale) + gradient background, per density
    for dens, size in ANDROID_FG.items():
        d = os.path.join(res, f"mipmap-{dens}")
        fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        fg.alpha_composite(draw_glyph(size, scale=0.26))  # glyph inside 66% safe zone
        save(fg, os.path.join(d, "ic_launcher_foreground.png"))
        save(gradient(size).convert("RGBA"), os.path.join(d, "ic_launcher_background.png"))
    # Adaptive XML (API 26+)
    anydpi = os.path.join(res, "mipmap-anydpi-v26")
    os.makedirs(anydpi, exist_ok=True)
    for name in ("ic_launcher.xml", "ic_launcher_round.xml"):
        p = os.path.join(anydpi, name)
        with open(p, "w", encoding="utf-8") as f:
            f.write(ADAPTIVE_XML)
        print("  ", os.path.relpath(p, ROOT))


if __name__ == "__main__":
    build_ios()
    build_android()
    print("Done.")
