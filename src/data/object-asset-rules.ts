export interface BowlObjectAssetRule {
  maxTotalItems: number;
  assetName: string;
}

export interface BottleObjectAssetRule {
  minProgress: number;
  maxProgressExclusive?: number;
  assetName: string;
}

export interface CushionObjectAssetRule {
  key: "idle" | "finished" | "resting" | "used";
  assetName: string;
}

export const bowlObjectAssetRules: BowlObjectAssetRule[] = [
  { maxTotalItems: 0, assetName: "object_bowl_empty" },
  { maxTotalItems: 3, assetName: "object_bowl_light_fruit" },
  { maxTotalItems: 6, assetName: "object_bowl_full_fruit_salad" },
  { maxTotalItems: Number.POSITIVE_INFINITY, assetName: "object_bowl_overflow_plus_n" },
];

export const bottleObjectAssetRules: BottleObjectAssetRule[] = [
  { minProgress: Number.NEGATIVE_INFINITY, maxProgressExclusive: 0, assetName: "object_bottle_empty" },
  { minProgress: 0, maxProgressExclusive: 0.25, assetName: "object_bottle_water_low" },
  { minProgress: 0.25, maxProgressExclusive: 0.6, assetName: "object_bottle_water_mid" },
  { minProgress: 0.6, maxProgressExclusive: 1, assetName: "object_bottle_water_high" },
  { minProgress: 1, assetName: "object_bottle_water_full" },
];

export const cushionObjectAssetRules: CushionObjectAssetRule[] = [
  { key: "idle", assetName: "object_cushion_idle_flat" },
  { key: "finished", assetName: "object_cushion_finished_plush" },
  { key: "resting", assetName: "object_cushion_resting_with_buding" },
  { key: "used", assetName: "object_cushion_used_soft" },
];

export const bottleStatusTagAssetNames = [
  "tag_drink_sweet",
  "tag_drink_caffeinated",
  "tag_drink_low_sugar",
  "tag_drink_sugar_free",
] as const;

export const recognitionTargetObjectRouting = {
  food: "bowl",
  drink: "bottle",
  rest: "manual_record_only",
} as const;
