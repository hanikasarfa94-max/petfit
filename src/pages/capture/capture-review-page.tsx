import { Link } from "react-router-dom";
import { demoAssets, demoRecognitionItems } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import styles from "./capture-review-page.module.css";

const totalCalories = demoRecognitionItems.reduce((sum, item) => sum + item.calories, 0);

export function CaptureReviewFlowPage() {
  return (
    <section className={`${shellStyles.page} ${styles.reviewPage}`}>
      <div className={shellStyles.topRow}>
        <Link to="/capture" className={shellStyles.backButton} aria-label="返回拍摄页">
          <PrototypeAssetImage path={demoAssets.back} alt="" />
        </Link>

        <div className={styles.completeBubble}>
          <div className={shellStyles.speechBubble}>识别完成啦，看看这次抓到了什么</div>
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
          <div className={styles.sectionHeader}>
            <span>食物（优先记录到饭碗）</span>
            <span>估算热量</span>
          </div>
        </header>

        <div className={styles.listSection}>
          {demoRecognitionItems.map((item) => (
            <article key={item.title} className={styles.itemRow}>
              <div className={styles.itemThumbWrap}>
                <PrototypeAssetImage className={styles.itemThumb} path={item.image} alt="" />
              </div>

              <div className={styles.itemText}>
                <strong>{item.title}</strong>
                <span>{item.note}</span>
              </div>

              <div className={styles.itemMetric}>
                <strong>{item.calories}</strong>
                <span>kcal</span>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.totalRow}>
          <span>食物合计</span>
          <strong>{totalCalories} kcal</strong>
        </div>

        <div className={styles.drinkCard}>
          <div className={styles.drinkThumbWrap}>
            <PrototypeAssetImage className={styles.drinkThumb} path={demoAssets.water} alt="" />
          </div>

          <div className={styles.drinkText}>
            <strong>检测到饮品</strong>
            <span>已同步记录到水瓶</span>
          </div>

          <strong className={styles.drinkMetric}>约 250 ml</strong>
        </div>
      </section>

      <div className={shellStyles.actionRow}>
        <Link to="/capture" className={shellStyles.secondaryLink}>
          重新拍一张
        </Link>
        <Link to="/bowl" className={shellStyles.primaryLink}>
          确认保存
        </Link>
      </div>
    </section>
  );
}
