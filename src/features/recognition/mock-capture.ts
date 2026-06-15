import type {
  CaptureRecognitionCandidate,
  CaptureSession,
  RecognitionTargetObject,
} from "../../entities";
import { requireRecognitionEntry } from "../../data";

type PresetCandidate = {
  confidence: number;
  recognitionKey: string;
  selected?: boolean;
};

export interface MockCapturePreset {
  id: "test-mixed-meal-drinks" | "test-drinks-only" | "test-food-only";
  label: string;
  description: string;
  imagePath?: string;
  sceneHint: string;
  suggestedTargetObject: RecognitionTargetObject;
  candidates: PresetCandidate[];
}

const TEST_IMAGE_ROOT = "/tst/tst_image";

const toCandidate = ({
  confidence,
  recognitionKey,
  selected = true,
}: PresetCandidate): CaptureRecognitionCandidate => {
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

export const mockCapturePresets: MockCapturePreset[] = [
  {
    id: "test-mixed-meal-drinks",
    label: "Mixed meal + drinks",
    description:
      "Uses the real tst sample with rice, beef, salad, water, and milk tea in one frame.",
    imagePath: `${TEST_IMAGE_ROOT}/drink_and_food_rice_and_fried_beef_with_pimento_and_slad_and_water_and_milk-tea.png`,
    sceneHint: "Mixed bowl-and-bottle case from tst assets.",
    suggestedTargetObject: "bowl",
    candidates: [
      { recognitionKey: "rice", confidence: 0.96 },
      { recognitionKey: "beef", confidence: 0.9 },
      { recognitionKey: "salad", confidence: 0.84 },
      { recognitionKey: "water", confidence: 0.94 },
      { recognitionKey: "milk_tea", confidence: 0.87 },
    ],
  },
  {
    id: "test-drinks-only",
    label: "Drinks only",
    description:
      "Uses the tst drink sample to rehearse bottle-first recognition and quick hydration review.",
    imagePath: `${TEST_IMAGE_ROOT}/just_drink_milk-tea_and_water_and_tea.png`,
    sceneHint: "Bottle-first capture from tst assets.",
    suggestedTargetObject: "bottle",
    candidates: [
      { recognitionKey: "milk_tea", confidence: 0.92 },
      { recognitionKey: "water", confidence: 0.96 },
      { recognitionKey: "green_tea", confidence: 0.83 },
    ],
  },
  {
    id: "test-food-only",
    label: "Food only",
    description:
      "Uses the tst food sample with rice, chicken leg, bread, and salad to stress the bowl layout.",
    imagePath: `${TEST_IMAGE_ROOT}/just_food_rice_and_fried-chicken-leg_and_bread_and_salad.png`,
    sceneHint: "Bowl-first capture from tst assets.",
    suggestedTargetObject: "bowl",
    candidates: [
      { recognitionKey: "rice", confidence: 0.96 },
      { recognitionKey: "chicken_leg", confidence: 0.88 },
      { recognitionKey: "bread", confidence: 0.8 },
      { recognitionKey: "salad", confidence: 0.85 },
    ],
  },
];

export const createMockCaptureSession = (
  presetId: MockCapturePreset["id"],
): CaptureSession => {
  const preset = mockCapturePresets.find((entry) => entry.id === presetId);

  if (!preset) {
    throw new Error(`Unknown mock capture preset "${presetId}"`);
  }

  const startedAt = new Date().toISOString();
  const candidates = preset.candidates.map(toCandidate);

  return {
    id: `capture-${preset.id}-${Date.now()}`,
    status: "reviewing",
    startedAt,
    imagePath: preset.imagePath,
    suggestedTargetObject: preset.suggestedTargetObject,
    candidates,
    selectedRecognitionKeys: candidates
      .filter((candidate) => candidate.selected)
      .map((candidate) => candidate.recognitionKey),
    notes: preset.sceneHint,
  };
};

export const inferPrimaryTargetObject = (session: CaptureSession) =>
  session.candidates.some(
    (candidate) => candidate.selected && candidate.targetObject === "bowl",
  )
    ? "bowl"
    : "bottle";

export const getSelectedCandidates = (session: CaptureSession) =>
  session.candidates.filter((candidate) => candidate.selected);
