import type { ImgHTMLAttributes } from "react";
import { resolvePrototypeAssetUrl } from "./asset-url";

type PrototypeAssetImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  alt: string;
  path?: string;
};

export function PrototypeAssetImage({
  alt,
  path,
  ...props
}: PrototypeAssetImageProps) {
  const resolvedPath = resolvePrototypeAssetUrl(path);

  if (!resolvedPath) {
    return null;
  }

  return <img {...props} alt={alt} src={resolvedPath} />;
}
