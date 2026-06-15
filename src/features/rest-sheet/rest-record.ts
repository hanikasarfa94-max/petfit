import type { RestMode, RestRecord } from "../../entities";

export interface CreateRestRecordInput {
  durationMinutes: number;
  notes?: string;
  quality?: RestRecord["quality"];
  restMode: RestMode;
  selectedDate: string;
  sequence: number;
  source?: RestRecord["source"];
}

const pad = (value: number) => value.toString().padStart(2, "0");

const toOccurredAt = (selectedDate: string, sequence: number) => {
  const totalMinutes = 11 * 60 + 10 + sequence * 53;
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return `${selectedDate}T${pad(hours)}:${pad(minutes)}:00+08:00`;
};

export const createRestRecord = ({
  durationMinutes,
  notes,
  quality = "completed",
  restMode,
  selectedDate,
  sequence,
  source = "quick-action",
}: CreateRestRecordInput): RestRecord => ({
  id: `rest-quick-${selectedDate}-${pad(sequence)}-${restMode}`,
  kind: "rest",
  occurredAt: toOccurredAt(selectedDate, sequence),
  source,
  notes,
  targetObject: "cushion",
  durationMinutes,
  restMode,
  quality,
});
