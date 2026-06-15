import type {
  AssetDefinition,
  CaptureSession,
  DrinkRecord,
  FoodRecord,
  PetFitDomainState,
  RecognitionCatalogEntry,
  RestRecord,
} from "../entities";
import {
  bowlObjectAssetRules,
  bottleObjectAssetRules,
  cushionObjectAssetRules,
  recognitionCatalog,
  requireAsset,
} from "../data";

const memoizeSelector = <T,>(selector: (state: PetFitDomainState) => T) => {
  let lastState: PetFitDomainState | undefined;
  let lastResult: T | undefined;

  return (state: PetFitDomainState) => {
    if (state === lastState && lastResult !== undefined) {
      return lastResult;
    }

    lastState = state;
    lastResult = selector(state);
    return lastResult;
  };
};

const toDayKey = (value: string) => value.slice(0, 10);

const isOnDay = (value: string, day: string) => toDayKey(value) === day;

const byNewest = <T extends { occurredAt: string }>(a: T, b: T) =>
  b.occurredAt.localeCompare(a.occurredAt);

const byPriority = (a: RecognitionCatalogEntry, b: RecognitionCatalogEntry) =>
  a.representativePriority - b.representativePriority;

const unique = <T,>(values: T[]) => Array.from(new Set(values));

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const buildTrailingDaySet = (selectedDate: string, days: number) => {
  const anchor = new Date(`${selectedDate}T00:00:00Z`);
  const dayKeys: string[] = [];

  for (let offset = 0; offset < days; offset += 1) {
    const day = new Date(anchor.getTime() - offset * DAY_IN_MS)
      .toISOString()
      .slice(0, 10);
    dayKeys.push(day);
  }

  return new Set(dayKeys);
};

const getRecordsForDay = (state: PetFitDomainState) => {
  const selectedDate = state.selectedDate;

  return {
    food: state.foodRecords.filter((record) => isOnDay(record.occurredAt, selectedDate)),
    drink: state.drinkRecords.filter((record) =>
      isOnDay(record.occurredAt, selectedDate),
    ),
    rest: state.restRecords.filter((record) => isOnDay(record.occurredAt, selectedDate)),
  };
};

const getLatestCaptureSession = (state: PetFitDomainState): CaptureSession | undefined =>
  [...state.captureSessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];

const getActiveCaptureSession = (state: PetFitDomainState) =>
  state.captureSessions.find((session) => session.id === state.activeCaptureSessionId);

const pickBowlObjectAsset = (records: FoodRecord[]): AssetDefinition => {
  const totalItems = records.reduce((sum, record) => sum + record.totalItems, 0);
  const matchedRule =
    bowlObjectAssetRules.find((rule) => totalItems <= rule.maxTotalItems) ??
    bowlObjectAssetRules[bowlObjectAssetRules.length - 1];

  return requireAsset(matchedRule.assetName);
};

const pickBottleObjectAsset = (
  totalHydrationMl: number,
  goalMl: number,
): AssetDefinition => {
  if (totalHydrationMl <= 0) {
    return requireAsset("object_bottle_empty");
  }

  const progress = goalMl > 0 ? totalHydrationMl / goalMl : 0;
  const matchedRule =
    bottleObjectAssetRules.find((rule) => {
      const withinLowerBound = progress >= rule.minProgress;
      const withinUpperBound =
        rule.maxProgressExclusive === undefined ||
        progress < rule.maxProgressExclusive;

      return withinLowerBound && withinUpperBound;
    }) ?? bottleObjectAssetRules[bottleObjectAssetRules.length - 1];

  return requireAsset(matchedRule.assetName);
};

const pickCushionObjectAsset = (
  records: RestRecord[],
  goalMinutes: number,
): AssetDefinition => {
  const totalMinutes = records.reduce((sum, record) => sum + record.durationMinutes, 0);
  const idleRule = cushionObjectAssetRules.find((rule) => rule.key === "idle");
  const finishedRule = cushionObjectAssetRules.find((rule) => rule.key === "finished");
  const restingRule = cushionObjectAssetRules.find((rule) => rule.key === "resting");
  const usedRule = cushionObjectAssetRules.find((rule) => rule.key === "used");

  if (totalMinutes <= 0) {
    return requireAsset(idleRule?.assetName ?? "object_cushion_idle_flat");
  }

  if (totalMinutes >= goalMinutes) {
    return requireAsset(finishedRule?.assetName ?? "object_cushion_finished_plush");
  }

  const latestRecord = [...records].sort(byNewest)[0];

  if (latestRecord && latestRecord.durationMinutes >= 15) {
    return requireAsset(restingRule?.assetName ?? "object_cushion_resting_with_buding");
  }

  return requireAsset(usedRule?.assetName ?? "object_cushion_used_soft");
};

const pickHomeMascotAsset = (state: PetFitDomainState) => {
  const dayRecords = getRecordsForDay(state);
  const hydrationToday = dayRecords.drink.reduce((sum, record) => sum + record.amountMl, 0);
  const restToday = dayRecords.rest.reduce((sum, record) => sum + record.durationMinutes, 0);

  if (dayRecords.food.length === 0) {
    return requireAsset("character_buding_hungry_empty_bowl");
  }

  if (hydrationToday < state.petProfile.wellnessGoals.hydrationMl * 0.3) {
    return requireAsset("character_buding_thirsty_empty_bottle");
  }

  if (restToday < state.petProfile.wellnessGoals.restMinutes * 0.25) {
    return requireAsset("character_buding_yawn_sleepy");
  }

  return requireAsset(state.petProfile.companionAssetName);
};

const pickRepresentativeFoodEntries = (records: FoodRecord[]) =>
  unique(records.flatMap((record) => record.recognitionKeys))
    .map((key) => recognitionCatalog.byKey[key])
    .filter((entry): entry is RecognitionCatalogEntry => Boolean(entry))
    .sort(byPriority);

const pickRepresentativeDrinkEntries = (records: DrinkRecord[]) =>
  records
    .map((record) =>
      record.recognitionKey ? recognitionCatalog.byKey[record.recognitionKey] : undefined,
    )
    .filter((entry): entry is RecognitionCatalogEntry => Boolean(entry))
    .sort(byPriority);

export interface HomeSceneSelectorResult {
  selectedDate: string;
  petName: string;
  mascotAsset: AssetDefinition;
  bowlAsset: AssetDefinition;
  bottleAsset: AssetDefinition;
  cushionAsset: AssetDefinition;
  quickSummary: {
    mealEntries: number;
    hydrationMl: number;
    hydrationGoalMl: number;
    restMinutes: number;
    restGoalMinutes: number;
  };
  activeCapture?: {
    id: string;
    status: CaptureSession["status"];
    suggestedTargetObject: CaptureSession["suggestedTargetObject"];
    selectedCount: number;
    candidates: CaptureSession["candidates"];
  };
}

export interface BowlViewSelectorResult {
  selectedDate: string;
  objectAsset: AssetDefinition;
  mascotAsset: AssetDefinition;
  representativeStickerAssets: AssetDefinition[];
  records: FoodRecord[];
  totalItems: number;
  overflowCount: number;
}

export interface BottleViewSelectorResult {
  selectedDate: string;
  objectAsset: AssetDefinition;
  stickerAssets: AssetDefinition[];
  tagAssets: AssetDefinition[];
  records: DrinkRecord[];
  hydrationMl: number;
  hydrationGoalMl: number;
  hydrationProgress: number;
}

export interface CushionViewSelectorResult {
  selectedDate: string;
  objectAsset: AssetDefinition;
  mascotAsset: AssetDefinition;
  records: RestRecord[];
  totalMinutes: number;
  restGoalMinutes: number;
}

export interface StatsSummarySelectorResult {
  selectedDate: string;
  today: {
    mealEntries: number;
    hydrationMl: number;
    restMinutes: number;
  };
  trailing7Days: {
    mealEntries: number;
    hydrationMl: number;
    restMinutes: number;
  };
  topFoods: Array<{ key: string; count: number; label: string }>;
  topDrinks: Array<{ key: string; count: number; label: string }>;
  latestCaptureStatus?: CaptureSession["status"];
}

export const selectHomeScene = memoizeSelector<HomeSceneSelectorResult>((state) => {
  const dayRecords = getRecordsForDay(state);
  const hydrationMl = dayRecords.drink.reduce((sum, record) => sum + record.amountMl, 0);
  const restMinutes = dayRecords.rest.reduce(
    (sum, record) => sum + record.durationMinutes,
    0,
  );
  const activeCapture = getActiveCaptureSession(state);

  return {
    selectedDate: state.selectedDate,
    petName: state.petProfile.name,
    mascotAsset: pickHomeMascotAsset(state),
    bowlAsset: pickBowlObjectAsset(dayRecords.food),
    bottleAsset: pickBottleObjectAsset(
      hydrationMl,
      state.petProfile.wellnessGoals.hydrationMl,
    ),
    cushionAsset: pickCushionObjectAsset(
      dayRecords.rest,
      state.petProfile.wellnessGoals.restMinutes,
    ),
    quickSummary: {
      mealEntries: dayRecords.food.length,
      hydrationMl,
      hydrationGoalMl: state.petProfile.wellnessGoals.hydrationMl,
      restMinutes,
      restGoalMinutes: state.petProfile.wellnessGoals.restMinutes,
    },
    activeCapture: activeCapture
      ? {
          id: activeCapture.id,
          status: activeCapture.status,
          suggestedTargetObject: activeCapture.suggestedTargetObject,
          selectedCount: activeCapture.selectedRecognitionKeys.length,
          candidates: activeCapture.candidates,
        }
      : undefined,
  };
});

export const selectBowlView = memoizeSelector<BowlViewSelectorResult>((state) => {
  const records = getRecordsForDay(state).food.sort(byNewest);
  const totalItems = records.reduce((sum, record) => sum + record.totalItems, 0);
  const representativeEntries = pickRepresentativeFoodEntries(records);
  const representativeStickerAssets = representativeEntries
    .slice(0, 6)
    .map((entry) => requireAsset(entry.stickerAssetName));

  return {
    selectedDate: state.selectedDate,
    objectAsset: pickBowlObjectAsset(records),
    mascotAsset:
      totalItems > 0
        ? requireAsset("character_buding_eat_strawberry")
        : requireAsset("character_buding_hungry_empty_bowl"),
    representativeStickerAssets,
    records,
    totalItems,
    overflowCount: Math.max(totalItems - representativeStickerAssets.length, 0),
  };
});

export const selectBottleView = memoizeSelector<BottleViewSelectorResult>((state) => {
  const records = getRecordsForDay(state).drink.sort(byNewest);
  const hydrationMl = records.reduce((sum, record) => sum + record.amountMl, 0);
  const hydrationGoalMl = state.petProfile.wellnessGoals.hydrationMl;
  const stickerAssets = unique(
    pickRepresentativeDrinkEntries(records).map((entry) => entry.stickerAssetName),
  ).map((assetName) => requireAsset(assetName));
  const tagAssets = unique(records.flatMap((record) => record.statusTags)).map((tagName) =>
    requireAsset(tagName),
  );

  return {
    selectedDate: state.selectedDate,
    objectAsset: pickBottleObjectAsset(hydrationMl, hydrationGoalMl),
    stickerAssets,
    tagAssets,
    records,
    hydrationMl,
    hydrationGoalMl,
    hydrationProgress: hydrationGoalMl > 0 ? hydrationMl / hydrationGoalMl : 0,
  };
});

export const selectCushionView = memoizeSelector<CushionViewSelectorResult>((state) => {
  const records = getRecordsForDay(state).rest.sort(byNewest);
  const restGoalMinutes = state.petProfile.wellnessGoals.restMinutes;
  const totalMinutes = records.reduce((sum, record) => sum + record.durationMinutes, 0);

  return {
    selectedDate: state.selectedDate,
    objectAsset: pickCushionObjectAsset(records, restGoalMinutes),
    mascotAsset:
      totalMinutes > 0
        ? requireAsset("character_buding_sleeping_blue_cushion")
        : requireAsset("character_buding_yawn_sleepy"),
    records,
    totalMinutes,
    restGoalMinutes,
  };
});

export const selectStatsSummary = memoizeSelector<StatsSummarySelectorResult>((state) => {
  const selectedDate = state.selectedDate;
  const todayRecords = getRecordsForDay(state);
  const latestCapture = getLatestCaptureSession(state);
  const trailingDays = buildTrailingDaySet(selectedDate, 7);

  const inTrailingWindow = (value: string) => {
    const day = toDayKey(value);
    return trailingDays.has(day);
  };

  const trailingFood = state.foodRecords.filter((record) =>
    inTrailingWindow(record.occurredAt),
  );
  const trailingDrink = state.drinkRecords.filter((record) =>
    inTrailingWindow(record.occurredAt),
  );
  const trailingRest = state.restRecords.filter((record) =>
    inTrailingWindow(record.occurredAt),
  );

  const countKeys = (keys: string[]) =>
    Object.entries(
      keys.reduce<Record<string, number>>((accumulator, key) => {
        accumulator[key] = (accumulator[key] ?? 0) + 1;
        return accumulator;
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, count]) => ({
        key,
        count,
        label: recognitionCatalog.byKey[key]?.displayName ?? key,
      }));

  return {
    selectedDate,
    today: {
      mealEntries: todayRecords.food.length,
      hydrationMl: todayRecords.drink.reduce((sum, record) => sum + record.amountMl, 0),
      restMinutes: todayRecords.rest.reduce(
        (sum, record) => sum + record.durationMinutes,
        0,
      ),
    },
    trailing7Days: {
      mealEntries: trailingFood.length,
      hydrationMl: trailingDrink.reduce((sum, record) => sum + record.amountMl, 0),
      restMinutes: trailingRest.reduce(
        (sum, record) => sum + record.durationMinutes,
        0,
      ),
    },
    topFoods: countKeys(trailingFood.flatMap((record) => record.recognitionKeys)),
    topDrinks: countKeys(
      trailingDrink
        .map((record) => record.recognitionKey)
        .filter((key): key is string => Boolean(key)),
    ),
    latestCaptureStatus: latestCapture?.status,
  };
});
