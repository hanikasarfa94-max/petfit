import type {
  AssetDefinition,
  RecognitionCatalogEntry,
  RecognitionDomain,
  RecognitionTargetObject,
} from "../entities";
import { requireAsset } from "./asset-registry";
import { recognitionCatalog } from "./recognition-catalog";

type IndexedRecognitionDomain = Extract<RecognitionDomain, "food" | "drink">;

export interface RecognitionAssetBucket {
  entries: RecognitionCatalogEntry[];
  assetNames: string[];
  assets: AssetDefinition[];
}

export interface RecognitionAssetIndex {
  byDomain: Record<IndexedRecognitionDomain, RecognitionAssetBucket>;
  byTargetObject: Record<RecognitionTargetObject, RecognitionAssetBucket>;
}

const unique = <T,>(values: T[]) => Array.from(new Set(values));

const toBucket = (entries: RecognitionCatalogEntry[]): RecognitionAssetBucket => {
  const assetNames = unique(entries.map((entry) => entry.stickerAssetName));

  return {
    entries,
    assetNames,
    assets: assetNames.map((assetName) => requireAsset(assetName)),
  };
};

const createRecognitionAssetIndex = (): RecognitionAssetIndex => {
  const foodEntries = recognitionCatalog.entries.filter((entry) => entry.domain === "food");
  const drinkEntries = recognitionCatalog.entries.filter((entry) => entry.domain === "drink");

  return {
    byDomain: {
      food: toBucket(foodEntries),
      drink: toBucket(drinkEntries),
    },
    byTargetObject: {
      bowl: toBucket(recognitionCatalog.byTargetObject.bowl),
      bottle: toBucket(recognitionCatalog.byTargetObject.bottle),
    },
  };
};

export const recognitionAssetIndex = createRecognitionAssetIndex();

export const getRecognitionAssetsForDomain = (domain: IndexedRecognitionDomain) =>
  recognitionAssetIndex.byDomain[domain];

export const getRecognitionAssetsForTargetObject = (
  targetObject: RecognitionTargetObject,
) => recognitionAssetIndex.byTargetObject[targetObject];
