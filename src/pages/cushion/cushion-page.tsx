import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePetFitActions, usePetFitStore } from "../../app/store";
import { demoAssets } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { selectCushionView } from "../../domain";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import { RestSheet } from "../../features/rest-sheet";
import { cx } from "../../shared/lib/cx";
import styles from "./cushion-page.module.css";

const DAY_MS = 24 * 60 * 60 * 1000;

const buildDateItems = (selectedDate: string) => {
  const anchor = new Date(`${selectedDate}T00:00:00Z`);

  return [-1, 0, 1].map((offset) => {
    const current = new Date(anchor.getTime() + offset * DAY_MS);
    const iso = current.toISOString().slice(0, 10);
    const weekday = new Intl.DateTimeFormat("zh-CN", {
      weekday: "short",
      timeZone: "UTC",
    }).format(current);

    return {
      date: iso,
      day: offset === 0 ? "今天" : weekday,
      label: `${current.getUTCMonth() + 1}/${current.getUTCDate()}`,
      selected: offset === 0,
    };
  });
};

export function CushionPage() {
  const view = usePetFitStore((state) => selectCushionView(state));
  const { setSelectedDate } = usePetFitActions();
  const [sheetOpen, setSheetOpen] = useState(false);
  const dateRailRef = useRef<HTMLDivElement | null>(null);

  const dateItems = useMemo(() => buildDateItems(view.selectedDate), [view.selectedDate]);
  const remainingMinutes = Math.max(view.restGoalMinutes - view.totalMinutes, 0);

  useEffect(() => {
    const rail = dateRailRef.current;
    const selectedChip = rail?.querySelector<HTMLElement>("[data-selected='true']");

    if (!rail || !selectedChip) {
      return;
    }

    const targetLeft =
      selectedChip.offsetLeft - rail.clientWidth / 2 + selectedChip.clientWidth / 2;

    rail.scrollTo({ left: Math.max(0, targetLeft), behavior: "auto" });
  }, [view.selectedDate]);

  return (
    <>
      <section className={`${shellStyles.page} ${styles.cushionPage}`}>
        <PrototypeAssetImage className={styles.pageBackground} path={demoAssets.sheetBg} alt="" />
        <div className={styles.pageVeil} />

        <div className={shellStyles.topRow}>
          <Link to="/" className={shellStyles.backButton} aria-label="返回首页">
            <PrototypeAssetImage path={demoAssets.back} alt="" />
          </Link>

          <h1 className={shellStyles.title}>休息</h1>
          <div className={shellStyles.topSpacer} />
        </div>

        <section className={styles.roomScene}>
          <div className={styles.heroBubble}>
            {remainingMinutes > 0
              ? `再休息 ${remainingMinutes} 分钟就更好了`
              : "今天已经休息得很不错了"}
          </div>

          <div className={styles.summaryPanel}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>今日休息</span>
              <strong className={styles.summaryValue}>{view.records.length} 次</strong>
            </div>

            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>目标</span>
              <strong className={styles.summaryValue}>{view.restGoalMinutes} 分钟</strong>
            </div>
          </div>

          <button
            type="button"
            className={styles.sceneObjectButton}
            onClick={() => setSheetOpen(true)}
            aria-label="打开休息日志"
          >
            <PrototypeAssetImage
              className={styles.sceneObject}
              path={view.objectAsset.webPath}
              alt=""
            />
          </button>

          <section className={cx(styles.dateRailWrap, styles.dateRailOverlay)}>
            <div ref={dateRailRef} className={styles.dateRail} data-swipe-lock="true">
              {dateItems.map((item) => (
                <button
                  key={item.date}
                  type="button"
                  data-selected={item.selected ? "true" : undefined}
                  className={cx(
                    shellStyles.dateChip,
                    styles.dateChip,
                    item.selected && styles.dateChipStrong,
                  )}
                  onClick={() => setSelectedDate(item.date)}
                >
                  <span className={shellStyles.dateValue}>{item.label}</span>
                  <span className={shellStyles.dateLabel}>{item.day}</span>
                </button>
              ))}
            </div>
          </section>

          <div className={cx(shellStyles.actionRow, styles.actionRow, styles.actionRowOverlay)}>
            <button
              type="button"
              className={cx(shellStyles.primaryLink, styles.actionButton)}
              onClick={() => setSheetOpen(true)}
            >
              <PrototypeAssetImage
                className={shellStyles.linkIcon}
                path={demoAssets.rest}
                alt=""
              />
              休息一下
            </button>

            <Link to="/cushion/stats" className={cx(shellStyles.secondaryLink, styles.actionButton)}>
              <PrototypeAssetImage className={shellStyles.linkIcon} path={demoAssets.stats} alt="" />
              查看统计
            </Link>
          </div>
        </section>
      </section>

      <RestSheet
        existingCount={view.records.length}
        onClose={() => setSheetOpen(false)}
        open={sheetOpen}
        selectedDate={view.selectedDate}
      />
    </>
  );
}
