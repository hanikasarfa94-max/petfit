import type {
  CaptureRecognitionCandidate,
  CaptureSession,
  DrinkRecord,
  FoodRecord,
  PetFitDomainState,
  PetProfile,
  RestRecord,
} from "../entities";
import { requireRecognitionEntry } from "./recognition-catalog";

const seedDate = "2026-06-13";
const testImageRoot = "/tst/tst_image";

const makeFoodRecord = (
  id: string,
  occurredAt: string,
  recognitionKeys: string[],
  mealSlot: FoodRecord["mealSlot"],
  source: FoodRecord["source"],
  captureSessionId?: string,
  notes?: string,
): FoodRecord => ({
  id,
  kind: "food",
  occurredAt,
  source,
  captureSessionId,
  notes,
  targetObject: "bowl",
  recognitionKeys,
  stickerAssetNames: recognitionKeys.map((key) =>
    requireRecognitionEntry(key).stickerAssetName,
  ),
  totalItems: recognitionKeys.length,
  mealSlot,
});

const beverageTypeByKey: Record<string, DrinkRecord["beverageType"]> = {
  water: "water",
  green_tea: "tea",
  coffee: "coffee",
  milk: "milk",
  yogurt: "milk",
  soy_milk: "milk",
  orange_juice: "juice",
  milk_tea: "sweetened",
  cola: "sweetened",
  sparkling_water: "water",
};

const makeDrinkRecord = (
  id: string,
  occurredAt: string,
  recognitionKey: string,
  amountMl: number,
  source: DrinkRecord["source"],
  captureSessionId?: string,
  notes?: string,
): DrinkRecord => {
  const entry = requireRecognitionEntry(recognitionKey);

  return {
    id,
    kind: "drink",
    occurredAt,
    source,
    captureSessionId,
    notes,
    targetObject: "bottle",
    amountMl,
    recognitionKey,
    stickerAssetName: entry.stickerAssetName,
    beverageType: beverageTypeByKey[recognitionKey] ?? "other",
    statusTags: entry.statusTag ? [entry.statusTag] : [],
  };
};

const makeRestRecord = (
  id: string,
  occurredAt: string,
  durationMinutes: number,
  restMode: RestRecord["restMode"],
  source: RestRecord["source"],
  quality: RestRecord["quality"] = "completed",
  notes?: string,
): RestRecord => ({
  id,
  kind: "rest",
  occurredAt,
  source,
  notes,
  targetObject: "cushion",
  durationMinutes,
  restMode,
  quality,
});

const makeCandidate = (
  recognitionKey: string,
  confidence: number,
  selected = true,
): CaptureRecognitionCandidate => {
  const entry = requireRecognitionEntry(recognitionKey);

  return {
    recognitionKey,
    label: entry.displayName,
    domain: entry.domain,
    confidence,
    stickerAssetName: entry.stickerAssetName,
    targetObject: entry.targetObject,
    statusTag: entry.statusTag,
    representativePriority: entry.representativePriority,
    selected,
  };
};

const petProfile: PetProfile = {
  id: "pet-buding",
  name: "布丁",
  species: "hamster",
  mascotName: "Buding",
  companionAssetName: "character_buding_idle_front",
  adoptedAt: "2026-06-01T09:00:00+08:00",
  wellnessGoals: {
    hydrationMl: 1800,
    mealEntries: 3,
    restMinutes: 30,
  },
  notes: "PetFit prototype seed profile",
};

const captureSessions: CaptureSession[] = [
  {
    id: "capture-breakfast",
    status: "saved",
    startedAt: "2026-06-13T08:18:00+08:00",
    finalizedAt: "2026-06-13T08:21:00+08:00",
    imagePath: `${testImageRoot}/just_food_rice_and_fried-chicken-leg_and_bread_and_salad.png`,
    suggestedTargetObject: "bowl",
    candidates: [
      makeCandidate("rice", 0.97),
      makeCandidate("chicken_leg", 0.91),
      makeCandidate("bread", 0.82),
      makeCandidate("salad", 0.85),
    ],
    selectedRecognitionKeys: ["rice", "chicken_leg", "bread", "salad"],
    notes: "Seeded tst food-only review example.",
  },
  {
    id: "capture-afternoon-review",
    status: "reviewing",
    startedAt: "2026-06-13T15:42:00+08:00",
    imagePath: `${testImageRoot}/drink_and_food_rice_and_fried_beef_with_pimento_and_slad_and_water_and_milk-tea.png`,
    suggestedTargetObject: "bowl",
    candidates: [
      makeCandidate("rice", 0.96),
      makeCandidate("beef", 0.9),
      makeCandidate("salad", 0.84),
      makeCandidate("water", 0.95),
      makeCandidate("milk_tea", 0.87, false),
    ],
    selectedRecognitionKeys: ["rice", "beef", "salad", "water"],
    notes: "Seeded tst mixed meal review example.",
  },
];

const foodRecords: FoodRecord[] = [
  makeFoodRecord(
    "food-breakfast-1",
    "2026-06-13T08:20:00+08:00",
    ["rice", "chicken_leg", "bread", "salad"],
    "breakfast",
    "capture",
    "capture-breakfast",
  ),
  makeFoodRecord(
    "food-lunch-1",
    "2026-06-13T12:32:00+08:00",
    ["salad", "salmon", "kiwi"],
    "lunch",
    "manual",
    undefined,
    "Desk lunch",
  ),
  makeFoodRecord(
    "food-snack-1",
    "2026-06-12T16:15:00+08:00",
    ["strawberry", "banana"],
    "snack",
    "seed",
    undefined,
    "Yesterday snack memory",
  ),
];

const drinkRecords: DrinkRecord[] = [
  makeDrinkRecord(
    "drink-water-1",
    "2026-06-13T09:10:00+08:00",
    "water",
    450,
    "quick-action",
  ),
  makeDrinkRecord(
    "drink-coffee-1",
    "2026-06-13T10:45:00+08:00",
    "coffee",
    280,
    "manual",
  ),
  makeDrinkRecord(
    "drink-water-2",
    "2026-06-13T14:20:00+08:00",
    "water",
    350,
    "quick-action",
  ),
  makeDrinkRecord(
    "drink-milktea-1",
    "2026-06-12T15:30:00+08:00",
    "milk_tea",
    500,
    "seed",
    undefined,
    "Yesterday treat",
  ),
];

const restRecords: RestRecord[] = [
  makeRestRecord(
    "rest-break-1",
    "2026-06-13T13:40:00+08:00",
    18,
    "break",
    "quick-action",
  ),
  makeRestRecord(
    "rest-nap-1",
    "2026-06-12T22:10:00+08:00",
    35,
    "nap",
    "seed",
  ),
];

export const createMockSeedState = (): PetFitDomainState => ({
  petProfile,
  foodRecords,
  drinkRecords,
  restRecords,
  captureSessions,
  selectedDate: seedDate,
  activeCaptureSessionId: "capture-afternoon-review",
  seedVersion: "p0-p1-seed-v1",
});
