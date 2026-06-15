import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { usePetFitActions, usePetFitStore } from "../../app/store";
import { demoAssets, demoDrinkChoices } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import { cx } from "../../shared/lib/cx";
import styles from "./bottle-page.module.css";

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

const drinkPositions = [
  styles.drinkLeftTop,
  styles.drinkRightTop,
  styles.drinkLeftBottom,
  styles.drinkRightBottom,
] as const;

export function BottlePage() {
  const selectedDate = usePetFitStore((state) => state.selectedDate);
  const { setSelectedDate } = usePetFitActions();
  const dateRailRef = useRef<HTMLDivElement | null>(null);
  const dateItems = useMemo(() => buildDateItems(selectedDate), [selectedDate]);

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
    <section className={`${shellStyles.page} ${styles.bottlePage}`}>
      <div className={shellStyles.topRow}>
        <Link to="/" className={shellStyles.backButton} aria-label="返回首页">
          <PrototypeAssetImage path={demoAssets.back} alt="" />
        </Link>

        <h1 className={shellStyles.title}>水瓶</h1>
        <div className={shellStyles.topSpacer} />
      </div>

      <section className={styles.roomScene}>
        <PrototypeAssetImage className={styles.sceneBackground} path={demoAssets.bottleBg} alt="" />
        <div className={styles.sceneVeil} />

        <div className={styles.heroBubble}>记得多喝水哦</div>
        <PrototypeAssetImage
          className={styles.heroMascot}
          path={demoAssets.mascotWave}
          alt="PetFit 仓鼠伙伴"
        />

        {demoDrinkChoices.map((item, index) => (
          <div key={item.title} className={cx(styles.drinkBadge, drinkPositions[index])}>
            {item.badge ? <span className={styles.badgeTag}>{item.badge}</span> : null}
            <PrototypeAssetImage path={item.image} alt={item.title} />
          </div>
        ))}

        <section className={cx(styles.dateRailWrap, styles.dateRailOverlay)}>
          <div ref={dateRailRef} className={styles.dateRail}>
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
          <Link to="/capture" className={cx(shellStyles.primaryLink, styles.actionLink)}>
            <PrototypeAssetImage className={shellStyles.linkIcon} path={demoAssets.drink} alt="" />
            喝口水
          </Link>
          <Link to="/bottle/stats" className={cx(shellStyles.secondaryLink, styles.actionLink)}>
            <PrototypeAssetImage className={shellStyles.linkIcon} path={demoAssets.stats} alt="" />
            查看统计
          </Link>
        </div>
      </section>
    </section>
  );
}
