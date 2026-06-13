from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path
from statistics import median
from typing import Iterable

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
INPUT_DIR = ROOT / "assets" / "raw" / "sprite-sheets"
OUTPUT_DIR = ROOT / "assets" / "derived" / "cutouts"
INDEX_DIR = ROOT / "assets" / "derived" / "indexes"
CONTACT_DIR = ROOT / "assets" / "derived" / "contacts" / "transparent-sheets"

ROW_THRESHOLD = 8
COL_THRESHOLD = 8
MIN_CROP_AREA = 1_800
PADDING = 16


@dataclass
class CropRecord:
    source_sheet: str
    output_file: str
    width: int
    height: int
    left: int
    top: int
    right: int
    bottom: int


def sample_patch_pixels(image: Image.Image, left: int, top: int, right: int, bottom: int) -> list[tuple[int, int, int]]:
    pixels: list[tuple[int, int, int]] = []
    for y in range(top, bottom):
        for x in range(left, right):
            pixels.append(image.getpixel((x, y))[:3])
    return pixels


def corner_background_samples(image: Image.Image, patch: int = 24) -> list[tuple[int, int, int]]:
    width, height = image.size
    patches = [
        sample_patch_pixels(image, 0, 0, patch, patch),
        sample_patch_pixels(image, width - patch, 0, width, patch),
        sample_patch_pixels(image, 0, height - patch, patch, height),
        sample_patch_pixels(image, width - patch, height - patch, width, height),
    ]
    samples: list[tuple[int, int, int]] = []
    for patch_pixels in patches:
        samples.append(
            (
                int(median(pixel[0] for pixel in patch_pixels)),
                int(median(pixel[1] for pixel in patch_pixels)),
                int(median(pixel[2] for pixel in patch_pixels)),
            )
        )
    return samples


def is_background(rgb: tuple[int, int, int], background_samples: Iterable[tuple[int, int, int]]) -> bool:
    r, g, b = rgb
    if not (r > 120 and b > 120):
        return False
    if g > 170:
        return False

    for sample in background_samples:
        sr, sg, sb = sample
        distance = ((r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2) ** 0.5
        if distance < 95:
            return True
    return False


def build_mask(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    mask = Image.new("L", rgba.size, 0)
    bg_samples = corner_background_samples(rgba)

    width, height = rgba.size
    for y in range(height):
        for x in range(width):
            rgb = rgba.getpixel((x, y))[:3]
            if not is_background(rgb, bg_samples):
                mask.putpixel((x, y), 255)
                r, g, b, _ = rgba.getpixel((x, y))
                rgba.putpixel((x, y), (r, g, b, 255))
            else:
                rgba.putpixel((x, y), (0, 0, 0, 0))

    rgba.info["mask"] = mask
    return rgba


def build_projection_bands(counts: list[int], threshold: int) -> list[tuple[int, int]]:
    bands: list[tuple[int, int]] = []
    start: int | None = None

    for index, count in enumerate(counts):
        if count > threshold and start is None:
            start = index
        elif count <= threshold and start is not None:
            bands.append((start, index))
            start = None

    if start is not None:
        bands.append((start, len(counts)))

    return bands


def crop_bbox_from_mask(mask: Image.Image, left: int, top: int, right: int, bottom: int) -> tuple[int, int, int, int] | None:
    sub = mask.crop((left, top, right, bottom))
    bbox = sub.getbbox()
    if bbox is None:
        return None
    return (left + bbox[0], top + bbox[1], left + bbox[2], top + bbox[3])


def extract_sheet(sheet_path: Path) -> list[CropRecord]:
    image = Image.open(sheet_path)
    rgba = build_mask(image)
    mask: Image.Image = rgba.info["mask"]

    width, height = rgba.size
    row_counts = [0] * height
    col_counts = [0] * width

    for y in range(height):
        row_total = 0
        for x in range(width):
            if mask.getpixel((x, y)) > 0:
                row_total += 1
                col_counts[x] += 1
        row_counts[y] = row_total

    row_bands = build_projection_bands(row_counts, ROW_THRESHOLD)
    sheet_output_dir = OUTPUT_DIR / sheet_path.stem
    sheet_output_dir.mkdir(parents=True, exist_ok=True)

    records: list[CropRecord] = []
    sequence = 1

    for row_top, row_bottom in row_bands:
        row_mask = mask.crop((0, row_top, width, row_bottom))
        row_col_counts = [0] * width
        for x in range(width):
            col_total = 0
            for y in range(row_bottom - row_top):
                if row_mask.getpixel((x, y)) > 0:
                    col_total += 1
            row_col_counts[x] = col_total

        col_bands = build_projection_bands(row_col_counts, COL_THRESHOLD)

        for col_left, col_right in col_bands:
            bbox = crop_bbox_from_mask(mask, col_left, row_top, col_right, row_bottom)
            if bbox is None:
                continue

            left, top, right, bottom = bbox
            crop_width = right - left
            crop_height = bottom - top
            if crop_width * crop_height < MIN_CROP_AREA:
                continue

            padded_left = max(left - PADDING, 0)
            padded_top = max(top - PADDING, 0)
            padded_right = min(right + PADDING, width)
            padded_bottom = min(bottom + PADDING, height)

            asset = rgba.crop((padded_left, padded_top, padded_right, padded_bottom))
            output_name = f"{sheet_path.stem}__{sequence:02d}.png"
            output_path = sheet_output_dir / output_name
            asset.save(output_path)

            records.append(
                CropRecord(
                    source_sheet=sheet_path.name,
                    output_file=str(output_path.relative_to(ROOT)).replace("\\", "/"),
                    width=asset.width,
                    height=asset.height,
                    left=padded_left,
                    top=padded_top,
                    right=padded_right,
                    bottom=padded_bottom,
                )
            )
            sequence += 1

    transparent_sheet = CONTACT_DIR / f"{sheet_path.stem}__transparent.png"
    rgba.save(transparent_sheet)
    return records


def write_records(records: list[CropRecord]) -> None:
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    csv_path = INDEX_DIR / "sprite-sheet-cutouts.csv"
    with csv_path.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=[
                "source_sheet",
                "output_file",
                "width",
                "height",
                "left",
                "top",
                "right",
                "bottom",
            ],
        )
        writer.writeheader()
        for record in records:
            writer.writerow(record.__dict__)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    CONTACT_DIR.mkdir(parents=True, exist_ok=True)

    all_records: list[CropRecord] = []
    for sheet_path in sorted(INPUT_DIR.glob("*.png")):
        all_records.extend(extract_sheet(sheet_path))

    write_records(all_records)
    print(f"Extracted {len(all_records)} cutouts from {len(list(INPUT_DIR.glob('*.png')))} sprite sheets.")


if __name__ == "__main__":
    main()
