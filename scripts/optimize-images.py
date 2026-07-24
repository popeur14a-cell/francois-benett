from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "public" / "images"


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    if image.width <= width:
        return image.copy()
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


with Image.open(IMAGES / "benett-cover.webp") as source:
    cover = source.convert("RGB")
    for width in (640, 960, 1280, 1920):
        output = resize_to_width(cover, width)
        output.save(
            IMAGES / f"benett-cover-{width}.webp",
            "WEBP",
            quality=82 if width == 1920 else 80,
            method=6,
        )

with Image.open(ROOT / "public" / "logo-b.png") as source:
    logo = resize_to_width(source.convert("RGBA"), 256)
    logo.save(ROOT / "public" / "logo-b.png", "PNG", optimize=True, compress_level=9)

with Image.open(IMAGES / "venise" / "plenitude.jpg") as source:
    if source.width > 2400:
        plenitude = resize_to_width(source.convert("RGB"), 2400)
        plenitude.save(
            IMAGES / "venise" / "plenitude.jpg",
            "JPEG",
            quality=86,
            optimize=True,
            progressive=True,
        )

print("Responsive cover, logo and Plénitude image optimized.")
