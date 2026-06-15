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
    label: "Fresh water",
    note: "A clean refill for the day.",
    recognitionKey: "water",
  },
  {
    amountMl: 280,
    label: "Coffee break",
    note: "A gentle boost for the afternoon.",
    recognitionKey: "coffee",
  },
  {
    amountMl: 300,
    label: "Orange juice",
    note: "Bright and a little sweet.",
    recognitionKey: "orange_juice",
  },
  {
    amountMl: 480,
    label: "Milk tea treat",
    note: "Dessert drink energy.",
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
          Close
        </button>
      }
      footer={
        <div className={styles.footer}>
          <button className={styles.submitButton} onClick={saveRecord} type="button">
            Save drink record
          </button>
          <p className={styles.supportingText}>
            This stays mock-driven for now and writes directly into the local prototype
            store.
          </p>
        </div>
      }
      open={open}
      subtitle="Quick hydration entry"
      title="Add a drink"
    >
      <div className={styles.stack}>
        <section className={styles.previewCard}>
          <p className={styles.previewLabel}>Preview</p>
          <p className={styles.previewValue}>{previewText}</p>
          <p className={styles.previewMeta}>{notes.trim() || activePreset.note}</p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Pick a drink mood</h3>
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
          <h3 className={styles.sectionTitle}>Amount</h3>
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
          <h3 className={styles.sectionTitle}>Soft note</h3>
          <textarea
            className={styles.noteInput}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional: after workout, late meeting, afternoon pick-me-up..."
            value={notes}
          />
        </section>
      </div>
    </SheetShell>
  );
}
