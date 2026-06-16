import type { CaptureRecognitionCandidate, CaptureSession } from "../../entities";
import { recognitionCatalog, requireRecognitionEntry } from "../../data";
import { createMockCaptureSession } from "./mock-capture";

const API_BASE_URL =
  import.meta.env.VITE_PETFIT_API_BASE_URL?.replace(/\/$/, "") ||
  "https://petfit.flyflow.love";

interface RecognitionApiCandidate {
  confidence?: number;
  recognitionKey: string;
  selected?: boolean;
}

interface RecognitionApiResponse {
  candidates?: RecognitionApiCandidate[];
  notes?: string;
  suggestedTargetObject?: "bowl" | "bottle";
}

const fallbackPresetId = "test-mixed-meal-drinks";

const toCandidate = ({
  confidence = 0.72,
  recognitionKey,
  selected = true,
}: RecognitionApiCandidate): CaptureRecognitionCandidate | undefined => {
  const entry = recognitionCatalog.byKey[recognitionKey];

  if (!entry) {
    return undefined;
  }

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

const createSessionFromResponse = (response: RecognitionApiResponse): CaptureSession => {
  const candidates =
    response.candidates
      ?.map(toCandidate)
      .filter((candidate): candidate is CaptureRecognitionCandidate => Boolean(candidate))
      .sort((a, b) => b.confidence - a.confidence || a.representativePriority - b.representativePriority) ?? [];

  if (candidates.length === 0) {
    return createMockCaptureSession(fallbackPresetId);
  }

  const hasFood = candidates.some((candidate) => candidate.targetObject === "bowl");
  const suggestedTargetObject = response.suggestedTargetObject ?? (hasFood ? "bowl" : "bottle");

  return {
    id: `capture-cloud-${Date.now()}`,
    status: "reviewing",
    startedAt: new Date().toISOString(),
    suggestedTargetObject,
    candidates,
    selectedRecognitionKeys: candidates
      .filter((candidate) => candidate.selected)
      .map((candidate) => candidate.recognitionKey),
    notes: response.notes || "云端识别已返回候选结果",
  };
};

export async function recognizeCurrentCapture(): Promise<CaptureSession> {
  const catalog = recognitionCatalog.entries.map((entry) => ({
    key: entry.recognitionKey,
    label: entry.displayName,
    domain: entry.domain,
    aliases: entry.synonyms.slice(0, 4),
  }));

  const response = await fetch(`${API_BASE_URL}/api/recognize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      catalog,
      sceneHint:
        "PetFit mobile app sample capture. The preview contains rice, fried beef, salad, water and milk tea.",
    }),
  });

  if (!response.ok) {
    throw new Error(`云端识别失败 (${response.status})`);
  }

  const data = (await response.json()) as RecognitionApiResponse;
  return createSessionFromResponse(data);
}

export function createFallbackRecognitionSession() {
  const session = createMockCaptureSession(fallbackPresetId);

  return {
    ...session,
    notes: "云端暂时不可用，已使用本地候选结果继续流程",
    candidates: session.candidates.map((candidate) => ({
      ...candidate,
      selected: requireRecognitionEntry(candidate.recognitionKey).domain === candidate.domain,
    })),
  };
}
