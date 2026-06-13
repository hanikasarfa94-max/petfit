from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = ROOT / "assets"
OUTPUT_DIR = ROOT / "assets" / "derived" / "indexes"
SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def detect_bucket(path: Path) -> str:
    rel = path.relative_to(ASSETS_DIR).as_posix()
    if rel.startswith("raw/boards/"):
        return "board"
    if rel.startswith("raw/mockups/"):
        return "mockup"
    if rel.startswith("raw/sprite-sheets/"):
        return "sprite_sheet"
    if rel.startswith("derived/cutouts/"):
        return "cutout"
    if rel.startswith("derived/named/"):
        return "named"
    if rel.startswith("derived/contacts/"):
        return "contact"
    return "other"


def detect_family(path: Path) -> str:
    rel = path.relative_to(ASSETS_DIR).as_posix()
    if rel.startswith("derived/named/"):
        parts = rel.split("/")
        if len(parts) >= 3:
            return parts[2]
    if "buding" in rel:
        return "character"
    if "object" in rel or "bottle" in rel or "bowl" in rel or "cushion" in rel:
        return "object"
    if "drink" in rel:
        return "drink"
    if "food" in rel:
        return "food"
    if "icon" in rel or "ui-" in rel:
        return "ui"
    if "mockups" in rel:
        return "page_reference"
    if "boards" in rel:
        return "overview_reference"
    return "unclassified"


def gather_assets() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for path in sorted(ASSETS_DIR.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue

        with Image.open(path) as image:
            width, height = image.size

        rel_path = path.relative_to(ROOT).as_posix()
        rows.append(
            {
                "path": rel_path,
                "file_name": path.name,
                "stem": path.stem,
                "extension": path.suffix.lower(),
                "bucket": detect_bucket(path),
                "family": detect_family(path),
                "width": width,
                "height": height,
                "status": "raw" if "raw/" in rel_path else "derived",
            }
        )
    return rows


def write_csv(rows: list[dict[str, object]], path: Path) -> None:
    if not rows:
        return
    with path.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def write_json(rows: list[dict[str, object]], path: Path) -> None:
    with path.open("w", encoding="utf-8") as file:
        json.dump(rows, file, ensure_ascii=False, indent=2)


def write_markdown(rows: list[dict[str, object]], path: Path) -> None:
    bucket_counter = Counter(row["bucket"] for row in rows)
    family_counter = Counter(row["family"] for row in rows)

    lines = [
        "# Asset Index",
        "",
        f"- Total Files: {len(rows)}",
        "",
        "## By Bucket",
        "",
    ]
    for bucket, count in sorted(bucket_counter.items()):
        lines.append(f"- `{bucket}`: {count}")

    lines.extend(["", "## By Family", ""])
    for family, count in sorted(family_counter.items()):
        lines.append(f"- `{family}`: {count}")

    lines.extend(["", "## Files", "", "| Bucket | Family | Size | Path |", "| --- | --- | --- | --- |"])
    for row in rows:
        size = f'{row["width"]}x{row["height"]}'
        lines.append(f'| {row["bucket"]} | {row["family"]} | {size} | `{row["path"]}` |')

    path.write_text("\n".join(lines), encoding="utf-8")


def write_label_template(rows: list[dict[str, object]], path: Path) -> None:
    cutouts = [row for row in rows if row["bucket"] == "cutout" and row["path"].endswith(".png")]
    with path.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=[
                "path",
                "current_stem",
                "proposed_name",
                "category",
                "subtype",
                "usage",
                "review_status",
                "notes",
            ],
        )
        writer.writeheader()
        for row in cutouts:
            writer.writerow(
                {
                    "path": row["path"],
                    "current_stem": row["stem"],
                    "proposed_name": "",
                    "category": "",
                    "subtype": "",
                    "usage": "",
                    "review_status": "todo",
                    "notes": "",
                }
            )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = gather_assets()

    write_csv(rows, OUTPUT_DIR / "asset-index.csv")
    write_json(rows, OUTPUT_DIR / "asset-index.json")
    write_markdown(rows, OUTPUT_DIR / "asset-index.md")
    write_label_template(rows, OUTPUT_DIR / "cutout-label-template.csv")

    print(f"Indexed {len(rows)} asset files.")


if __name__ == "__main__":
    main()
