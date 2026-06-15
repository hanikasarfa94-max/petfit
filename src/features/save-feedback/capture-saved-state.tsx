import type { CaptureSession } from "../../entities";
import { requireAsset } from "../../data";
import { ObjectHeroWrapper, SpeechBubble } from "../../shared";
import { getSelectedCandidates, inferPrimaryTargetObject } from "../recognition/mock-capture";
import { PrototypeAssetImage } from "../recognition/prototype-asset-image";
import styles from "./capture-saved-state.module.css";

type CaptureSavedStateProps = {
  session: CaptureSession;
};

export function CaptureSavedState({ session }: CaptureSavedStateProps) {
  const selectedCandidates = getSelectedCandidates(session);
  const primaryTarget = inferPrimaryTargetObject(session);
  const selectedFoods = selectedCandidates.filter(
    (candidate) => candidate.targetObject === "bowl",
  );
  const selectedDrinks = selectedCandidates.filter(
    (candidate) => candidate.targetObject === "bottle",
  );

  return (
    <>
      <SpeechBubble tone="mint" size="lg">
        {primaryTarget === "bowl"
          ? "Buding's bowl board just got a fresh update."
          : "Hydration was saved and the bottle board is ready to review."}
      </SpeechBubble>

      <ObjectHeroWrapper
        tone="mint"
        hero={
          <div className={styles.heroSummary}>
            <span className={styles.statusBadge}>Saved</span>
            <h2 className={styles.statusTitle}>Capture logged successfully</h2>
            <p className={styles.statusText}>
              The prototype used your selected recognition chips and turned them
              into the next daily record.
            </p>
          </div>
        }
      >
        <div className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Primary object</span>
            <span className={styles.summaryValue}>{primaryTarget}</span>
          </article>

          <article className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Selected items</span>
            <span className={styles.summaryValue}>{selectedCandidates.length}</span>
          </article>
        </div>
      </ObjectHeroWrapper>

      <section className={styles.selectionList} aria-label="Saved selections">
        {selectedCandidates.map((candidate) => (
          <article key={candidate.recognitionKey} className={styles.selectionChip}>
            <PrototypeAssetImage
              alt={candidate.label}
              path={requireAsset(candidate.stickerAssetName).webPath}
            />
            <span>{candidate.label}</span>
          </article>
        ))}
      </section>

      <article className={styles.supportCard}>
        <h3>What changed</h3>
        <p>
          {selectedFoods.length > 0
            ? `${selectedFoods.length} food sticker${selectedFoods.length > 1 ? "s were" : " was"} sent to Bowl.`
            : "No food stickers were selected for Bowl."}
        </p>
        <p>
          {selectedDrinks.length > 0
            ? `${selectedDrinks.length} drink sticker${selectedDrinks.length > 1 ? "s were" : " was"} sent to Bottle.`
            : "No drink stickers were selected for Bottle."}
        </p>
      </article>
    </>
  );
}
