export interface WellnessGoals {
  hydrationMl: number;
  mealEntries: number;
  restMinutes: number;
}

export interface PetProfile {
  id: string;
  name: string;
  species: "hamster" | "dog" | "cat" | "other";
  mascotName: string;
  companionAssetName: string;
  adoptedAt: string;
  wellnessGoals: WellnessGoals;
  notes?: string;
}
