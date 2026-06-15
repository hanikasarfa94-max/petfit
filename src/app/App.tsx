import { RouterProvider } from "react-router-dom";
import { DemoShell } from "../demo/demo-shell";
import { AppProviders } from "./providers";
import { router } from "./router";

export function AppShell() {
  return <DemoShell />;
}

export default function App() {
  return (
    <AppProviders>
      <RouterProvider
        router={router}
        fallbackElement={<div className="loading-state">PetFit UI loading...</div>}
      />
    </AppProviders>
  );
}
