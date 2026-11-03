import { AdminLayout } from '@admin/core/shell';
import { usersPath } from '@admin/users/feature';

import { adminRouteDefinitions } from './admin-route-definitions';
import { createNavigation } from './navigation-config';
import { useAdminColorMode } from '../providers/color-mode-provider';

import type { SessionUser } from '@admin/core/auth';

const registeredPaths = new Set([...adminRouteDefinitions.map((route) => route.path), usersPath]);

const profileLinks = [
  { label: 'Про BreviERP, конфіденційність та умови', href: '/brevi-erp/index.html' },
] as const;

export function AdminRouteLayout({ user }: { user: SessionUser }) {
  const { colorMode, changeColorMode } = useAdminColorMode();
  const navigation = createNavigation(registeredPaths, user.roles);

  return (
    <AdminLayout
      colorMode={colorMode}
      navigation={navigation}
      onColorModeChange={changeColorMode}
      profileLinks={profileLinks}
    />
  );
}
