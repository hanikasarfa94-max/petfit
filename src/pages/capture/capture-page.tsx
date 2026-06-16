import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { demoAssets } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { usePetFitActions } from "../../app/store/use-petfit-store";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import {
  createFallbackRecognitionSession,
  recognizeCurrentCapture,
} from "../../features/recognition/recognition-api";
import styles from "./capture-page.module.css";

export function CaptureHubPage() {
  const navigate = useNavigate();
  const { upsertCaptureSession } = usePetFitActions();
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [statusText, setStatusText] = useState("拍好后交给云端识别");

  const handleRecognize = async () => {
    if (isRecognizing) {
      return;
    }

    setIsRecognizing(true);
    setStatusText("正在连接云端识别...");

    try {
      const session = await recognizeCurrentCapture();
      upsertCaptureSession(session);
      navigate("/capture/review");
    } catch (error) {
      const session = createFallbackRecognitionSession();
      upsertCaptureSession(session);
      setStatusText(error instanceof Error ? error.message : "云端识别暂时不可用");
      navigate("/capture/review");
    } finally {
      setIsRecognizing(false);
    }
  };

  return (
    <section className={`${shellStyles.page} ${styles.capturePage}`}>
      <header className={styles.header}>
        <Link to="/" className={styles.headerIconButton} aria-label="返回首页">
          <PrototypeAssetImage path={demoAssets.back} alt="" />
        </Link>

        <h1 className={styles.title}>拍一张</h1>

        <div className={styles.headerSpacer} aria-hidden="true" />
      </header>

      <section className={styles.previewZone} aria-label="拍摄预览">
        <PrototypeAssetImage
          className={styles.previewImage}
          path={demoAssets.preview}
          alt="当前拍摄内容"
        />
        <p className={styles.captureStatus}>{statusText}</p>
      </section>

      <div className={styles.actionRow}>
        <button className={styles.secondaryAction} type="button">
          <PrototypeAssetImage path={demoAssets.iconButtonRefresh} alt="" />
          <span>重拍</span>
        </button>

        <button
          className={styles.primaryAction}
          disabled={isRecognizing}
          type="button"
          onClick={handleRecognize}
        >
          <PrototypeAssetImage path={demoAssets.confirm} alt="" />
          <span>{isRecognizing ? "识别中" : "确认识别"}</span>
        </button>
      </div>
    </section>
  );
}
