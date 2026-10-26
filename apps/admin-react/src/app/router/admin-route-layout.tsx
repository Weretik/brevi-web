import { AdminLayout } from '@admin/core/shell';

import { adminRouteDefinitions } from './admin-route-definitions';
import { createNavigation } from './navigation-config';
import { useAdminColorMode } from '../providers/color-mode-provider';

const navigation = createNavigation(new Set(adminRouteDefinitions.map((route) => route.path)));

export function AdminRouteLayout() {
  const { colorMode, changeColorMode } = useAdminColorMode();

  return (
    <AdminLayout
      colorMode={colorMode}
      navigation={navigation}
      onColorModeChange={changeColorMode}
    />
  );
}
