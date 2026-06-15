import semanticAssetManifestJson from "../../assets/derived/indexes/semantic-asset-manifest.json";
import {
  ASSET_CATEGORIES,
  type AssetCategory,
  type AssetDefinition,
  type AssetRegistry,
  type SemanticAssetManifestEntry,
} from "../entities";

const semanticAssetManifest = semanticAssetManifestJson as SemanticAssetManifestEntry[];

const toWebPath = (namedPath: string) => `/${namedPath.replace(/\\/g, "/")}`;

const normalizeAsset = (entry: SemanticAssetManifestEntry): AssetDefinition => ({
  id: entry.proposed_name,
  name: entry.proposed_name,
  category: entry.category,
  subtype: entry.subtype,
  bucket: entry.named_bucket,
  sourcePath: entry.source_path,
  namedPath: entry.named_path,
  webPath: toWebPath(entry.named_path),
  usage: entry.usage,
  reviewStatus: entry.review_status,
  notes: entry.notes,
});

const createEmptyCategoryMap = (): Record<AssetCategory, AssetDefinition[]> =>
  Object.fromEntries(
    ASSET_CATEGORIES.map((category) => [category, [] as AssetDefinition[]]),
  ) as Record<AssetCategory, AssetDefinition[]>;

const createAssetRegistry = (entries: SemanticAssetManifestEntry[]): AssetRegistry => {
  const all = entries.map(normalizeAsset);
  const byCategory = createEmptyCategoryMap();
  const byName: Record<string, AssetDefinition> = {};
  const byBucket: Record<string, AssetDefinition[]> = {};

  for (const asset of all) {
    byCategory[asset.category].push(asset);
    byName[asset.name] = asset;
    byBucket[asset.bucket] ??= [];
    byBucket[asset.bucket].push(asset);
  }

  return {
    all,
    byName,
    byCategory,
    byBucket,
  };
};

export const assetRegistry = createAssetRegistry(semanticAssetManifest);

export const getAssetByName = (name: string) => assetRegistry.byName[name];

export const requireAsset = (name: string): AssetDefinition => {
  const asset = getAssetByName(name);

  if (!asset) {
    throw new Error(`Unknown asset "${name}"`);
  }

  return asset;
};

export const getAssetsByCategory = (category: AssetCategory) =>
  assetRegistry.byCategory[category];
