import { useMemo, useState } from "react";
import { usePetFitActions } from "../../app/store";
import { ActionPill, SheetShell } from "../../shared/ui/mobile-shell";
import { createHydrationDrinkRecord } from "./hydration-record";
import styles from "./hydration-sheet.module.css";

interface HydrationPreset {
  amountMl: number;
  label: string;
  note: string;
  recognitionKey: string;
}

export interface HydrationSheetProps {
  existingCount: number;
  onClose: () => void;
  open: boolean;
  selectedDate: string;
}

const hydrationPresets: HydrationPreset[] = [
  {
    amountMl: 350,
    label: "白水",
    note: "清爽补水，适合日常记录。",
    recognitionKey: "water",
  },
  {
    amountMl: 280,
    label: "咖啡",
    note: "下午提神，记得别太晚喝。",
    recognitionKey: "coffee",
  },
  {
    amountMl: 300,
    label: "橙汁",
    note: "有点甜，也算今天的一杯。",
    recognitionKey: "orange_juice",
  },
  {
    amountMl: 480,
    label: "奶茶",
    note: "甜饮也会同步到水瓶记录。",
    recognitionKey: "milk_tea",
  },
];

const amountOptions = [200, 280, 350, 500, 650];

export function HydrationSheet({
  existingCount,
  onClose,
  open,
  selectedDate,
}: HydrationSheetProps) {
  const { addDrinkRecord } = usePetFitActions();
  const [activePreset, setActivePreset] = useState<HydrationPreset>(hydrationPresets[0]);
  const [amountMl, setAmountMl] = useState(hydrationPresets[0].amountMl);
  const [notes, setNotes] = useState("");

  const previewText = useMemo(
    () => `${amountMl} ml · ${activePreset.label}`,
    [activePreset.label, amountMl],
  );

  const dismiss = () => {
    setActivePreset(hydrationPresets[0]);
    setAmountMl(hydrationPresets[0].amountMl);
    setNotes("");
    onClose();
  };

  const saveRecord = () => {
    addDrinkRecord(
      createHydrationDrinkRecord({
        amountMl,
        notes: notes.trim() || activePreset.note,
        recognitionKey: activePreset.recognitionKey,
        selectedDate,
        sequence: existingCount + 1,
      }),
    );
    dismiss();
  };

  return (
    <SheetShell
      dismissAction={
        <button className={styles.closeButton} onClick={dismiss} type="button">
          关闭
        </button>
      }
      footer={
        <div className={styles.footer}>
          <button className={styles.submitButton} onClick={saveRecord} type="button">
            保存饮水记录
          </button>
          <p className={styles.supportingText}>保存后会更新今天的水瓶进度。</p>
        </div>
      }
      open={open}
      subtitle="快速补一条饮水记录"
      title="记录这杯饮品"
    >
      <div className={styles.stack}>
        <section className={styles.previewCard}>
          <p className={styles.previewLabel}>预览</p>
          <p className={styles.previewValue}>{previewText}</p>
          <p className={styles.previewMeta}>{notes.trim() || activePreset.note}</p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>饮品类型</h3>
          <div className={styles.presetGrid}>
            {hydrationPresets.map((preset) => {
              const isActive = preset.recognitionKey === activePreset.recognitionKey;

              return (
                <ActionPill
                  className={styles.presetButton}
                  key={preset.recognitionKey}
                  onClick={() => {
                    setActivePreset(preset);
                    setAmountMl(preset.amountMl);
                  }}
                  strong={isActive}
                  tone={isActive ? "sky" : "neutral"}
                  vertical
                >
                  <span className={styles.presetContent}>
                    <span className={styles.presetTitle}>{preset.label}</span>
                    <span className={styles.presetMeta}>{preset.note}</span>
                  </span>
                </ActionPill>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>容量</h3>
          <div className={styles.amountRow}>
            {amountOptions.map((option) => (
              <ActionPill
                className={styles.amountButton}
                key={option}
                onClick={() => setAmountMl(option)}
                strong={amountMl === option}
                tone={amountMl === option ? "mint" : "neutral"}
              >
                {option} ml
              </ActionPill>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>备注</h3>
          <textarea
            className={styles.noteInput}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="例如：运动后、午饭后、开会间隙..."
            value={notes}
          />
        </section>
      </div>
    </SheetShell>
  );
}
