from __future__ import annotations

import csv
import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CUTOUT_DIR = ROOT / "assets" / "derived" / "cutouts"
NAMED_DIR = ROOT / "assets" / "derived" / "named"
INDEX_DIR = ROOT / "assets" / "derived" / "indexes"


def entries_for(sheet: str, rows: list[tuple[str, str, str, str, str]]) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    for index, row in enumerate(rows, start=1):
        proposed_name, category, subtype, usage, notes = row
        entries.append(
            {
                "sheet": sheet,
                "index": f"{index:02d}",
                "proposed_name": proposed_name,
                "category": category,
                "subtype": subtype,
                "usage": usage,
                "notes": notes,
            }
        )
    return entries


SEMANTIC_ENTRIES = (
    entries_for(
        "buding-character-states-v1",
        [
            ("character_buding_idle_front", "character", "primary_state", "core mascot default idle pose", ""),
            ("character_buding_walk_left", "character", "primary_state", "core mascot side-walk pose", ""),
            ("character_buding_turn_right", "character", "primary_state", "core mascot right-facing turn pose", ""),
            ("character_buding_wave", "character", "primary_state", "welcome, success, greeting", ""),
            ("character_buding_smile", "character", "primary_state", "happy idle alternative", ""),
            ("character_buding_celebrate", "character", "primary_state", "save success or celebration", ""),
            ("character_buding_worried", "character", "primary_state", "light reminder or concern state", ""),
            ("character_buding_yawn_sleepy", "character", "primary_state", "rest prompt or drowsy reminder", ""),
            ("character_buding_drink_water", "character", "primary_state", "drinking feedback", ""),
            ("character_buding_eat_strawberry", "character", "primary_state", "eating feedback", ""),
            ("character_buding_stretch", "character", "primary_state", "rest completion feedback", ""),
            ("character_buding_sleep_curl", "character", "primary_state", "resting or sleep state", ""),
        ],
    )
    + entries_for(
        "core-objects-and-badges-v1",
        [
            ("object_bowl_empty", "object", "bowl_state", "bowl empty state", ""),
            ("object_bowl_light_fruit", "object", "bowl_state", "bowl light content state", ""),
            ("object_bowl_light_fruit_snack", "object", "bowl_state", "bowl slightly richer content state", ""),
            ("object_bowl_full_fruit_salad", "object", "bowl_state", "bowl full content state", ""),
            ("object_bowl_overflow_plus_n", "object", "bowl_state", "bowl overflow state with +N badge", ""),
            ("object_bottle_empty", "object", "bottle_state", "bottle empty state", ""),
            ("object_bottle_water_low", "object", "bottle_state", "bottle low water state", ""),
            ("object_bottle_water_mid", "object", "bottle_state", "bottle mid water state", ""),
            ("object_bottle_water_high", "object", "bottle_state", "bottle high water state", ""),
            ("object_bottle_water_full", "object", "bottle_state", "bottle full water state", ""),
            ("object_bottle_water_full_drop_badge", "object", "bottle_state", "bottle full state with drop badge", "crop includes attached badge"),
            ("object_bottle_water_full_hydration_tag", "object", "bottle_state", "bottle full state with hydration tag", ""),
            ("object_cushion_idle_flat", "object", "cushion_state", "cushion idle flat state", ""),
            ("object_cushion_used_soft", "object", "cushion_state", "cushion used soft state", ""),
            ("object_cushion_resting_with_buding", "object", "cushion_state", "cushion active rest state with mascot", ""),
            ("object_cushion_finished_plush", "object", "cushion_state", "cushion fluffed completion state", ""),
            ("badge_count_plus_1", "badge", "count_badge", "count badge for stacked bowl items", ""),
            ("badge_count_plus_3", "badge", "count_badge", "count badge for stacked bowl items", ""),
            ("badge_count_plus_5", "badge", "count_badge", "count badge for stacked bowl items", ""),
            ("badge_count_plus_10", "badge", "count_badge", "count badge for stacked bowl items", ""),
            ("badge_token_1", "badge", "token_badge", "numeric token", ""),
            ("badge_token_5", "badge", "token_badge", "numeric token", ""),
            ("badge_token_10", "badge", "token_badge", "numeric token", ""),
            ("badge_token_20", "badge", "token_badge", "numeric token", ""),
            ("badge_token_50", "badge", "token_badge", "numeric token", ""),
            ("effect_ring_highlight", "effect", "highlight_ring", "glow or focus ring", ""),
        ],
    )
    + entries_for(
        "food-stickers-staples-protein-veg-v1",
        [
            ("sticker_food_rice_bowl", "sticker_food", "staple", "primary food sticker", ""),
            ("sticker_food_ramen_bowl", "sticker_food", "staple", "primary food sticker", ""),
            ("sticker_food_bread_loaf", "sticker_food", "staple", "primary food sticker", ""),
            ("sticker_food_sandwich_triangle", "sticker_food", "staple", "primary food sticker", ""),
            ("sticker_food_bao_bun", "sticker_food", "staple", "primary food sticker", ""),
            ("sticker_food_soup_dumplings_basket", "sticker_food", "staple", "primary food sticker", ""),
            ("sticker_food_siu_mai_basket", "sticker_food", "staple", "primary food sticker", ""),
            ("sticker_food_congee_bowl", "sticker_food", "staple", "primary food sticker", ""),
            ("sticker_food_onigiri", "sticker_food", "staple", "primary food sticker", ""),
            ("sticker_food_roast_chicken_leg", "sticker_food", "protein", "primary food sticker", ""),
            ("sticker_food_sliced_chicken_breast", "sticker_food", "protein", "primary food sticker", ""),
            ("sticker_food_beef_steak", "sticker_food", "protein", "primary food sticker", ""),
            ("sticker_food_salmon_fillet", "sticker_food", "protein", "primary food sticker", ""),
            ("sticker_food_shrimp", "sticker_food", "protein", "primary food sticker", ""),
            ("sticker_food_fried_egg", "sticker_food", "protein", "primary food sticker", ""),
            ("sticker_food_veggie_assortment", "sticker_food", "vegetable_combo", "mixed veg crop from source sheet", "merged crop: tofu, salad, carrot"),
            ("sticker_food_broccoli", "sticker_food", "vegetable", "primary food sticker", ""),
            ("sticker_food_tomato", "sticker_food", "vegetable", "primary food sticker", ""),
            ("sticker_food_cucumber", "sticker_food", "vegetable", "primary food sticker", ""),
        ],
    )
    + entries_for(
        "food-stickers-fruit-snacks-combos-v1",
        [
            ("sticker_food_strawberry", "sticker_food", "fruit", "primary food sticker", ""),
            ("sticker_food_apple", "sticker_food", "fruit", "primary food sticker", ""),
            ("sticker_food_banana", "sticker_food", "fruit", "primary food sticker", ""),
            ("sticker_food_orange", "sticker_food", "fruit", "primary food sticker", ""),
            ("sticker_food_blueberries", "sticker_food", "fruit", "primary food sticker", ""),
            ("sticker_food_kiwi", "sticker_food", "fruit", "primary food sticker", ""),
            ("sticker_food_grapes", "sticker_food", "fruit", "primary food sticker", ""),
            ("sticker_food_cookie", "sticker_food", "snack", "secondary food sticker", ""),
            ("sticker_food_strawberry_cake", "sticker_food", "dessert", "secondary food sticker", ""),
            ("sticker_food_strawberry_ice_cream", "sticker_food", "dessert", "secondary food sticker", ""),
            ("sticker_food_chocolate_bar", "sticker_food", "dessert", "secondary food sticker", ""),
            ("sticker_food_donut", "sticker_food", "dessert", "secondary food sticker", ""),
            ("sticker_food_potato_chips", "sticker_food", "snack", "secondary food sticker", ""),
            ("sticker_food_burger", "sticker_food", "fast_food", "primary food sticker", ""),
            ("sticker_food_fried_chicken", "sticker_food", "fast_food", "primary food sticker", ""),
            ("sticker_food_french_fries", "sticker_food", "fast_food", "secondary food sticker", ""),
            ("sticker_food_pizza_slice", "sticker_food", "fast_food", "primary food sticker", ""),
            ("sticker_food_breakfast_plate", "sticker_food", "combo_meal", "combo meal sticker", ""),
            ("sticker_food_salad_bowl", "sticker_food", "combo_meal", "combo meal sticker", ""),
            ("sticker_food_combo_assorted_meals", "sticker_food", "combo_meal", "small assorted meal set", "merged crop of multiple mini combos"),
            ("sticker_food_combo_burger_fries_cola", "sticker_food", "combo_meal", "combo meal sticker", ""),
        ],
    )
    + entries_for(
        "drink-stickers-and-status-tags-v1",
        [
            ("sticker_drink_water_bottle", "sticker_drink", "water", "drink sticker", ""),
            ("sticker_drink_green_tea_bottle", "sticker_drink", "tea", "drink sticker", ""),
            ("sticker_drink_coffee_cup", "sticker_drink", "coffee", "drink sticker", ""),
            ("sticker_drink_milk_bottle", "sticker_drink", "milk", "drink sticker", ""),
            ("sticker_drink_yogurt_bottle", "sticker_drink", "yogurt", "drink sticker", ""),
            ("sticker_drink_soy_milk_bottle", "sticker_drink", "soy_milk", "drink sticker", ""),
            ("sticker_drink_orange_juice_bottle", "sticker_drink", "juice", "drink sticker", ""),
            ("sticker_drink_milk_tea_cup", "sticker_drink", "milk_tea", "drink sticker", ""),
            ("sticker_drink_cola_bottle", "sticker_drink", "cola", "drink sticker", ""),
            ("sticker_drink_sparkling_water_bottle", "sticker_drink", "sparkling_water", "drink sticker", ""),
            ("tag_drink_sweet", "tag", "drink_tag", "status tag for sweet drinks", ""),
            ("tag_drink_sugar_free", "tag", "drink_tag", "status tag for sugar free drinks", ""),
            ("tag_drink_low_sugar", "tag", "drink_tag", "status tag for low sugar drinks", ""),
            ("tag_drink_caffeinated", "tag", "drink_tag", "status tag for caffeinated drinks", ""),
            ("effect_bubble_iridescent", "effect", "bubble", "ambient decorative bubble", ""),
            ("effect_bubble_cluster_blue", "effect", "bubble", "ambient decorative bubble cluster", ""),
            ("effect_bubble_cluster_pink", "effect", "bubble", "ambient decorative bubble cluster", ""),
            ("effect_sparkle_pair", "effect", "sparkle", "ambient decorative sparkle pair", ""),
            ("icon_status_hydration_drop", "icon", "status_icon", "small status icon", ""),
            ("icon_status_leaf", "icon", "status_icon", "small status icon", ""),
            ("icon_status_heart", "icon", "status_icon", "small status icon", ""),
            ("icon_status_energy", "icon", "status_icon", "small status icon", ""),
        ],
    )
    + entries_for(
        "ui-icons-effects-and-secondary-states-v1",
        [
            ("effect_sparkle_cluster_small", "effect", "sparkle", "ambient decorative sparkle cluster", ""),
            ("effect_sparkle_cluster_medium", "effect", "sparkle", "ambient decorative sparkle cluster", ""),
            ("effect_starburst_large", "effect", "sparkle", "ambient decorative starburst", ""),
            ("effect_sun_glow", "effect", "celestial", "ambient decorative sun glow", ""),
            ("effect_star_single", "effect", "sparkle", "ambient decorative star", ""),
            ("effect_moon_sleep", "effect", "celestial", "rest context icon", ""),
            ("effect_sleep_zzz", "effect", "sleep", "rest context decoration", ""),
            ("effect_water_drop_pair", "effect", "water", "water decoration", ""),
            ("effect_water_ripple_drop", "effect", "water", "water decoration", ""),
            ("effect_water_splash", "effect", "water", "water decoration", ""),
            ("effect_trail_strawberry", "effect", "trail", "character motion trail", ""),
            ("effect_trail_bottle", "effect", "trail", "object motion trail", ""),
            ("effect_loading_dots_vertical_magenta", "effect", "loading", "loading or pager dots", ""),
            ("effect_loading_dots_diagonal_magenta", "effect", "loading", "loading or pager dots", ""),
            ("effect_loading_dots_vertical_pink", "effect", "loading", "loading or pager dots", ""),
            ("effect_loading_dots_grid_nine", "effect", "loading", "loading or pager dots", ""),
            ("effect_loading_dots_column_soft", "effect", "loading", "loading or pager dots", ""),
            ("effect_loading_dots_column_soft_alt", "effect", "loading", "loading or pager dots", ""),
            ("icon_action_camera", "icon", "action_icon", "primary action icon", ""),
            ("icon_action_water", "icon", "action_icon", "primary action icon", ""),
            ("icon_action_drink", "icon", "action_icon", "primary action icon", ""),
            ("icon_action_rest", "icon", "action_icon", "primary action icon", ""),
            ("icon_action_settings", "icon", "action_icon", "settings icon", ""),
            ("icon_navigation_back", "icon", "navigation_icon", "back navigation icon", ""),
            ("icon_action_more", "icon", "action_icon", "more action icon", ""),
            ("icon_navigation_stats", "icon", "navigation_icon", "stats navigation icon", ""),
            ("icon_navigation_calendar", "icon", "navigation_icon", "calendar icon", ""),
            ("icon_action_edit", "icon", "action_icon", "edit action icon", ""),
            ("icon_action_delete", "icon", "action_icon", "delete action icon", ""),
            ("icon_action_confirm", "icon", "action_icon", "confirm action icon", ""),
            ("icon_action_refresh", "icon", "action_icon", "refresh action icon", ""),
            ("character_buding_hungry_empty_bowl", "character", "secondary_state", "empty bowl state illustration", ""),
            ("character_buding_thirsty_empty_bottle", "character", "secondary_state", "empty bottle state illustration", ""),
            ("character_buding_sleeping_blue_cushion", "character", "secondary_state", "rest state illustration", ""),
            ("character_buding_memory_photo", "character", "secondary_state", "memory page illustration", ""),
            ("character_buding_confused", "character", "secondary_state", "unrecognized or uncertain state", ""),
            ("character_buding_camera_permission_blocked", "character", "secondary_state", "permission error illustration", ""),
            ("effect_refresh_arc_blue", "effect", "refresh", "refresh animation arc", "partial arc effect crop"),
            ("character_buding_sync_turnaround", "character", "secondary_state", "sync or refresh state illustration", ""),
            ("character_buding_success_wave", "character", "secondary_state", "success or greeting illustration", ""),
        ],
    )
)


RECOGNITION_MAPPINGS = [
    ("rice", "米饭,白米饭,rice,steamed rice", "米饭", "sticker_food_rice_bowl", "food", "staple", "bowl", "", "1"),
    ("ramen", "拉面,面条,ramen,noodles", "拉面", "sticker_food_ramen_bowl", "food", "staple", "bowl", "", "1"),
    ("bread", "面包,吐司,bread,toast loaf", "面包", "sticker_food_bread_loaf", "food", "staple", "bowl", "", "2"),
    ("sandwich", "三明治,sandwich", "三明治", "sticker_food_sandwich_triangle", "food", "staple", "bowl", "", "2"),
    ("bao", "包子,bao,steamed bun", "包子", "sticker_food_bao_bun", "food", "staple", "bowl", "", "2"),
    ("dumplings", "小笼包,汤包,soup dumplings,xiaolongbao", "小笼包", "sticker_food_soup_dumplings_basket", "food", "staple", "bowl", "", "2"),
    ("siu_mai", "烧卖,siu mai,shumai", "烧卖", "sticker_food_siu_mai_basket", "food", "staple", "bowl", "", "2"),
    ("congee", "粥,congee,porridge", "粥", "sticker_food_congee_bowl", "food", "staple", "bowl", "", "2"),
    ("onigiri", "饭团,onigiri,rice ball", "饭团", "sticker_food_onigiri", "food", "staple", "bowl", "", "2"),
    ("chicken_leg", "鸡腿,炸鸡腿,roast chicken leg,chicken drumstick", "鸡腿", "sticker_food_roast_chicken_leg", "food", "protein", "bowl", "", "1"),
    ("chicken_breast", "鸡胸肉,chicken breast,sliced chicken", "鸡胸肉", "sticker_food_sliced_chicken_breast", "food", "protein", "bowl", "", "1"),
    ("beef", "牛排,牛肉,beef,steak", "牛排", "sticker_food_beef_steak", "food", "protein", "bowl", "", "1"),
    ("salmon", "三文鱼,鲑鱼,salmon", "三文鱼", "sticker_food_salmon_fillet", "food", "protein", "bowl", "", "1"),
    ("shrimp", "虾,shrimp,prawn", "虾", "sticker_food_shrimp", "food", "protein", "bowl", "", "1"),
    ("fried_egg", "煎蛋,鸡蛋,fried egg,sunny side up", "煎蛋", "sticker_food_fried_egg", "food", "protein", "bowl", "", "2"),
    ("broccoli", "西兰花,broccoli", "西兰花", "sticker_food_broccoli", "food", "vegetable", "bowl", "", "3"),
    ("tomato", "番茄,西红柿,tomato", "番茄", "sticker_food_tomato", "food", "vegetable", "bowl", "", "3"),
    ("cucumber", "黄瓜,cucumber", "黄瓜", "sticker_food_cucumber", "food", "vegetable", "bowl", "", "3"),
    ("salad", "沙拉,蔬菜沙拉,salad", "沙拉拼盘", "sticker_food_salad_bowl", "food", "combo_meal", "bowl", "", "2"),
    ("veggie_assortment", "蔬菜拼盘,豆腐沙拉,vegetable mix", "蔬菜拼盘", "sticker_food_veggie_assortment", "food", "vegetable_combo", "bowl", "", "3"),
    ("strawberry", "草莓,strawberry", "草莓", "sticker_food_strawberry", "food", "fruit", "bowl", "", "3"),
    ("apple", "苹果,apple", "苹果", "sticker_food_apple", "food", "fruit", "bowl", "", "3"),
    ("banana", "香蕉,banana", "香蕉", "sticker_food_banana", "food", "fruit", "bowl", "", "3"),
    ("orange", "橙子,橘子,orange", "橙子", "sticker_food_orange", "food", "fruit", "bowl", "", "3"),
    ("blueberries", "蓝莓,blueberries,blueberry", "蓝莓", "sticker_food_blueberries", "food", "fruit", "bowl", "", "3"),
    ("kiwi", "猕猴桃,kiwi", "猕猴桃", "sticker_food_kiwi", "food", "fruit", "bowl", "", "3"),
    ("grapes", "葡萄,grapes,grape", "葡萄", "sticker_food_grapes", "food", "fruit", "bowl", "", "3"),
    ("cookie", "曲奇,饼干,cookie,biscuit", "饼干", "sticker_food_cookie", "food", "snack", "bowl", "", "4"),
    ("cake", "蛋糕,cake,strawberry cake", "蛋糕", "sticker_food_strawberry_cake", "food", "dessert", "bowl", "", "4"),
    ("ice_cream", "冰淇淋,ice cream", "冰淇淋", "sticker_food_strawberry_ice_cream", "food", "dessert", "bowl", "", "4"),
    ("chocolate", "巧克力,chocolate bar", "巧克力", "sticker_food_chocolate_bar", "food", "dessert", "bowl", "", "4"),
    ("donut", "甜甜圈,donut,doughnut", "甜甜圈", "sticker_food_donut", "food", "dessert", "bowl", "", "4"),
    ("chips", "薯片,potato chips,crisps", "薯片", "sticker_food_potato_chips", "food", "snack", "bowl", "", "4"),
    ("burger", "汉堡,burger,hamburger", "汉堡", "sticker_food_burger", "food", "fast_food", "bowl", "", "2"),
    ("fried_chicken", "炸鸡,fried chicken", "炸鸡", "sticker_food_fried_chicken", "food", "fast_food", "bowl", "", "2"),
    ("fries", "薯条,french fries,fries", "薯条", "sticker_food_french_fries", "food", "fast_food", "bowl", "", "4"),
    ("pizza", "披萨,pizza", "披萨", "sticker_food_pizza_slice", "food", "fast_food", "bowl", "", "2"),
    ("breakfast_plate", "早餐,早餐盘,breakfast plate", "早餐盘", "sticker_food_breakfast_plate", "food", "combo_meal", "bowl", "", "2"),
    ("bento", "便当,bento,lunch box", "便当", "sticker_food_combo_assorted_meals", "food", "combo_meal", "bowl", "", "2"),
    ("combo_meal", "套餐,组合餐,combo meal,meal set", "组合餐", "sticker_food_combo_assorted_meals", "food", "combo_meal", "bowl", "", "2"),
    ("burger_combo", "汉堡套餐,burger combo,fast food combo", "汉堡套餐", "sticker_food_combo_burger_fries_cola", "food", "combo_meal", "bowl", "", "2"),
    ("water", "水,白水,矿泉水,water", "水", "sticker_drink_water_bottle", "drink", "water", "bottle", "", "1"),
    ("green_tea", "绿茶,green tea,tea", "绿茶", "sticker_drink_green_tea_bottle", "drink", "tea", "bottle", "", "2"),
    ("coffee", "咖啡,coffee", "咖啡", "sticker_drink_coffee_cup", "drink", "coffee", "bottle", "tag_drink_caffeinated", "2"),
    ("milk", "牛奶,milk", "牛奶", "sticker_drink_milk_bottle", "drink", "milk", "bottle", "", "2"),
    ("yogurt", "酸奶,yogurt", "酸奶", "sticker_drink_yogurt_bottle", "drink", "yogurt", "bottle", "", "2"),
    ("soy_milk", "豆浆,soy milk", "豆浆", "sticker_drink_soy_milk_bottle", "drink", "soy_milk", "bottle", "", "2"),
    ("orange_juice", "橙汁,果汁,orange juice,juice", "橙汁", "sticker_drink_orange_juice_bottle", "drink", "juice", "bottle", "tag_drink_sweet", "2"),
    ("milk_tea", "奶茶,milk tea,boba,bubble tea", "奶茶", "sticker_drink_milk_tea_cup", "drink", "milk_tea", "bottle", "tag_drink_sweet", "1"),
    ("cola", "可乐,cola,coke,soda", "可乐", "sticker_drink_cola_bottle", "drink", "cola", "bottle", "tag_drink_sweet", "1"),
    ("sparkling_water", "气泡水,sparkling water,soda water", "气泡水", "sticker_drink_sparkling_water_bottle", "drink", "sparkling_water", "bottle", "", "2"),
]


def named_bucket_for(category: str) -> str:
    mapping = {
        "character": "character",
        "object": "object",
        "badge": "badge",
        "sticker_food": "sticker-food",
        "sticker_drink": "sticker-drink",
        "tag": "tag",
        "effect": "effect",
        "icon": "icon",
    }
    return mapping[category]


def build_manifest() -> list[dict[str, str]]:
    manifest: list[dict[str, str]] = []
    for entry in SEMANTIC_ENTRIES:
        sheet = entry["sheet"]
        index = entry["index"]
        source_path = CUTOUT_DIR / sheet / f"{sheet}__{index}.png"
        if not source_path.exists():
            raise FileNotFoundError(source_path)

        bucket = named_bucket_for(entry["category"])
        named_path = NAMED_DIR / bucket / f'{entry["proposed_name"]}.png'

        manifest.append(
            {
                "source_path": str(source_path.relative_to(ROOT)).replace("\\", "/"),
                "current_stem": f"{sheet}__{index}",
                "proposed_name": entry["proposed_name"],
                "category": entry["category"],
                "subtype": entry["subtype"],
                "named_bucket": bucket,
                "named_path": str(named_path.relative_to(ROOT)).replace("\\", "/"),
                "usage": entry["usage"],
                "review_status": "seeded",
                "notes": entry["notes"],
            }
        )
    return manifest


def publish_named_assets(manifest: list[dict[str, str]]) -> None:
    for row in manifest:
        source = ROOT / row["source_path"]
        destination = ROOT / row["named_path"]
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)


def write_csv(rows: list[dict[str, str]], path: Path) -> None:
    with path.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def write_json(rows: list[dict[str, str]], path: Path) -> None:
    with path.open("w", encoding="utf-8") as file:
        json.dump(rows, file, ensure_ascii=False, indent=2)


def write_markdown(rows: list[dict[str, str]], path: Path) -> None:
    lines = [
        "# Semantic Asset Manifest",
        "",
        f"- Total Named Assets: {len(rows)}",
        "",
        "| Category | Name | Named Path | Notes |",
        "| --- | --- | --- | --- |",
    ]
    for row in rows:
        lines.append(f'| {row["category"]} | `{row["proposed_name"]}` | `{row["named_path"]}` | {row["notes"] or ""} |')
    path.write_text("\n".join(lines), encoding="utf-8")


def write_recognition_mapping(path_csv: Path, path_json: Path, path_md: Path) -> None:
    fieldnames = [
        "recognition_key",
        "synonyms",
        "display_name_zh",
        "sticker_asset_name",
        "domain",
        "subcategory",
        "target_object",
        "status_tag",
        "representative_priority",
    ]
    rows = [
        {
            "recognition_key": row[0],
            "synonyms": row[1],
            "display_name_zh": row[2],
            "sticker_asset_name": row[3],
            "domain": row[4],
            "subcategory": row[5],
            "target_object": row[6],
            "status_tag": row[7],
            "representative_priority": row[8],
        }
        for row in RECOGNITION_MAPPINGS
    ]

    with path_csv.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    with path_json.open("w", encoding="utf-8") as file:
        json.dump(rows, file, ensure_ascii=False, indent=2)

    lines = [
        "# Recognition Sticker Mapping",
        "",
        f"- Total Canonical Entries: {len(rows)}",
        "",
        "| Key | 中文名 | Sticker | Object | Tag | Priority |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for row in rows:
        lines.append(
            f'| `{row["recognition_key"]}` | {row["display_name_zh"]} | `{row["sticker_asset_name"]}` | `{row["target_object"]}` | `{row["status_tag"]}` | {row["representative_priority"]} |'
        )
    path_md.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    manifest = build_manifest()
    expected = sum(1 for _ in CUTOUT_DIR.rglob("*.png"))
    if len(manifest) != expected:
        raise ValueError(f"Manifest count {len(manifest)} does not match cutout count {expected}.")

    publish_named_assets(manifest)

    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    write_csv(manifest, INDEX_DIR / "semantic-asset-manifest.csv")
    write_json(manifest, INDEX_DIR / "semantic-asset-manifest.json")
    write_markdown(manifest, INDEX_DIR / "semantic-asset-manifest.md")

    label_rows = [
        {
            "path": row["source_path"],
            "current_stem": row["current_stem"],
            "proposed_name": row["proposed_name"],
            "category": row["category"],
            "subtype": row["subtype"],
            "usage": row["usage"],
            "review_status": row["review_status"],
            "notes": row["notes"],
        }
        for row in manifest
    ]
    write_csv(label_rows, INDEX_DIR / "cutout-label-template.csv")

    write_recognition_mapping(
        INDEX_DIR / "recognition-sticker-mapping.csv",
        INDEX_DIR / "recognition-sticker-mapping.json",
        INDEX_DIR / "recognition-sticker-mapping.md",
    )

    print(f"Published {len(manifest)} semantic asset aliases and recognition mapping.")


if __name__ == "__main__":
    main()
