import { useEffect, useMemo, useState } from "react";
import type { RestMode } from "../../entities";
import { usePetFitActions } from "../../app/store";
import { ActionPill, SheetShell } from "../../shared/ui/mobile-shell";
import { createRestRecord } from "../rest-sheet";
import styles from "./rest-timer.module.css";

export interface RestTimerProps {
  existingCount: number;
  onClose: () => void;
  open: boolean;
  selectedDate: string;
}

const durationOptions = [5, 10, 20, 30];
const modeOptions: Array<{ label: string; mode: RestMode }> = [
  { label: "Break", mode: "break" },
  { label: "Nap", mode: "nap" },
  { label: "Sleep", mode: "sleep" },
];

const formatClock = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainder
    .toString()
    .padStart(2, "0")}`;
};

export function RestTimer({
  existingCount,
  onClose,
  open,
  selectedDate,
}: RestTimerProps) {
  const { addRestRecord } = usePetFitActions();
  const [durationMinutes, setDurationMinutes] = useState(durationOptions[1]);
  const [restMode, setRestMode] = useState<RestMode>("break");
  const [secondsRemaining, setSecondsRemaining] = useState(durationOptions[1] * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!open) {
      setDurationMinutes(durationOptions[1]);
      setRestMode("break");
      setSecondsRemaining(durationOptions[1] * 60);
      setIsRunning(false);
    }
  }, [open]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timerId);
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning]);

  const progress = useMemo(() => {
    const totalSeconds = durationMinutes * 60;

    if (totalSeconds === 0) {
      return 0;
    }

    return ((totalSeconds - secondsRemaining) / totalSeconds) * 100;
  }, [durationMinutes, secondsRemaining]);

  const activeModeLabel =
    modeOptions.find((option) => option.mode === restMode)?.label ?? "Break";

  const syncDuration = (minutes: number) => {
    setDurationMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setIsRunning(false);
  };

  const dismiss = () => {
    setDurationMinutes(durationOptions[1]);
    setRestMode("break");
    setSecondsRemaining(durationOptions[1] * 60);
    setIsRunning(false);
    onClose();
  };

  const saveRecord = () => {
    addRestRecord(
      createRestRecord({
        durationMinutes,
        notes:
          secondsRemaining === 0
            ? "Mock timer finished"
            : `Mock timer saved with ${formatClock(secondsRemaining)} remaining`,
        restMode,
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
          Close
        </button>
      }
      footer={
        <div className={styles.footer}>
          <button className={styles.saveButton} onClick={saveRecord} type="button">
            Save timed rest
          </button>
          <p className={styles.supportingText}>
            The countdown is intentionally lightweight, but it already writes a valid
            rest record into the prototype store.
          </p>
        </div>
      }
      open={open}
      subtitle="Lightweight prototype countdown"
      title="Start a rest timer"
    >
      <div className={styles.stack}>
        <section className={styles.timerCard}>
          <p className={styles.timerLabel}>Timer</p>
          <p className={styles.timerValue}>{formatClock(secondsRemaining)}</p>
          <p className={styles.timerMeta}>
            {activeModeLabel} · {durationMinutes} minute session
          </p>
          <div className={styles.progressRail}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Session length</h3>
          <div className={styles.optionRow}>
            {durationOptions.map((option) => (
              <ActionPill
                className={styles.optionButton}
                key={option}
                onClick={() => syncDuration(option)}
                strong={durationMinutes === option}
                tone={durationMinutes === option ? "lavender" : "neutral"}
              >
                {option} min
              </ActionPill>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Rest mode</h3>
          <div className={styles.optionRow}>
            {modeOptions.map((option) => (
              <ActionPill
                className={styles.optionButton}
                key={option.mode}
                onClick={() => setRestMode(option.mode)}
                strong={restMode === option.mode}
                tone={restMode === option.mode ? "peach" : "neutral"}
              >
                {option.label}
              </ActionPill>
            ))}
          </div>
        </section>

        <div className={styles.controls}>
          <button
            className={styles.primaryButton}
            onClick={() => setIsRunning((current) => !current)}
            type="button"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => syncDuration(durationMinutes)}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </SheetShell>
  );
}
