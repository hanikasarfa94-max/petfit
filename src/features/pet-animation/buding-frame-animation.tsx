import { useEffect, useMemo, useState } from "react";
import { PrototypeAssetImage } from "../recognition/prototype-asset-image";

const defaultFrameSequence = [
  "character_buding_idle_front",
  "character_buding_smile",
  "character_buding_stretch",
  "character_buding_wave",
  "character_buding_success_wave",
  "character_buding_celebrate",
  "character_buding_walk_left",
  "character_buding_turn_right",
  "character_buding_smile",
] as const;

export const budingAnimationSequences = {
  idle: [
    "character_buding_idle_front",
    "character_buding_smile",
    "character_buding_stretch",
    "character_buding_smile",
  ],
  greeting: [
    "character_buding_idle_front",
    "character_buding_wave",
    "character_buding_smile",
    "character_buding_wave",
  ],
  hungry: [
    "character_buding_hungry_empty_bowl",
    "character_buding_worried",
    "character_buding_hungry_empty_bowl",
  ],
  thirsty: [
    "character_buding_thirsty_empty_bottle",
    "character_buding_worried",
    "character_buding_drink_water",
    "character_buding_thirsty_empty_bottle",
  ],
  sleepy: [
    "character_buding_yawn_sleepy",
    "character_buding_sleep_curl",
    "character_buding_yawn_sleepy",
  ],
  eating: [
    "character_buding_smile",
    "character_buding_eat_strawberry",
    "character_buding_celebrate",
    "character_buding_smile",
  ],
  drinking: [
    "character_buding_smile",
    "character_buding_drink_water",
    "character_buding_celebrate",
    "character_buding_smile",
  ],
  resting: [
    "character_buding_yawn_sleepy",
    "character_buding_sleep_curl",
    "character_buding_sleeping_blue_cushion",
    "character_buding_stretch",
  ],
  success: [
    "character_buding_success_wave",
    "character_buding_celebrate",
    "character_buding_wave",
    "character_buding_smile",
  ],
  sync: [
    "character_buding_sync_turnaround",
    "character_buding_turn_right",
    "character_buding_success_wave",
  ],
  uncertain: [
    "character_buding_confused",
    "character_buding_worried",
    "character_buding_confused",
  ],
  cameraBlocked: [
    "character_buding_camera_permission_blocked",
    "character_buding_worried",
    "character_buding_camera_permission_blocked",
  ],
  memory: [
    "character_buding_memory_photo",
    "character_buding_smile",
    "character_buding_wave",
  ],
} as const;

export type BudingAnimationMood = keyof typeof budingAnimationSequences;
export type BudingAnimationFrame = (typeof defaultFrameSequence)[number] | string;

const toCharacterPath = (assetName: string) =>
  `/assets/derived/named/character/${assetName}.png`;

type BudingFrameAnimationProps = {
  className?: string;
  alt: string;
  frames?: readonly BudingAnimationFrame[];
  intervalMs?: number;
  mood?: BudingAnimationMood;
};

export function BudingFrameAnimation({
  className,
  alt,
  frames: frameOverride,
  intervalMs = 560,
  mood = "idle",
}: BudingFrameAnimationProps) {
  const frames = useMemo(
    () =>
      (frameOverride ?? budingAnimationSequences[mood] ?? defaultFrameSequence).map(
        toCharacterPath,
      ),
    [frameOverride, mood],
  );
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
  }, [frames]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, intervalMs);

    return () => window.clearInterval(timerId);
  }, [frames.length, intervalMs]);

  return (
    <PrototypeAssetImage
      className={className}
      path={frames[frameIndex]}
      alt={alt}
    />
  );
}
