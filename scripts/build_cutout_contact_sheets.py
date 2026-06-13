from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parent.parent
CUTOUT_DIR = ROOT / "assets" / "derived" / "cutouts"
CONTACT_DIR = ROOT / "assets" / "derived" / "contacts"

CELL_SIZE = 220
PADDING = 20
HEADER_HEIGHT = 60
TEXT_Y = 176


def draw_checkerboard(width: int, height: int, tile: int = 16) -> Image.Image:
    image = Image.new("RGBA", (width, height), (248, 248, 248, 255))
    draw = ImageDraw.Draw(image)
    color_a = (245, 245, 245, 255)
    color_b = (230, 230, 230, 255)

    for y in range(0, height, tile):
        for x in range(0, width, tile):
            color = color_a if ((x // tile) + (y // tile)) % 2 == 0 else color_b
            draw.rectangle((x, y, x + tile, y + tile), fill=color)
    return image


def build_sheet(folder: Path) -> None:
    files = sorted(folder.glob("*.png"))
    if not files:
        return

    columns = 4
    rows = math.ceil(len(files) / columns)
    width = columns * CELL_SIZE + (columns + 1) * PADDING
    height = HEADER_HEIGHT + rows * CELL_SIZE + (rows + 1) * PADDING

    sheet = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    draw = ImageDraw.Draw(sheet)
    draw.rounded_rectangle((10, 10, width - 10, height - 10), radius=24, fill=(255, 255, 255, 255), outline=(225, 225, 225, 255), width=2)
    draw.text((PADDING, 18), folder.name, fill=(48, 48, 48, 255))

    for index, path in enumerate(files):
        col = index % columns
        row = index // columns
        cell_left = PADDING + col * (CELL_SIZE + PADDING)
        cell_top = HEADER_HEIGHT + PADDING + row * (CELL_SIZE + PADDING)

        checker = draw_checkerboard(CELL_SIZE, CELL_SIZE)
        checker_draw = ImageDraw.Draw(checker)
        checker_draw.rounded_rectangle((0, 0, CELL_SIZE - 1, CELL_SIZE - 1), radius=18, outline=(210, 210, 210, 255), width=2)

        with Image.open(path).convert("RGBA") as asset:
            preview = asset.copy()
            preview.thumbnail((CELL_SIZE - 32, CELL_SIZE - 64))
            left = (CELL_SIZE - preview.width) // 2
            top = max(18, (CELL_SIZE - 64 - preview.height) // 2)
            checker.alpha_composite(preview, (left, top))

        label = path.stem.replace(f"{folder.name}__", "")
        checker_draw.text((16, TEXT_Y), label, fill=(60, 60, 60, 255))
        sheet.alpha_composite(checker, (cell_left, cell_top))

    CONTACT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = CONTACT_DIR / f"{folder.name}__contact.png"
    sheet.save(output_path)


def main() -> None:
    for folder in sorted(CUTOUT_DIR.iterdir()):
        if folder.is_dir():
            build_sheet(folder)
    print("Built contact sheets for cutout folders.")


if __name__ == "__main__":
    main()
