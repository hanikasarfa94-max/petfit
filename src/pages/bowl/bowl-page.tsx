import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { requireRecognitionEntry } from "../../data";
import { usePetFitActions, usePetFitStore } from "../../app/store";
import { demoAssets } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import { SheetShell } from "../../shared/ui/mobile-shell";
import { cx } from "../../shared/lib/cx";
import styles from "./bowl-page.module.css";

const DAY_MS = 24 * 60 * 60 * 1000;

const buildDateItems = (selectedDate: string) => {
  const anchor = new Date(`${selectedDate}T00:00:00Z`);

  return Array.from({ length: 7 }, (_, index) => {
    const offset = index - 3;
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

const plateItems = [
  { className: styles.itemRice, path: demoAssets.rice, alt: "米饭" },
  { className: styles.itemEgg, path: demoAssets.egg, alt: "鸡蛋" },
  { className: styles.itemBread, path: demoAssets.bread, alt: "面包" },
  { className: styles.itemSalad, path: demoAssets.salad, alt: "沙拉" },
  { className: styles.itemBroccoli, path: demoAssets.broccoli, alt: "西兰花" },
  { className: styles.itemOrange, path: demoAssets.orange, alt: "橙子" },
  { className: styles.itemSandwich, path: demoAssets.sandwich, alt: "三明治" },
  { className: styles.itemChicken, path: demoAssets.roastChicken, alt: "鸡腿" },
  { className: styles.itemShrimp, path: demoAssets.shrimp, alt: "虾仁" },
  { className: styles.itemBerryBowl, path: demoAssets.bowl, alt: "水果碗" },
] as const;

const formatMealSlot = (value: string) => {
  switch (value) {
    case "breakfast":
      return "早餐";
    case "lunch":
      return "午餐";
    case "dinner":
      return "晚餐";
    default:
      return "加餐";
  }
};

const formatClock = (value: string) =>
  new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));

export function BowlPage() {
  const selectedDate = usePetFitStore((state) => state.selectedDate);
  const foodRecords = usePetFitStore((state) => state.foodRecords);
  const { setSelectedDate } = usePetFitActions();
  const [detailOpen, setDetailOpen] = useState(false);
  const dateRailRef = useRef<HTMLDivElement | null>(null);
  const dateItems = useMemo(() => buildDateItems(selectedDate), [selectedDate]);
  const dayRecords = useMemo(
    () =>
      foodRecords
        .filter((record) => record.occurredAt.slice(0, 10) === selectedDate)
        .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt)),
    [foodRecords, selectedDate],
  );

  useEffect(() => {
    const rail = dateRailRef.current;
    const selectedChip = rail?.querySelector<HTMLElement>("[data-selected='true']");

    if (!rail || !selectedChip) {
      return;
    }

    const targetLeft =
      selectedChip.offsetLeft - rail.clientWidth / 2 + selectedChip.clientWidth / 2;

    rail.scrollTo({ left: Math.max(0, targetLeft), behavior: "auto" });
  }, [selectedDate]);

  return (
    <section className={`${shellStyles.page} ${styles.bowlPage}`}>
      <section className={styles.plateScene} aria-hidden="true">
        <PrototypeAssetImage className={styles.sceneBackground} path={demoAssets.bowlBg} alt="" />
        <div className={styles.sceneVeil} />

        <div className={styles.plateLayout}>
          <div className={styles.plateSafeZone}>
            <div className={styles.itemsLayer}>
              {plateItems.map((item) => (
                <PrototypeAssetImage
                  key={item.alt}
                  className={cx(styles.plateItem, item.className)}
                  path={item.path}
                  alt={item.alt}
                />
              ))}
            </div>

            <button
              type="button"
              className={styles.detailTrigger}
              onClick={() => setDetailOpen(true)}
              aria-label="打开当日饮食明细"
            />
          </div>

          <button
            type="button"
            className={styles.moreBadge}
            onClick={() => setDetailOpen(true)}
            aria-label="查看更多食物明细"
          >
            +3
          </button>
        </div>
      </section>

      <div className={cx(shellStyles.topRow, styles.topRow)}>
        <Link to="/" className={shellStyles.backButton} aria-label="返回首页">
          <PrototypeAssetImage path={demoAssets.back} alt="" />
        </Link>

        <h1 className={shellStyles.title}>饭碗</h1>
        <div className={shellStyles.topSpacer} />
      </div>

      <div className={styles.sceneSpacer} />

      <section className={styles.dateRailWrap}>
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

      <div className={styles.actionRow}>
        <Link to="/capture" className={shellStyles.primaryLink}>
          <PrototypeAssetImage className={shellStyles.linkIcon} path={demoAssets.camera} alt="" />
          拍一下
        </Link>
        <Link to="/bowl/stats" className={shellStyles.secondaryLink}>
          <PrototypeAssetImage className={shellStyles.linkIcon} path={demoAssets.stats} alt="" />
          查看统计
        </Link>
      </div>

      <SheetShell
        className={styles.detailSheet}
        dismissAction={
          <button
            type="button"
            className={styles.sheetCloseButton}
            onClick={() => setDetailOpen(false)}
          >
            关闭
          </button>
        }
        open={detailOpen}
        title="今日饮食明细"
        subtitle="点击餐盘展开的演示日志"
      >
        <div className={styles.detailList}>
          {dayRecords.length === 0 ? (
            <div className={styles.detailEmpty}>
              今天还没有记录，拍一下或手动补一餐就会出现在这里。
            </div>
          ) : (
            dayRecords.map((record) => (
              <article key={record.id} className={styles.detailCard}>
                <div className={styles.detailMetaRow}>
                  <span className={styles.detailSlot}>{formatMealSlot(record.mealSlot)}</span>
                  <span className={styles.detailTime}>{formatClock(record.occurredAt)}</span>
                </div>

                <div className={styles.detailTags}>
                  {record.recognitionKeys.map((key) => (
                    <span key={`${record.id}-${key}`} className={styles.detailTag}>
                      {requireRecognitionEntry(key).displayName}
                    </span>
                  ))}
                </div>

                {record.notes ? <p className={styles.detailNotes}>{record.notes}</p> : null}
              </article>
            ))
          )}
        </div>
      </SheetShell>
    </section>
  );
}
