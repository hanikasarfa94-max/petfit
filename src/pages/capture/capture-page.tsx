import { Link } from "react-router-dom";
import { demoAssets } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import styles from "./capture-page.module.css";

export function CaptureHubPage() {
  return (
    <section className={`${shellStyles.page} ${styles.capturePage}`}>
      <header className={styles.header}>
        <Link to="/" className={styles.headerIconButton} aria-label="返回首页">
          <PrototypeAssetImage path={demoAssets.back} alt="" />
        </Link>

        <h1 className={styles.title}>拍一下</h1>

        <div className={styles.headerSpacer} aria-hidden="true" />
      </header>

      <section className={styles.previewZone} aria-label="拍摄预览">
        <PrototypeAssetImage
          className={styles.previewImage}
          path={demoAssets.preview}
          alt="示例拍摄内容"
        />
      </section>

      <div className={styles.actionRow}>
        <Link to="/capture" className={styles.secondaryAction}>
          <PrototypeAssetImage path={demoAssets.iconButtonRefresh} alt="" />
          <span>重拍</span>
        </Link>

        <Link to="/capture/review" className={styles.primaryAction}>
          <PrototypeAssetImage path={demoAssets.confirm} alt="" />
          <span>确认上传</span>
        </Link>
      </div>
    </section>
  );
}
