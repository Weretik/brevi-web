import { useGetAdminSessionRolesQuery } from '@admin/core/auth';
import { AdminLayout } from '@admin/core/shell';

import { adminRouteDefinitions } from './admin-route-definitions';
import { createNavigation } from './navigation-config';
import { useAdminColorMode } from '../providers/color-mode-provider';

const registeredPaths = new Set(adminRouteDefinitions.map((route) => route.path));

export function AdminRouteLayout() {
  const { colorMode, changeColorMode } = useAdminColorMode();
  const session = useGetAdminSessionRolesQuery(undefined, { refetchOnMountOrArgChange: true });
  const navigation = createNavigation(
    registeredPaths,
    session.isSuccess && !session.isFetching ? (session.currentData ?? []) : [],
  );

  return (
    <AdminLayout
      colorMode={colorMode}
      navigation={navigation}
      onColorModeChange={changeColorMode}
    />
  );
}
