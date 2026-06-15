import type { RecognitionTargetObject } from "./recognition";

export type CaptureSessionStatus =
  | "idle"
  | "reviewing"
  | "confirmed"
  | "saved"
  | "cancelled";

export interface CaptureRecognitionCandidate {
  recognitionKey: string;
  label: string;
  domain: "food" | "drink";
  confidence: number;
  stickerAssetName: string;
  targetObject: RecognitionTargetObject;
  statusTag?: string;
  representativePriority: number;
  selected: boolean;
}

export interface CaptureSession {
  id: string;
  status: CaptureSessionStatus;
  startedAt: string;
  finalizedAt?: string;
  imagePath?: string;
  suggestedTargetObject: RecognitionTargetObject;
  candidates: CaptureRecognitionCandidate[];
  selectedRecognitionKeys: string[];
  notes?: string;
}
