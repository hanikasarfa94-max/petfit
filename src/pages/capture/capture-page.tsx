import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useEffect, useRef, useState } from "react";
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
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [statusText, setStatusText] = useState("正在准备相机...");

  useEffect(() => {
    let cancelled = false;

    const startInlineCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatusText("当前环境不支持页面内相机，可使用系统相机兜底");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            height: { ideal: 1280 },
            width: { ideal: 960 },
          },
        });

        if (cancelled) {
          stopStream(stream);
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraReady(true);
        setStatusText("把食物或饮品放进取景框");
      } catch (error) {
        setStatusText(
          error instanceof Error
            ? `页面内相机不可用：${error.message}`
            : "页面内相机不可用，可使用系统相机兜底",
        );
      }
    };

    startInlineCamera();

    return () => {
      cancelled = true;
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, []);

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
      if (cameraReady) {
        const imageDataUrl = captureInlineFrame();
        setCapturedImageDataUrl(imageDataUrl);
        setStatusText("照片已拍下，可以开始识别");
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
      setStatusText(
        error instanceof Error
          ? `拍摄失败：${error.message}`
          : "拍摄失败，可先用测试图继续",
      );
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const handleRecognize = async () => {
    if (isRecognizing) {
      return;
    }

    setIsRecognizing(true);
    setStatusText(capturedImageDataUrl ? "正在识别照片..." : "正在用测试图识别...");

    try {
      const session = await recognizeCurrentCapture(capturedImageDataUrl);
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
              {!cameraReady ? (
                <PrototypeAssetImage
                  className={styles.previewImage}
                  path={demoAssets.preview}
                  alt="测试拍摄内容"
                />
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
          onClick={() => {
            if (capturedImageDataUrl) {
              setCapturedImageDataUrl(undefined);
              setStatusText(cameraReady ? "把食物或饮品放进取景框" : "可以重新拍摄");
              return;
            }
            void handleTakePhoto();
          }}
        >
          <PrototypeAssetImage path={demoAssets.camera} alt="" />
          <span>{capturedImageDataUrl ? "重拍" : cameraReady ? "拍下" : "打开相机"}</span>
        </button>

        <button
          className={styles.primaryAction}
          disabled={isRecognizing || isTakingPhoto}
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
