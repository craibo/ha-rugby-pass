"""Generate the Rugby Team Tracker brand icons (original artwork).

Requires Pillow (``pip install Pillow``). Run from the repository root:

    python scripts/make_icon.py

Writes custom_components/rugby_team_tracker/brand/icon.png (256x256) and
icon@2x.png (512x512). Drawn at 4x and downscaled with LANCZOS.
"""

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "custom_components" / "rugby_team_tracker" / "brand"
SS = 4  # supersampling factor
BASE = 512

GREEN_TOP = (27, 94, 58)
GREEN_BOT = (46, 139, 87)
CREAM = (250, 244, 228)
SEAM = (60, 90, 70)
AMBER = (245, 183, 0)
AMBER_DARK = (150, 100, 0)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def render(size):
    s = size * SS
    k = s / BASE  # scale from the 512 design grid

    def p(v):
        return v * k

    # Background: vertical gradient clipped to a rounded square.
    bg = Image.new("RGBA", (s, s))
    d = ImageDraw.Draw(bg)
    for y in range(s):
        d.line([(0, y), (s, y)], fill=lerp(GREEN_TOP, GREEN_BOT, y / (s - 1)) + (255,))
    mask = Image.new("L", (s, s), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, s - 1, s - 1], radius=p(96), fill=255)
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    img.paste(bg, (0, 0), mask)

    # Ball layer: a pointed oval drawn upright, then rotated.
    L = int(p(400))
    W = int(p(268))
    layer_size = int(p(460))
    ball = Image.new("RGBA", (layer_size, layer_size), (0, 0, 0, 0))
    cx = cy = layer_size / 2
    # Pointed-oval outline: x along the long axis, half-width tapering to tips.
    pts = []
    n = 240
    for i in range(n + 1):
        t = -1 + 2 * i / n
        hw = (W / 2) * (1 - abs(t) ** 2.0) ** 0.62
        pts.append((cx + t * L / 2, cy - hw))
    for i in range(n, -1, -1):
        t = -1 + 2 * i / n
        hw = (W / 2) * (1 - abs(t) ** 2.0) ** 0.62
        pts.append((cx + t * L / 2, cy + hw))
    # Soft shadow.
    shadow = Image.new("RGBA", ball.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).polygon([(x + p(6), y + p(10)) for x, y in pts], fill=(0, 30, 15, 110))
    ball = Image.alpha_composite(ball, shadow)
    bd = ImageDraw.Draw(ball)
    bd.polygon(pts, fill=CREAM + (255,))
    # Outline.
    bd.line(pts + [pts[0]], fill=SEAM + (255,), width=int(p(7)), joint="curve")
    # Three long seams between the two tips: a straight centre seam and two
    # curves bowing outwards, so the ball reads as four panels.
    lw = int(p(7))
    half = L / 2
    for bow in (-1, 0, 1):
        seam = []
        for j in range(81):
            t = -1 + 2 * j / 80
            hw = (W / 2) * (1 - abs(t) ** 2.0) ** 0.62
            seam.append((cx + t * half * 0.97, cy + bow * hw * 0.52))
        bd.line(seam, fill=SEAM + (255,), width=lw, joint="curve")
    # Short stitch ticks across the centre seam.
    for i in range(5):
        x = cx + (i - 2) * L * 0.075
        bd.line([(x, cy - p(11)), (x, cy + p(11))], fill=SEAM + (255,), width=int(p(5)))
    ball = ball.rotate(35, resample=Image.BICUBIC)
    # Keep the ball inside the rounded square.
    pos = (int(s / 2 - layer_size / 2 - p(30)), int(s / 2 - layer_size / 2 + p(38)))
    img.alpha_composite(ball, pos)

    # Tracker mark: a map pin with a ring, top right, in amber.
    pin = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pin)
    px, py, r = p(398), p(122), p(56)
    tip = (px, py + r * 2.0)
    ang = math.asin(r / (r * 2.0))
    # Teardrop = circle + triangle to the tip.
    base_a = (px - r * math.cos(ang), py + r * math.sin(ang))
    base_b = (px + r * math.cos(ang), py + r * math.sin(ang))
    # Shadow.
    sh = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    o = p(5)
    sd.ellipse([px - r + o, py - r + o * 1.6, px + r + o, py + r + o * 1.6], fill=(0, 30, 15, 120))
    sd.polygon([(base_a[0] + o, base_a[1] + o * 1.6), (base_b[0] + o, base_b[1] + o * 1.6), (tip[0] + o, tip[1] + o * 1.6)], fill=(0, 30, 15, 120))
    img.alpha_composite(sh)
    pd.ellipse([px - r, py - r, px + r, py + r], fill=AMBER + (255,))
    pd.polygon([base_a, base_b, tip], fill=AMBER + (255,))
    pd.ellipse([px - r * 0.42, py - r * 0.42, px + r * 0.42, py + r * 0.42], fill=GREEN_TOP + (255,))
    pd.ellipse([px - r * 0.2, py - r * 0.2, px + r * 0.2, py + r * 0.2], fill=AMBER + (255,))
    img.alpha_composite(pin)

    return img.resize((size, size), Image.LANCZOS)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    render(256).save(OUT / "icon.png", optimize=True)
    render(512).save(OUT / "icon@2x.png", optimize=True)
    print("wrote", OUT / "icon.png", OUT / "icon@2x.png")


if __name__ == "__main__":
    main()
