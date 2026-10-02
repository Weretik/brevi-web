import { AdminLayout } from '@admin/core/shell';
import { productsRoutes } from '@admin/products/feature';
import { referencesRoutes } from '@admin/references/feature';
import { Route, Routes } from 'react-router-dom';

import { createNavigation } from './navigation-config';
import { NotFoundPage } from '../pages/not-found-page';
import { StartPage } from '../pages/start-page';
import { useAdminColorMode } from '../providers/color-mode-provider';

const availableRoutes = [
  { path: '/', element: <StartPage /> },
  ...referencesRoutes,
  ...productsRoutes,
];
const navigation = createNavigation(new Set(availableRoutes.map((route) => route.path)));

export function AppRouter() {
  const { colorMode, changeColorMode } = useAdminColorMode();

  return (
    <Routes>
      <Route
        element={
          <AdminLayout
            colorMode={colorMode}
            navigation={navigation}
            onColorModeChange={changeColorMode}
          />
        }
      >
        {availableRoutes.map((route) => (
          <Route element={route.element} key={route.path} path={route.path} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
