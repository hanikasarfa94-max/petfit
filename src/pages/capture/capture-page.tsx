import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePetFitActions } from "../../app/store/use-petfit-store";
import { demoAssets } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { recognizeCurrentCapture } from "../../features/recognition/recognition-api";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import styles from "./capture-page.module.css";

const toDataUrl = (base64: string, format = "jpeg") =>
  `data:image/${format};base64,${base64}`;

const stopStream = (stream?: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop());
};

export function CaptureHubPage() {
  const navigate = useNavigate();
  const { upsertCaptureSession } = usePetFitActions();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImageDataUrl, setCapturedImageDataUrl] = useState<string>();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [statusText, setStatusText] = useState("先拍一张食物或饮品照片，再开始识别");

  useEffect(() => {
    return () => {
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  const startInlineCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatusText("当前环境不支持页内相机，将打开系统相机");
      return false;
    }

    try {
      stopStream(streamRef.current);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          height: { ideal: 1280 },
          width: { ideal: 960 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      setCameraReady(true);
      setStatusText("把食物或饮品放进取景框");
      return true;
    } catch (error) {
      setCameraActive(false);
      setCameraReady(false);
      setStatusText(
        error instanceof Error ? `页内相机不可用：${error.message}` : "页内相机不可用",
      );
      return false;
    }
  };

  const captureInlineFrame = () => {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error("相机画面还没准备好");
    }

    const canvas = document.createElement("canvas");
    const maxSide = 1280;
    const scale = Math.min(1, maxSide / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("无法读取相机画面");
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.76);
  };

  const handleTakePhoto = async () => {
    if (isTakingPhoto || isRecognizing) {
      return;
    }

    setIsTakingPhoto(true);

    try {
      if (capturedImageDataUrl) {
        setCapturedImageDataUrl(undefined);
        await startInlineCamera();
        return;
      }

      if (cameraReady) {
        const imageDataUrl = captureInlineFrame();
        setCapturedImageDataUrl(imageDataUrl);
        stopStream(streamRef.current);
        streamRef.current = null;
        setCameraActive(false);
        setCameraReady(false);
        setStatusText("照片已拍下，可以开始识别");
        return;
      }

      setStatusText("正在打开相机...");
      const inlineStarted = await startInlineCamera();

      if (inlineStarted) {
        return;
      }

      setStatusText("正在打开系统相机...");
      const photo = await Camera.getPhoto({
        allowEditing: false,
        correctOrientation: true,
        height: 1280,
        quality: 72,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width: 1280,
      });

      if (!photo.base64String) {
        throw new Error("没有拿到照片数据");
      }

      setCapturedImageDataUrl(toDataUrl(photo.base64String, photo.format));
      setStatusText("照片已准备好，可以开始识别");
    } catch (error) {
      setStatusText(error instanceof Error ? `拍摄失败：${error.message}` : "拍摄失败，请重新尝试");
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const handleRecognize = async () => {
    if (isRecognizing) {
      return;
    }

    if (!capturedImageDataUrl) {
      setStatusText("请先拍一张照片");
      return;
    }

    setIsRecognizing(true);
    setStatusText("正在识别照片...");

    try {
      const session = await recognizeCurrentCapture(capturedImageDataUrl);
      upsertCaptureSession(session);
      navigate("/capture/review");
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "云端识别暂时不可用，请稍后重试");
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
        <div className={styles.cameraFrame}>
          {capturedImageDataUrl ? (
            <PrototypeAssetImage
              className={styles.previewImage}
              path={capturedImageDataUrl}
              alt="刚拍下的照片"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                className={styles.cameraVideo}
                autoPlay
                muted
                playsInline
              />
              {!cameraActive ? (
                <div className={styles.cameraPlaceholder}>
                  <PrototypeAssetImage
                    className={styles.placeholderIcon}
                    path={demoAssets.camera}
                    alt=""
                  />
                  <strong>打开相机开始拍摄</strong>
                  <span>照片只用于本次识别</span>
                </div>
              ) : null}
            </>
          )}
        </div>
        <p className={styles.captureStatus}>{statusText}</p>
      </section>

      <div className={styles.actionRow}>
        <button
          className={styles.secondaryAction}
          disabled={isTakingPhoto || isRecognizing}
          type="button"
          onClick={() => void handleTakePhoto()}
        >
          <PrototypeAssetImage path={demoAssets.camera} alt="" />
          <span>{capturedImageDataUrl ? "重拍" : cameraReady ? "拍下" : "打开相机"}</span>
        </button>

        <button
          className={styles.primaryAction}
          disabled={isRecognizing || isTakingPhoto || !capturedImageDataUrl}
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
