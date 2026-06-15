import { Link, Navigate, useParams } from "react-router-dom";
import { usePetFitStore } from "../../app/store";
import { recognitionCatalog } from "../../data";
import { selectHomeScene } from "../../domain";
import type { PetFitDomainState, RestMode } from "../../entities";
import shellStyles from "../../demo/demo-shell.module.css";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import { cx } from "../../shared/lib/cx";
import styles from "./object-stats-page.module.css";

type StatsObjectKey = "bowl" | "bottle" | "cushion";

type DayPoint = {
  date: string;
  label: string;
  value: number;
};

type StatsView = {
  title: string;
  heroLabel: string;
  heroValue: string;
  seriesLabel: string;
  barAccentClassName: string;
  objectAssetPath: string;
  backTo: string;
  continueLabel: string;
  facts: Array<{ label: string; value: string }>;
  series: DayPoint[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

const toDayKey = (value: string) => value.slice(0, 10);

const isStatsObjectKey = (value: string | undefined): value is StatsObjectKey =>
  value === "bowl" || value === "bottle" || value === "cushion";

const buildTrailingDays = (selectedDate: string, count: number) => {
  const anchor = new Date(`${selectedDate}T00:00:00Z`);

  return Array.from({ length: count }, (_, index) => {
    const offset = count - index - 1;
    const current = new Date(anchor.getTime() - offset * DAY_MS);

    return {
      date: current.toISOString().slice(0, 10),
      label: `${current.getUTCMonth() + 1}/${current.getUTCDate()}`,
    };
  });
};

const topCountEntry = (counts: Record<string, number>) => {
  const [key, count] =
    Object.entries(counts).sort((left, right) => right[1] - left[1])[0] ?? [];

  return key ? { key, count } : undefined;
};

const formatModeLabel = (mode: RestMode) => {
  if (mode === "nap") {
    return "小憩";
  }

  if (mode === "sleep") {
    return "睡眠";
  }

  return "放松";
};

const formatPercent = (value: number) =>
  `${Math.round(Math.max(0, Math.min(value, 1)) * 100)}%`;

const buildBowlStats = (state: PetFitDomainState): StatsView => {
  const homeScene = selectHomeScene(state);
  const selectedDate = state.selectedDate;
  const todayRecords = state.foodRecords.filter(
    (record) => toDayKey(record.occurredAt) === selectedDate,
  );
  const days = buildTrailingDays(selectedDate, 7);
  const mealSeries = days.map((day) => ({
    ...day,
    value: state.foodRecords
      .filter((record) => toDayKey(record.occurredAt) === day.date)
      .reduce((sum, record) => sum + record.totalItems, 0),
  }));
  const daysWithRecords = mealSeries.filter((item) => item.value > 0).length;
  const todayTotal = todayRecords.reduce((sum, record) => sum + record.totalItems, 0);
  const recognitionCounts = todayRecords.reduce<Record<string, number>>((acc, record) => {
    record.recognitionKeys.forEach((key) => {
      acc[key] = (acc[key] ?? 0) + 1;
    });
    return acc;
  }, {});
  const topFood = topCountEntry(recognitionCounts);
  const weeklyStickerTotal = mealSeries.reduce((sum, item) => sum + item.value, 0);

  return {
    title: "饭碗统计",
    heroLabel: "最近 7 天记录率",
    heroValue: formatPercent(daysWithRecords / 7),
    seriesLabel: "最近 7 天饮食贴纸数量",
    barAccentClassName: styles.barFillMeal,
    objectAssetPath: homeScene.bowlAsset.webPath,
    backTo: "/bowl",
    continueLabel: "继续记录",
    facts: [
      { label: "今日热量", value: `${todayTotal * 49} kcal` },
      { label: "已记录餐次", value: `${todayRecords.length} 餐` },
      {
        label: "最常出现",
        value: topFood
          ? recognitionCatalog.byKey[topFood.key]?.displayName ?? topFood.key
          : "暂无",
      },
      { label: "最近 7 天", value: `${weeklyStickerTotal} 个贴纸` },
    ],
    series: mealSeries,
  };
};

const buildBottleStats = (state: PetFitDomainState): StatsView => {
  const homeScene = selectHomeScene(state);
  const selectedDate = state.selectedDate;
  const hydrationGoal = state.petProfile.wellnessGoals.hydrationMl;
  const todayRecords = state.drinkRecords.filter(
    (record) => toDayKey(record.occurredAt) === selectedDate,
  );
  const days = buildTrailingDays(selectedDate, 7);
  const drinkSeries = days.map((day) => ({
    ...day,
    value: state.drinkRecords
      .filter((record) => toDayKey(record.occurredAt) === day.date)
      .reduce((sum, record) => sum + record.amountMl, 0),
  }));
  const todayHydration = todayRecords.reduce((sum, record) => sum + record.amountMl, 0);
  const recognitionCounts = todayRecords.reduce<Record<string, number>>((acc, record) => {
    if (record.recognitionKey) {
      acc[record.recognitionKey] = (acc[record.recognitionKey] ?? 0) + 1;
    }
    return acc;
  }, {});
  const topDrink = topCountEntry(recognitionCounts);
  const achievedDays = drinkSeries.filter((item) => item.value >= hydrationGoal).length;

  return {
    title: "水瓶统计",
    heroLabel: "最近 7 天达标率",
    heroValue: formatPercent(achievedDays / 7),
    seriesLabel: "最近 7 天饮水量",
    barAccentClassName: styles.barFillWater,
    objectAssetPath: homeScene.bottleAsset.webPath,
    backTo: "/bottle",
    continueLabel: "喝口水",
    facts: [
      { label: "今日饮水", value: `${todayHydration} ml` },
      {
        label: "距离目标",
        value: `${Math.max(hydrationGoal - todayHydration, 0)} ml`,
      },
      {
        label: "最常出现",
        value: topDrink
          ? recognitionCatalog.byKey[topDrink.key]?.displayName ?? topDrink.key
          : "暂无",
      },
      { label: "达标天数", value: `${achievedDays} / 7 天` },
    ],
    series: drinkSeries,
  };
};

const buildCushionStats = (state: PetFitDomainState): StatsView => {
  const homeScene = selectHomeScene(state);
  const selectedDate = state.selectedDate;
  const restGoal = state.petProfile.wellnessGoals.restMinutes;
  const todayRecords = state.restRecords.filter(
    (record) => toDayKey(record.occurredAt) === selectedDate,
  );
  const days = buildTrailingDays(selectedDate, 7);
  const restSeries = days.map((day) => ({
    ...day,
    value: state.restRecords
      .filter((record) => toDayKey(record.occurredAt) === day.date)
      .reduce((sum, record) => sum + record.durationMinutes, 0),
  }));
  const todayRest = todayRecords.reduce((sum, record) => sum + record.durationMinutes, 0);
  const modeCounts = todayRecords.reduce<Record<string, number>>((acc, record) => {
    acc[record.restMode] = (acc[record.restMode] ?? 0) + 1;
    return acc;
  }, {});
  const topMode = topCountEntry(modeCounts);
  const achievedDays = restSeries.filter((item) => item.value >= restGoal).length;

  return {
    title: "休息统计",
    heroLabel: "最近 7 天达标率",
    heroValue: formatPercent(achievedDays / 7),
    seriesLabel: "最近 7 天休息时长",
    barAccentClassName: styles.barFillRest,
    objectAssetPath: homeScene.cushionAsset.webPath,
    backTo: "/cushion",
    continueLabel: "休息一下",
    facts: [
      { label: "今日休息", value: `${todayRest} 分钟` },
      { label: "距离目标", value: `${Math.max(restGoal - todayRest, 0)} 分钟` },
      {
        label: "主要模式",
        value: topMode ? formatModeLabel(topMode.key as RestMode) : "暂无",
      },
      { label: "达标天数", value: `${achievedDays} / 7 天` },
    ],
    series: restSeries,
  };
};

const buildStatsView = (state: PetFitDomainState, object: StatsObjectKey): StatsView => {
  if (object === "bottle") {
    return buildBottleStats(state);
  }

  if (object === "cushion") {
    return buildCushionStats(state);
  }

  return buildBowlStats(state);
};

const maxSeriesValue = (series: DayPoint[]) =>
  Math.max(...series.map((item) => item.value), 1);

export function ObjectStatsRoutePage() {
  const { object: objectParam } = useParams();

  if (!isStatsObjectKey(objectParam)) {
    return <Navigate to="/" replace />;
  }

  const state = usePetFitStore();
  const stats = buildStatsView(state, objectParam);
  const seriesMax = maxSeriesValue(stats.series);

  return (
    <section className={shellStyles.page}>
      <div className={shellStyles.topRow}>
        <Link to={stats.backTo} className={shellStyles.backButton} aria-label="返回上一页">
          <PrototypeAssetImage path="/assets/derived/ui-kit/icon_button_back.png" alt="" />
        </Link>

        <h1 className={shellStyles.title}>{stats.title}</h1>
        <div className={shellStyles.topSpacer} />
      </div>

      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <span className={styles.heroEyebrow}>{stats.heroLabel}</span>
            <strong className={styles.heroValue}>{stats.heroValue}</strong>
          </div>

          <PrototypeAssetImage
            className={styles.heroMascot}
            path={stats.objectAssetPath}
            alt="统计对象图标"
          />
        </div>

        <div className={styles.seriesHeading}>{stats.seriesLabel}</div>

        <div className={styles.barChart} aria-label={`${stats.title}${stats.seriesLabel}`}>
          {stats.series.map((item) => (
            <div key={item.date} className={styles.barColumn}>
              <div className={styles.barVisual}>
                <span className={styles.barTrack} />
                <span
                  className={cx(styles.barFill, stats.barAccentClassName)}
                  style={{
                    height: `${Math.max(
                      (item.value / seriesMax) * 100,
                      item.value > 0 ? 18 : 6,
                    )}%`,
                  }}
                />
              </div>
              <span className={styles.barLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.factsGrid}>
        {stats.facts.map((fact) => (
          <article key={fact.label} className={styles.factCard}>
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </article>
        ))}
      </section>

      <div className={shellStyles.actionRow}>
        <Link to={stats.backTo} className={shellStyles.secondaryLink}>
          返回对象页
        </Link>
        <Link to="/capture" className={shellStyles.primaryLink}>
          {stats.continueLabel}
        </Link>
      </div>
    </section>
  );
}
