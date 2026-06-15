import { Link } from "react-router-dom";
import { demoAssets, demoSettingsGroups } from "../../demo/demo-data";
import shellStyles from "../../demo/demo-shell.module.css";
import { PrototypeAssetImage } from "../../features/recognition/prototype-asset-image";
import { cx } from "../../shared/lib/cx";
import styles from "./settings-page.module.css";

export function SettingsPage() {
  return (
    <section className={cx(shellStyles.page, styles.settingsPage)}>
      <div className={shellStyles.topRow}>
        <Link to="/" className={shellStyles.backButton} aria-label="返回首页">
          <PrototypeAssetImage path={demoAssets.back} alt="" />
        </Link>

        <h1 className={styles.pageTitle}>设置</h1>
        <div className={shellStyles.topSpacer} />
      </div>

      <section className={styles.profileCard}>
        <PrototypeAssetImage
          className={styles.profileMascot}
          path={demoAssets.mascotSmile}
          alt="小布丁"
        />

        <div className={styles.profileInfo}>
          <h2>小布丁</h2>
          <p>你最贴心的朋友</p>

          <div className={styles.profileStats}>
            <div className={styles.profileStat}>
              <span>陪伴</span>
              <strong>128 天</strong>
            </div>
            <div className={styles.profileStat}>
              <span>一起记录</span>
              <strong>100 餐</strong>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.groupStack}>
        {demoSettingsGroups.map((group, index) => (
          <section key={index} className={styles.groupCard}>
            {group.items.map((item) => (
              <article key={item.title} className={styles.groupRow}>
                <div className={styles.groupIcon}>
                  <PrototypeAssetImage
                    className={styles.groupIconAsset}
                    path={item.iconPath}
                    alt=""
                  />
                </div>

                <div className={styles.groupText}>
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </div>

                <span className={styles.chevron}>›</span>
              </article>
            ))}
          </section>
        ))}
      </div>

      <p className={styles.footer}>PetFit · 陪你和小布丁过好每一天</p>
    </section>
  );
}
