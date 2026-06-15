import type { PetProfile } from "./pet";
import type { FoodRecord, DrinkRecord, RestRecord } from "./records";
import type { CaptureSession } from "./session";

export interface PetFitDomainState {
  petProfile: PetProfile;
  foodRecords: FoodRecord[];
  drinkRecords: DrinkRecord[];
  restRecords: RestRecord[];
  captureSessions: CaptureSession[];
  selectedDate: string;
  activeCaptureSessionId?: string;
  seedVersion: string;
}
