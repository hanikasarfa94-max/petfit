export type RecordSource = "capture" | "quick-action" | "manual" | "seed";
export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";
export type BeverageType =
  | "water"
  | "tea"
  | "coffee"
  | "juice"
  | "milk"
  | "sweetened"
  | "other";
export type RestMode = "nap" | "break" | "sleep";
export type RestQuality = "planned" | "completed" | "skipped";

export interface DomainRecordBase {
  id: string;
  occurredAt: string;
  source: RecordSource;
  notes?: string;
  captureSessionId?: string;
}

export interface FoodRecord extends DomainRecordBase {
  kind: "food";
  targetObject: "bowl";
  recognitionKeys: string[];
  stickerAssetNames: string[];
  totalItems: number;
  mealSlot: MealSlot;
}

export interface DrinkRecord extends DomainRecordBase {
  kind: "drink";
  targetObject: "bottle";
  amountMl: number;
  recognitionKey?: string;
  stickerAssetName?: string;
  beverageType: BeverageType;
  statusTags: string[];
}

export interface RestRecord extends DomainRecordBase {
  kind: "rest";
  targetObject: "cushion";
  durationMinutes: number;
  restMode: RestMode;
  quality: RestQuality;
}

export type PetFitRecord = FoodRecord | DrinkRecord | RestRecord;
