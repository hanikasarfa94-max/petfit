import type { CSSProperties } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { demoAssets } from "./demo-data";
import styles from "./demo-shell.module.css";
import { resolvePrototypeAssetUrl } from "../features/recognition/asset-url";

function StatusBar() {
  return (
    <div className={styles.statusBar} aria-hidden="true">
      <span>9:41</span>

      <div className={styles.statusIcons}>
        <span className={styles.signal}>
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className={styles.wifi} />
        <span className={styles.battery} />
      </div>
    </div>
  );
}

export function DemoShell() {
  const { pathname } = useLocation();

  const stageAsset =
    pathname.startsWith("/bowl") ? demoAssets.bowlBg :
    pathname.startsWith("/bottle") ? demoAssets.bottleBg :
    pathname.startsWith("/cushion") ? demoAssets.sheetBg :
    pathname.startsWith("/settings") ? demoAssets.sheetBg :
    demoAssets.mainBg;

  const shellStyle = {
    "--stage-bg-image": `url("${resolvePrototypeAssetUrl(stageAsset)}")`,
  } as CSSProperties;

  return (
    <div className={styles.app} style={shellStyle}>
      <div className={styles.phone}>
        <StatusBar />
        <div className={styles.viewport}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
