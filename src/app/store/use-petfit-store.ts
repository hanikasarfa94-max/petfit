import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { petFitStore, type PetFitStoreState } from "./petfit-store";

const identity = (state: PetFitStoreState) => state;

export const usePetFitStore = <T = PetFitStoreState>(
  selector: (state: PetFitStoreState) => T = identity as (state: PetFitStoreState) => T,
) =>
  useStore(petFitStore, selector);

export const usePetFitActions = () =>
  usePetFitStore(
    useShallow((state) => ({
      reset: state.reset,
      setSelectedDate: state.setSelectedDate,
      setActiveCaptureSession: state.setActiveCaptureSession,
      addFoodRecord: state.addFoodRecord,
      addDrinkRecord: state.addDrinkRecord,
      addRestRecord: state.addRestRecord,
      upsertCaptureSession: state.upsertCaptureSession,
      toggleCaptureCandidate: state.toggleCaptureCandidate,
      confirmCaptureSession: state.confirmCaptureSession,
      saveCaptureSession: state.saveCaptureSession,
    })),
  );
