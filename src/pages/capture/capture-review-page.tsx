import { Link, Navigate, useNavigate } from "react-router-dom";
import { demoAssets } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { usePetFitActions, usePetFitStore } from "../../app/store/use-petfit-store";
import type { CaptureRecognitionCandidate } from "../../entities";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import styles from "./capture-review-page.module.css";

const calorieByFoodKey: Record<string, number> = {
  beef: 90,
  bread: 78,
  chicken_leg: 126,
  fried_egg: 92,
  orange: 62,
  rice: 104,
  salad: 18,
  sandwich: 168,
  shrimp: 76,
  strawberry: 24,
};

const estimateCalories = (candidate: CaptureRecognitionCandidate) =>
  candidate.domain === "food" ? calorieByFoodKey[candidate.recognitionKey] ?? 60 : 0;

export function CaptureReviewFlowPage() {
  const navigate = useNavigate();
  const activeSession = usePetFitStore((state) =>
    state.captureSessions.find((session) => session.id === state.activeCaptureSessionId),
  );
  const { confirmCaptureSession, saveCaptureSession, toggleCaptureCandidate } =
    usePetFitActions();

  if (!activeSession) {
    return <Navigate to="/capture" replace />;
  }

  const selectedCandidates = activeSession.candidates.filter((candidate) => candidate.selected);
  const foodCandidates = selectedCandidates.filter((candidate) => candidate.domain === "food");
  const drinkCandidates = selectedCandidates.filter((candidate) => candidate.domain === "drink");
  const totalCalories = foodCandidates.reduce(
    (sum, candidate) => sum + estimateCalories(candidate),
    0,
  );

  const handleSave = () => {
    confirmCaptureSession(activeSession.id);
    saveCaptureSession(activeSession.id);
    navigate(foodCandidates.length > 0 ? "/bowl" : "/bottle");
  };

  return (
    <section className={`${shellStyles.page} ${styles.reviewPage}`}>
      <div className={shellStyles.topRow}>
        <Link to="/capture" className={shellStyles.backButton} aria-label="返回拍摄页">
          <PrototypeAssetImage path={demoAssets.back} alt="" />
        </Link>

        <div className={styles.completeBubble}>
          <div className={shellStyles.speechBubble}>
            识别完成啦，确认一下这次要记录的内容
          </div>
        </div>

        <PrototypeAssetImage
          className={styles.completeMascot}
          path={demoAssets.mascotSuccess}
          alt="布丁展示识别结果"
        />
      </div>

      <section className={styles.resultPanel}>
        <div className={styles.panelGlow} aria-hidden="true" />

        <header className={styles.panelHeader}>
          <h1 className={styles.resultTitle}>识别结果</h1>
          <p className={styles.resultNote}>{activeSession.notes}</p>
          <div className={styles.sectionHeader}>
            <span>已勾选 {selectedCandidates.length} 项</span>
            <span>{totalCalories > 0 ? `${totalCalories} kcal` : "饮水记录"}</span>
          </div>
        </header>

        <div className={styles.listSection}>
          {activeSession.candidates.map((candidate) => {
            const calories = estimateCalories(candidate);

            return (
              <button
                key={candidate.recognitionKey}
                className={`${styles.itemRow} ${candidate.selected ? styles.itemRowSelected : ""}`}
                type="button"
                onClick={() =>
                  toggleCaptureCandidate(activeSession.id, candidate.recognitionKey)
                }
              >
                <div className={styles.itemThumbWrap}>
                  <PrototypeAssetImage
                    className={styles.itemThumb}
                    path={`/assets/derived/named/${candidate.domain === "food" ? "sticker-food" : "sticker-drink"}/${candidate.stickerAssetName}`}
                    alt=""
                  />
                </div>

                <div className={styles.itemText}>
                  <strong>{candidate.label}</strong>
                  <span>
                    {candidate.domain === "food" ? "记录到饭碗" : "记录到水瓶"} ·
                    可信度 {Math.round(candidate.confidence * 100)}%
                  </span>
                </div>

                <div className={styles.itemMetric}>
                  <strong>{calories > 0 ? calories : "水"}</strong>
                  <span>{calories > 0 ? "kcal" : "drink"}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.totalRow}>
          <span>本次合计</span>
          <strong>{totalCalories > 0 ? `${totalCalories} kcal` : `${drinkCandidates.length} 杯`}</strong>
        </div>

        {drinkCandidates.length > 0 ? (
          <div className={styles.drinkCard}>
            <div className={styles.drinkThumbWrap}>
              <PrototypeAssetImage className={styles.drinkThumb} path={demoAssets.water} alt="" />
            </div>

            <div className={styles.drinkText}>
              <strong>检测到饮品</strong>
              <span>保存后会同步记录到水瓶</span>
            </div>

            <strong className={styles.drinkMetric}>约 {drinkCandidates.length * 300} ml</strong>
          </div>
        ) : null}
      </section>

      <div className={shellStyles.actionRow}>
        <Link to="/capture" className={shellStyles.secondaryLink}>
          重新拍一张
        </Link>
        <button className={shellStyles.primaryLink} type="button" onClick={handleSave}>
          确认保存
        </button>
      </div>
    </section>
  );
}
