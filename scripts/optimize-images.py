from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "public" / "images"
RESPONSIVE = IMAGES / "responsive"


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

for source_path in IMAGES.rglob("*"):
    if (
        not source_path.is_file()
        or RESPONSIVE in source_path.parents
        or source_path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}
        or source_path.name == "benett-cover.webp"
        or source_path.name.startswith("benett-cover-")
        or "interieurs" in source_path.parts
    ):
        continue

    relative = source_path.relative_to(IMAGES)
    output_directory = RESPONSIVE / relative.parent
    output_directory.mkdir(parents=True, exist_ok=True)

    with Image.open(source_path) as source:
        converted = source.convert("RGB")
        for width in (480, 640, 960):
            output = resize_to_width(converted, width)
            output.save(
                output_directory / f"{source_path.stem}-{width}.webp",
                "WEBP",
                quality=78 if width == 480 else 80 if width == 640 else 82,
                method=6,
            )

print("Responsive cover, gallery images, logo and Plénitude image optimized.")
