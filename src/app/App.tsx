import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { DemoShell } from "../demo/demo-shell";
import { DesktopPetApp } from "../desktop-pet/desktop-pet-app";
import { AppProviders } from "./providers";
import { router } from "./router";

export function AppShell() {
  return <DemoShell />;
}

export default function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const isDesktopPetMode = searchParams.get("mode") === "pet";

  useEffect(() => {
    document.documentElement.classList.toggle("petfit-desktop-pet", isDesktopPetMode);

    return () => {
      document.documentElement.classList.remove("petfit-desktop-pet");
    };
  }, [isDesktopPetMode]);

  if (isDesktopPetMode) {
    return (
      <AppProviders>
        <DesktopPetApp />
      </AppProviders>
    );
  }

  return (
    <AppProviders>
      <RouterProvider
        router={router}
        fallbackElement={<div className="loading-state">PetFit UI loading...</div>}
      />
    </AppProviders>
  );
}
