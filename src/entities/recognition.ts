export type RecognitionDomain = "food" | "drink" | "rest";
export type RecognitionTargetObject = "bowl" | "bottle";

export interface RecognitionCatalogEntry {
  recognitionKey: string;
  synonyms: string[];
  displayName: string;
  stickerAssetName: string;
  domain: Extract<RecognitionDomain, "food" | "drink">;
  subcategory: string;
  targetObject: RecognitionTargetObject;
  statusTag?: string;
  representativePriority: number;
  searchTerms: string[];
}

export interface RecognitionCatalog {
  entries: RecognitionCatalogEntry[];
  byKey: Record<string, RecognitionCatalogEntry>;
  byAlias: Record<string, RecognitionCatalogEntry>;
  byTargetObject: Record<RecognitionTargetObject, RecognitionCatalogEntry[]>;
}
