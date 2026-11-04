import { sessionRoleLabel } from '@admin/core/auth';
import { AdminLayout } from '@admin/core/shell';
import { profilePath, usersPath } from '@admin/users/feature';

import { adminRouteDefinitions } from './admin-route-definitions';
import { createNavigation } from './navigation-config';
import { useAdminColorMode } from '../providers/color-mode-provider';

import type { SessionUser } from '@admin/core/auth';

const registeredPaths = new Set([...adminRouteDefinitions.map((route) => route.path), usersPath]);

export function AdminRouteLayout({ user }: { user: SessionUser }) {
  const { colorMode, changeColorMode } = useAdminColorMode();
  const navigation = createNavigation(registeredPaths, user.roles);

  return (
    <AdminLayout
      colorMode={colorMode}
      navigation={navigation}
      onColorModeChange={changeColorMode}
      profileHref={profilePath}
      user={{
        avatarUrl: user.avatarUrl,
        email: user.email,
        fullName: user.fullName,
        roleLabel: sessionRoleLabel(user),
      }}
    />
  );
}
