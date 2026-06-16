import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.petfit.buding",
  appName: "PetFit",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
};

export default config;
