export {};

declare global {
  interface Window {
    petfitDesktop?: {
      close: () => Promise<void>;
      minimize: () => Promise<void>;
      toggleAlwaysOnTop: () => Promise<boolean>;
    };
  }
}
