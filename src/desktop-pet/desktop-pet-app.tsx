import { useMemo, useState } from "react";
import { demoAssets } from "../demo/demo-data";
import { PrototypeAssetImage } from "../features/recognition/prototype-asset-image";
import styles from "./desktop-pet-app.module.css";

type PetMood = "cheer" | "hungry" | "thirsty" | "sleepy";

const moods: Record<
  PetMood,
  {
    action: string;
    asset: string;
    bubble: string;
    label: string;
  }
> = {
  cheer: {
    action: "陪你打卡",
    asset: demoAssets.mascotWave,
    bubble: "今天也一起照顾自己吧",
    label: "开心",
  },
  hungry: {
    action: "吃点东西",
    asset: "/assets/derived/named/character/character_buding_hungry_empty_bowl.png",
    bubble: "饭碗有点空，来记录一口？",
    label: "饿了",
  },
  thirsty: {
    action: "喝口水",
    asset: "/assets/derived/named/character/character_buding_thirsty_empty_bottle.png",
    bubble: "小口补水，状态会更轻一点",
    label: "口渴",
  },
  sleepy: {
    action: "休息一下",
    asset: "/assets/derived/named/character/character_buding_sleeping_blue_cushion.png",
    bubble: "放松一下，我在这里陪你",
    label: "困了",
  },
};

const moodOrder: PetMood[] = ["cheer", "hungry", "thirsty", "sleepy"];

const sendDesktopCommand = (command: "close" | "minimize" | "toggleAlwaysOnTop") => {
  window.petfitDesktop?.[command]?.();
};

export function DesktopPetApp() {
  const [mood, setMood] = useState<PetMood>("cheer");
  const activeMood = moods[mood];
  const statusText = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 11) {
      return "早安，慢慢醒来";
    }

    if (hour < 18) {
      return "我在桌面陪你";
    }

    return "今晚也辛苦了";
  }, []);

  return (
    <main className={styles.petWindow} aria-label="PetFit desktop pet">
      <section className={styles.petCard}>
        <div className={styles.windowControls}>
          <button
            className={styles.controlButton}
            type="button"
            aria-label="窗口置顶"
            onClick={() => sendDesktopCommand("toggleAlwaysOnTop")}
          >
            ↑
          </button>
          <button
            className={styles.controlButton}
            type="button"
            aria-label="最小化"
            onClick={() => sendDesktopCommand("minimize")}
          >
            −
          </button>
          <button
            className={styles.controlButton}
            type="button"
            aria-label="关闭桌宠"
            onClick={() => sendDesktopCommand("close")}
          >
            ×
          </button>
        </div>

        <div className={styles.speechBubble}>
          <span>{activeMood.bubble}</span>
        </div>

        <button
          className={styles.petStage}
          type="button"
          aria-label={`切换小布丁状态，当前：${activeMood.label}`}
          onClick={() => {
            const nextIndex = (moodOrder.indexOf(mood) + 1) % moodOrder.length;
            setMood(moodOrder[nextIndex]);
          }}
        >
          <PrototypeAssetImage className={styles.petImage} path={activeMood.asset} alt="" />
          <PrototypeAssetImage className={styles.heart} path={demoAssets.effectHeart} alt="" />
        </button>

        <div className={styles.statusDock}>
          <div>
            <span className={styles.statusLabel}>{statusText}</span>
            <strong>{activeMood.action}</strong>
          </div>
          <div className={styles.moodButtons} aria-label="桌宠状态">
            {moodOrder.map((item) => (
              <button
                key={item}
                className={item === mood ? styles.moodButtonActive : styles.moodButton}
                type="button"
                onClick={() => setMood(item)}
              >
                {moods[item].label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
