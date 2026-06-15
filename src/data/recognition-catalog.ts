import recognitionStickerMappingJson from "../../assets/derived/indexes/recognition-sticker-mapping.json";
import type {
  RecognitionCatalog,
  RecognitionCatalogEntry,
  RecognitionTargetObject,
} from "../entities";

interface RecognitionMappingRow {
  recognition_key: string;
  synonyms: string;
  display_name_zh: string;
  sticker_asset_name: string;
  domain: "food" | "drink";
  subcategory: string;
  target_object: RecognitionTargetObject;
  status_tag: string;
  representative_priority: string;
}

const recognitionRows =
  recognitionStickerMappingJson as RecognitionMappingRow[];

const splitTerms = (value: string) =>
  value
    .split(",")
    .map((term) => term.trim())
    .filter(Boolean);

const normalizeRecognitionEntry = (
  row: RecognitionMappingRow,
): RecognitionCatalogEntry => {
  const synonyms = splitTerms(row.synonyms);
  const searchTerms = Array.from(
    new Set(
      [row.recognition_key, row.display_name_zh, ...synonyms]
        .map((term) => term.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

  return {
    recognitionKey: row.recognition_key,
    synonyms,
    displayName: row.display_name_zh,
    stickerAssetName: row.sticker_asset_name,
    domain: row.domain,
    subcategory: row.subcategory,
    targetObject: row.target_object,
    statusTag: row.status_tag || undefined,
    representativePriority: Number(row.representative_priority),
    searchTerms,
  };
};

const createRecognitionCatalog = (
  rows: RecognitionMappingRow[],
): RecognitionCatalog => {
  const entries = rows.map(normalizeRecognitionEntry);
  const byKey: Record<string, RecognitionCatalogEntry> = {};
  const byAlias: Record<string, RecognitionCatalogEntry> = {};
  const byTargetObject: Record<RecognitionTargetObject, RecognitionCatalogEntry[]> = {
    bowl: [],
    bottle: [],
  };

  for (const entry of entries) {
    byKey[entry.recognitionKey] = entry;
    byTargetObject[entry.targetObject].push(entry);

    for (const term of entry.searchTerms) {
      byAlias[term] = entry;
    }
  }

  return {
    entries,
    byKey,
    byAlias,
    byTargetObject,
  };
};

export const recognitionCatalog = createRecognitionCatalog(recognitionRows);

export const getRecognitionEntry = (key: string) =>
  recognitionCatalog.byKey[key];

export const searchRecognitionEntry = (term: string) =>
  recognitionCatalog.byAlias[term.trim().toLowerCase()];

export const requireRecognitionEntry = (key: string): RecognitionCatalogEntry => {
  const entry = getRecognitionEntry(key);

  if (!entry) {
    throw new Error(`Unknown recognition entry "${key}"`);
  }

  return entry;
};
