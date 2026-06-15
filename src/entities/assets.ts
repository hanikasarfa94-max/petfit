export const ASSET_CATEGORIES = [
  "character",
  "object",
  "badge",
  "effect",
  "sticker_food",
  "sticker_drink",
  "tag",
  "icon",
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export interface SemanticAssetManifestEntry {
  source_path: string;
  current_stem: string;
  proposed_name: string;
  category: AssetCategory;
  subtype: string;
  named_bucket: string;
  named_path: string;
  usage: string;
  review_status: string;
  notes: string;
}

export interface AssetDefinition {
  id: string;
  name: string;
  category: AssetCategory;
  subtype: string;
  bucket: string;
  sourcePath: string;
  namedPath: string;
  webPath: string;
  usage: string;
  reviewStatus: string;
  notes: string;
}

export interface AssetRegistry {
  all: AssetDefinition[];
  byName: Record<string, AssetDefinition>;
  byCategory: Record<AssetCategory, AssetDefinition[]>;
  byBucket: Record<string, AssetDefinition[]>;
}
