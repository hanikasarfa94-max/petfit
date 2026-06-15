import { useMemo, useState } from "react";
import { usePetFitActions } from "../../app/store";
import type { RestMode } from "../../entities";
import { ActionPill, SheetShell } from "../../shared/ui/mobile-shell";
import { createRestRecord } from "./rest-record";
import styles from "./rest-sheet.module.css";

export interface RestSheetProps {
  existingCount: number;
  onClose: () => void;
  open: boolean;
  selectedDate: string;
}

const durationOptions = [10, 20, 30, 45];

const modeOptions: Array<{ label: string; mode: RestMode; note: string }> = [
  {
    label: "放松",
    mode: "break",
    note: "给自己一个轻一点的小停顿。",
  },
  {
    label: "小憩",
    mode: "nap",
    note: "午后补一会儿，状态会更轻松。",
  },
  {
    label: "睡眠",
    mode: "sleep",
    note: "留给夜晚或更完整的安静恢复。",
  },
];

export function RestSheet({
  existingCount,
  onClose,
  open,
  selectedDate,
}: RestSheetProps) {
  const { addRestRecord } = usePetFitActions();
  const [durationMinutes, setDurationMinutes] = useState(durationOptions[1]);
  const [restMode, setRestMode] = useState<RestMode>("break");
  const [notes, setNotes] = useState("");

  const activeMode = modeOptions.find((option) => option.mode === restMode) ?? modeOptions[0];

  const previewText = useMemo(
    () => `${durationMinutes} 分钟 · ${activeMode.label}`,
    [activeMode.label, durationMinutes],
  );

  const dismiss = () => {
    setDurationMinutes(durationOptions[1]);
    setRestMode("break");
    setNotes("");
    onClose();
  };

  const saveRecord = () => {
    addRestRecord(
      createRestRecord({
        durationMinutes,
        notes: notes.trim() || activeMode.note,
        restMode,
        selectedDate,
        sequence: existingCount + 1,
      }),
    );
    dismiss();
  };

  return (
    <SheetShell
      className={styles.sheetCompact}
      dismissAction={
        <button className={styles.closeButton} onClick={dismiss} type="button">
          关闭
        </button>
      }
      footer={
        <div className={styles.footer}>
          <button className={styles.submitButton} onClick={saveRecord} type="button">
            保存休息记录
          </button>
        </div>
      }
      open={open}
      subtitle="快速补一条休息记录"
      title="记录这次休息"
    >
      <div className={styles.stack}>
        <section className={styles.previewCard}>
          <p className={styles.previewLabel}>预览</p>
          <p className={styles.previewValue}>{previewText}</p>
          <p className={styles.previewMeta}>{notes.trim() || activeMode.note}</p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h3 className={styles.sectionTitle}>时长</h3>
            <span className={styles.sectionValue}>{durationMinutes} 分钟</span>
          </div>
          <div className={styles.durationRow}>
            {durationOptions.map((option) => (
              <ActionPill
                className={styles.durationButton}
                key={option}
                onClick={() => setDurationMinutes(option)}
                strong={durationMinutes === option}
                tone={durationMinutes === option ? "peach" : "neutral"}
              >
                {option} 分钟
              </ActionPill>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h3 className={styles.sectionTitle}>休息方式</h3>
            <span className={styles.sectionValue}>{activeMode.label}</span>
          </div>
          <div className={styles.modeRow}>
            {modeOptions.map((option) => (
              <ActionPill
                className={styles.modeButton}
                key={option.mode}
                onClick={() => setRestMode(option.mode)}
                strong={restMode === option.mode}
                tone={restMode === option.mode ? "lavender" : "neutral"}
              >
                {option.label}
              </ActionPill>
            ))}
          </div>
          <p className={styles.modeHint}>{activeMode.note}</p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>补充备注</h3>
          <textarea
            className={styles.noteInput}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="例如：午饭后眯一会儿，或忙完先放松十分钟"
            value={notes}
          />
        </section>
      </div>
    </SheetShell>
  );
}
