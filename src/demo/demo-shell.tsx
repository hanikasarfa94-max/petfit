import type { CSSProperties, TouchEvent } from "react";
import { useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { demoAssets } from "./demo-data";
import styles from "./demo-shell.module.css";
import { resolvePrototypeAssetUrl } from "../features/recognition/asset-url";

const swipeRoutes = ["/", "/bowl", "/bottle", "/cushion"] as const;

const interactiveSelector = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[data-swipe-lock='true']",
].join(",");

const normalizePath = (pathname: string) => {
  if (pathname === "/" || pathname.startsWith("/bowl")) {
    return pathname === "/" ? "/" : "/bowl";
  }

  if (pathname.startsWith("/bottle")) {
    return "/bottle";
  }

  if (pathname.startsWith("/cushion")) {
    return "/cushion";
  }

  return undefined;
};

export function DemoShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const touchStartRef = useRef<{ x: number; y: number; locked: boolean } | null>(null);

  const stageAsset =
    pathname.startsWith("/bowl") ? demoAssets.bowlBg :
    pathname.startsWith("/bottle") ? demoAssets.bottleBg :
    pathname.startsWith("/cushion") ? demoAssets.sheetBg :
    pathname.startsWith("/settings") ? demoAssets.sheetBg :
    demoAssets.mainBg;

  const shellStyle = {
    "--stage-bg-image": `url("${resolvePrototypeAssetUrl(stageAsset)}")`,
  } as CSSProperties;

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      locked: Boolean(target?.closest(interactiveSelector)),
    };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;

    if (!start || start.locked || event.changedTouches.length === 0) {
      return;
    }

    const currentRoute = normalizePath(pathname);

    if (!currentRoute) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < 72 || absX < absY * 1.35) {
      return;
    }

    const routeIndex = swipeRoutes.indexOf(currentRoute);
    const nextIndex =
      deltaX < 0
        ? (routeIndex + 1) % swipeRoutes.length
        : (routeIndex - 1 + swipeRoutes.length) % swipeRoutes.length;

    navigate(swipeRoutes[nextIndex]);
  };

  return (
    <div
      className={styles.app}
      style={shellStyle}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div className={styles.viewport}>
        <Outlet />
      </div>
    </div>
  );
}
