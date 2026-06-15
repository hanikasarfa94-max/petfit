import { createStore } from "zustand/vanilla";
import type {
  CaptureSession,
  DrinkRecord,
  FoodRecord,
  PetFitDomainState,
  RestRecord,
} from "../../entities";
import { createMockSeedState, requireRecognitionEntry } from "../../data";

export interface PetFitStoreActions {
  reset: () => void;
  setSelectedDate: (date: string) => void;
  setActiveCaptureSession: (sessionId?: string) => void;
  addFoodRecord: (record: FoodRecord) => void;
  addDrinkRecord: (record: DrinkRecord) => void;
  addRestRecord: (record: RestRecord) => void;
  upsertCaptureSession: (session: CaptureSession) => void;
  toggleCaptureCandidate: (sessionId: string, recognitionKey: string) => void;
  confirmCaptureSession: (sessionId: string) => void;
  saveCaptureSession: (sessionId: string, occurredAt?: string) => void;
}

export type PetFitStoreState = PetFitDomainState & PetFitStoreActions;

const initialState = (): PetFitDomainState => createMockSeedState();

const estimateDrinkAmount = (recognitionKey: string) => {
  switch (recognitionKey) {
    case "water":
    case "sparkling_water":
      return 350;
    case "coffee":
      return 280;
    case "milk_tea":
      return 500;
    case "orange_juice":
      return 300;
    default:
      return 260;
  }
};

const toCaptureFoodRecord = (
  session: CaptureSession,
  occurredAt: string,
): FoodRecord | undefined => {
  const selectedFood = session.candidates.filter(
    (candidate) => candidate.selected && candidate.domain === "food",
  );

  if (selectedFood.length === 0) {
    return undefined;
  }

  return {
    id: `food-${session.id}`,
    kind: "food",
    occurredAt,
    source: "capture",
    captureSessionId: session.id,
    targetObject: "bowl",
    recognitionKeys: selectedFood.map((candidate) => candidate.recognitionKey),
    stickerAssetNames: selectedFood.map((candidate) => candidate.stickerAssetName),
    totalItems: selectedFood.length,
    mealSlot: "snack",
  };
};

const toCaptureDrinkRecords = (
  session: CaptureSession,
  occurredAt: string,
): DrinkRecord[] =>
  session.candidates
    .filter((candidate) => candidate.selected && candidate.domain === "drink")
    .map((candidate) => {
      const recognitionEntry = requireRecognitionEntry(candidate.recognitionKey);

      return {
        id: `drink-${session.id}-${candidate.recognitionKey}`,
        kind: "drink" as const,
        occurredAt,
        source: "capture" as const,
        captureSessionId: session.id,
        targetObject: "bottle" as const,
        amountMl: estimateDrinkAmount(candidate.recognitionKey),
        recognitionKey: candidate.recognitionKey,
        stickerAssetName: candidate.stickerAssetName,
        beverageType:
          candidate.recognitionKey === "water" ||
          candidate.recognitionKey === "sparkling_water"
            ? "water"
            : recognitionEntry.subcategory === "coffee"
              ? "coffee"
              : recognitionEntry.subcategory === "tea"
                ? "tea"
                : recognitionEntry.subcategory === "juice"
                  ? "juice"
                  : recognitionEntry.subcategory === "milk"
                    ? "milk"
                    : candidate.statusTag
                      ? "sweetened"
                      : "other",
        statusTags: candidate.statusTag ? [candidate.statusTag] : [],
      };
    });

export const petFitStore = createStore<PetFitStoreState>()((set) => ({
  ...initialState(),
  reset: () => set(initialState()),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setActiveCaptureSession: (activeCaptureSessionId) => set({ activeCaptureSessionId }),
  addFoodRecord: (record) =>
    set((state) => ({ foodRecords: [...state.foodRecords, record] })),
  addDrinkRecord: (record) =>
    set((state) => ({ drinkRecords: [...state.drinkRecords, record] })),
  addRestRecord: (record) =>
    set((state) => ({ restRecords: [...state.restRecords, record] })),
  upsertCaptureSession: (session) =>
    set((state) => {
      const existingIndex = state.captureSessions.findIndex(
        (current) => current.id === session.id,
      );

      if (existingIndex === -1) {
        return {
          captureSessions: [...state.captureSessions, session],
          activeCaptureSessionId: session.id,
        };
      }

      const captureSessions = [...state.captureSessions];
      captureSessions[existingIndex] = session;

      return {
        captureSessions,
        activeCaptureSessionId: session.id,
      };
    }),
  toggleCaptureCandidate: (sessionId, recognitionKey) =>
    set((state) => ({
      captureSessions: state.captureSessions.map((session) => {
        if (session.id !== sessionId) {
          return session;
        }

        const candidates = session.candidates.map((candidate) =>
          candidate.recognitionKey === recognitionKey
            ? { ...candidate, selected: !candidate.selected }
            : candidate,
        );

        return {
          ...session,
          candidates,
          selectedRecognitionKeys: candidates
            .filter((candidate) => candidate.selected)
            .map((candidate) => candidate.recognitionKey),
        };
      }),
    })),
  confirmCaptureSession: (sessionId) =>
    set((state) => ({
      captureSessions: state.captureSessions.map((session) =>
        session.id === sessionId ? { ...session, status: "confirmed" } : session,
      ),
      activeCaptureSessionId: sessionId,
    })),
  saveCaptureSession: (sessionId, occurredAt) =>
    set((state) => {
      const session = state.captureSessions.find((entry) => entry.id === sessionId);

      if (!session) {
        return state;
      }

      const effectiveOccurredAt = occurredAt ?? new Date().toISOString();
      const foodRecord = toCaptureFoodRecord(session, effectiveOccurredAt);
      const drinkRecords = toCaptureDrinkRecords(session, effectiveOccurredAt);

      return {
        foodRecords: foodRecord
          ? [...state.foodRecords, foodRecord]
          : state.foodRecords,
        drinkRecords: [...state.drinkRecords, ...drinkRecords],
        captureSessions: state.captureSessions.map((entry) =>
          entry.id === sessionId
            ? {
                ...entry,
                status: "saved",
                finalizedAt: effectiveOccurredAt,
              }
            : entry,
        ),
        activeCaptureSessionId: undefined,
      };
    }),
}));

export const getPetFitState = () => petFitStore.getState();
