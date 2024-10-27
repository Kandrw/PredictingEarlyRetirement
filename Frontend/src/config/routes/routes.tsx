import { RouteProps } from "react-router-dom";

import { MainPage } from "../../pages/main-page";
import { UploadPage } from "../../pages/upload-page";
import { ResultPage } from "../../pages/result-page";

export const AppRoutes = {
  MAIN: "main",
  UPLOAD: "upload",
  RESULT: "result",
} as const;

export type AppRoutesT = (typeof AppRoutes)[keyof typeof AppRoutes];

export const RoutePath: Record<AppRoutesT, string> = {
  [AppRoutes.MAIN]: "/",
  [AppRoutes.UPLOAD]: "/upload",
  [AppRoutes.RESULT]: "/result",
};

export const routeConfig: Record<AppRoutesT, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />,
  },
  [AppRoutes.UPLOAD]: {
    path: RoutePath.upload,
    element: <UploadPage />,
  },
  [AppRoutes.RESULT]: {
    path: RoutePath.result,
    element: <ResultPage />,
  },
};
