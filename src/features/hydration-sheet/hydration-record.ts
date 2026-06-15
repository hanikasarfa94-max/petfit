import type { DrinkRecord } from "../../entities";
import { requireRecognitionEntry } from "../../data";

export interface CreateHydrationDrinkRecordInput {
  amountMl: number;
  notes?: string;
  recognitionKey: string;
  selectedDate: string;
  sequence: number;
}

const beverageTypeByKey: Record<string, DrinkRecord["beverageType"]> = {
  coffee: "coffee",
  cola: "sweetened",
  green_tea: "tea",
  milk: "milk",
  milk_tea: "sweetened",
  orange_juice: "juice",
  soy_milk: "milk",
  sparkling_water: "water",
  water: "water",
  yogurt: "milk",
};

const pad = (value: number) => value.toString().padStart(2, "0");

const toOccurredAt = (selectedDate: string, sequence: number) => {
  const totalMinutes = 8 * 60 + 20 + sequence * 67;
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return `${selectedDate}T${pad(hours)}:${pad(minutes)}:00+08:00`;
};

export const createHydrationDrinkRecord = ({
  amountMl,
  notes,
  recognitionKey,
  selectedDate,
  sequence,
}: CreateHydrationDrinkRecordInput): DrinkRecord => {
  const entry = requireRecognitionEntry(recognitionKey);

  return {
    id: `drink-quick-${selectedDate}-${pad(sequence)}-${recognitionKey}`,
    kind: "drink",
    occurredAt: toOccurredAt(selectedDate, sequence),
    source: "quick-action",
    notes,
    targetObject: "bottle",
    amountMl,
    recognitionKey,
    stickerAssetName: entry.stickerAssetName,
    beverageType: beverageTypeByKey[recognitionKey] ?? "other",
    statusTags: entry.statusTag ? [entry.statusTag] : [],
  };
};
