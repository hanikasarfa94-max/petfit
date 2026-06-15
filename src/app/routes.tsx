import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AppShell } from "./App";
import { BottlePage } from "../pages/bottle";
import { BowlPage } from "../pages/bowl/bowl-page";
import { CaptureHubPage } from "../pages/capture/capture-page";
import { CaptureReviewFlowPage } from "../pages/capture/capture-review-page";
import { CushionPage } from "../pages/cushion";
import { PetFitHomePage } from "../pages/home/home-page";
import { SettingsPage } from "../pages/settings";
import { ObjectStatsRoutePage } from "../pages/stats";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <PetFitHomePage />,
      },
      {
        path: "capture",
        element: <CaptureHubPage />,
      },
      {
        path: "capture/review",
        element: <CaptureReviewFlowPage />,
      },
      {
        path: "capture/saved",
        element: <Navigate to="/capture/review" replace />,
      },
      {
        path: "bowl",
        element: <BowlPage />,
      },
      {
        path: "bottle",
        element: <BottlePage />,
      },
      {
        path: "cushion",
        element: <CushionPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: ":object/stats",
        element: <ObjectStatsRoutePage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
