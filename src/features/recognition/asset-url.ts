const namedAssetModules = import.meta.glob(
  "/assets/derived/named/**/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const uiKitAssetModules = import.meta.glob(
  "/assets/derived/ui-kit/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const rawMockupModules = import.meta.glob(
  "/assets/raw/mockups/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const testImageModules = import.meta.glob("/tst/tst_image/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const assetUrlMap = Object.fromEntries(
  Object.entries({
    ...namedAssetModules,
    ...uiKitAssetModules,
    ...rawMockupModules,
    ...testImageModules,
  }).map(([key, value]) => [
    key.replace(/^\//, "").replace(/\\/g, "/"),
    value,
  ]),
);

export const resolvePrototypeAssetUrl = (path?: string) => {
  if (!path) {
    return undefined;
  }

  const normalized = path.replace(/^\//, "").replace(/\\/g, "/");
  return assetUrlMap[normalized] ?? path;
};
