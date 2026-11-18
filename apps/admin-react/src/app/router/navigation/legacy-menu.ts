import { adminGroups } from './legacy-menu-admin';
import { dataGroups } from './legacy-menu-data';
import { officeGroups } from './legacy-menu-office';
import { workGroups } from './legacy-menu-work';

import type { SvgIconComponent } from '@mui/icons-material';

interface LegacyNavigationItem {
  id: string;
  label: string;
  path?: string;
  /** Shown only to a user with one of these server roles. */
  requiredRoles?: readonly string[];
  /** Page of «Права доступу» (or any of several): shown only when the user's rights let them see it. */
  access?: string | readonly string[];
}

export interface LegacyNavigationGroup {
  id: string;
  label: string;
  icon: SvgIconComponent;
  section: 'Робота' | 'Дані';
  items: readonly LegacyNavigationItem[];
}

/** The Admin menu, «Робота» first, then «Дані». */
export const legacyGroups: readonly LegacyNavigationGroup[] = [
  ...workGroups,
  ...officeGroups,
  ...dataGroups,
  ...adminGroups,
];
