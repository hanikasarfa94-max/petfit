import { Link } from "react-router-dom";
import { demoAssets } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import styles from "./home-page.module.css";

export function PetFitHomePage() {
  return (
    <section className={`${shellStyles.page} ${styles.homePage}`}>
      <div className={styles.roomScene}>
        <PrototypeAssetImage className={styles.sceneBackground} path={demoAssets.mainBg} alt="" />
        <div className={styles.sceneVeil} />

        <div className={styles.topBar}>
          <div className={styles.brandMark}>PetFit</div>

          <div className={styles.streakCard}>
            <PrototypeAssetImage
              className={styles.streakCardBg}
              path={demoAssets.shellButtonPillSecondaryLg}
              alt=""
            />
            <PrototypeAssetImage className={styles.streakFlame} path={demoAssets.effectFlame} alt="" />
            <div className={styles.streakCopy}>
              <span className={styles.streakLabel}>连续打卡</span>
              <strong className={styles.streakValue}>12 天</strong>
            </div>
          </div>
        </div>

        <Link to="/settings" className={styles.settingsButton} aria-label="打开设置">
          <PrototypeAssetImage
            className={styles.settingsButtonBg}
            path={demoAssets.shellButtonSquareSecondary}
            alt=""
          />
          <PrototypeAssetImage className={styles.settingsButtonIcon} path={demoAssets.settings} alt="" />
        </Link>

        <div className={styles.stickerZone} aria-hidden="true">
          <div className={styles.stickerPlaceholder} />
        </div>

        <PrototypeAssetImage className={styles.heroMascot} path={demoAssets.mascotSmile} alt="PetFit 布丁伙伴" />

        <Link to="/bowl" className={styles.objectHotspotLeft} aria-label="进入饭碗页面" />
        <Link to="/bottle" className={styles.objectHotspotRight} aria-label="进入水瓶页面" />
        <Link to="/cushion" className={styles.objectHotspotCenter} aria-label="进入休息页面" />

        <div className={styles.homeDock}>
          <Link to="/cushion" className={styles.dockSide}>
            <span className={styles.dockSideArtFrame} aria-hidden="true">
              <PrototypeAssetImage className={styles.dockSideIcon} path={demoAssets.rest} alt="" />
            </span>
            <span className={styles.dockSideLabel}>休息一下</span>
          </Link>

          <Link to="/capture" className={styles.dockPrimary} aria-label="打开拍摄">
            <PrototypeAssetImage className={styles.dockPrimaryIcon} path={demoAssets.camera} alt="" />
          </Link>

          <Link to="/bottle" className={styles.dockSide}>
            <span className={styles.dockSideArtFrame} aria-hidden="true">
              <PrototypeAssetImage className={styles.dockSideIcon} path={demoAssets.drink} alt="" />
            </span>
            <span className={styles.dockSideLabel}>喝口水</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
