import { useEffect, useMemo, useState } from "react";
import { PrototypeAssetImage } from "../recognition/prototype-asset-image";

const BUDING_FRAME_SEQUENCE = [
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

const toCharacterPath = (assetName: string) =>
  `/assets/derived/named/character/${assetName}.png`;

type BudingFrameAnimationProps = {
  className?: string;
  alt: string;
  intervalMs?: number;
};

export function BudingFrameAnimation({
  className,
  alt,
  intervalMs = 560,
}: BudingFrameAnimationProps) {
  const frames = useMemo(
    () => BUDING_FRAME_SEQUENCE.map(toCharacterPath),
    [],
  );
  const [frameIndex, setFrameIndex] = useState(0);

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
