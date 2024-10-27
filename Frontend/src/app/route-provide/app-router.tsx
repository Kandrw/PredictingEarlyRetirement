import { memo, useCallback } from "react";
import { Route, RouteProps, Routes } from "react-router-dom";

import { routeConfig } from "../../config";

export const AppRouter = memo(() => {
  const renderWithWrapper = useCallback(
    ({ path, element }: RouteProps) => (
      <Route key={path} path={path} element={element} />
    ),
    []
  );

  return <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>;
});
