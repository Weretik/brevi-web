import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

import type { LegacyNavigationGroup } from './legacy-menu';

/** Roles of the pages only an administrator sees. */
const adminOnly = ['Admin'] as const;

/** «Дані»: reports and administration. */
export const adminGroups: readonly LegacyNavigationGroup[] = [
  {
    id: 'general-reports',
    icon: InsertChartOutlinedIcon,
    section: 'Дані',
    label: 'Загальні звіти',
    items: [
      {
        id: 'workshop-reports',
        label: 'Звіти цеху',
        path: '/production/reports',
        access: 'workshop-reports',
      },
      // Tabs «План і факт», «Витрата за період» (fabric-stock) and «Вартість» (the owner's).
      {
        id: 'warehouse-reports',
        label: 'Звіти складу',
        path: '/warehouse/reports',
        access: ['fabric-plan-fact', 'fabric-stock', 'fabric-valuation'],
      },
      {
        id: 'finance-reports',
        label: 'Звіти бухгалтерії',
        path: '/accounting/reports',
        access: 'accounting',
      },
    ],
  },
  {
    id: 'administration',
    icon: ManageAccountsOutlinedIcon,
    section: 'Дані',
    label: 'Адміністрування',
    items: [
      { id: 'users', label: 'Користувачі', path: '/admin/users', requiredRoles: adminOnly },
      {
        id: 'manager-tasks',
        label: 'Завдання менеджерам',
        path: '/admin/tasks',
        access: 'manager-tasks',
      },
      { id: 'lead-stats', label: 'Статистика лідів', path: '/admin/leads', access: 'lead-stats' },
      { id: 'ai-settings', label: 'Налаштування ШІ', path: '/admin/ai', requiredRoles: adminOnly },
      {
        id: 'background-tasks',
        label: 'Фонові задачі',
        path: '/admin/background-tasks',
        access: 'background-tasks',
      },
      {
        id: 'activity-log',
        label: 'Журнал дій',
        path: '/admin/activity-log',
        access: 'activity-log',
      },
      {
        id: 'access-rights',
        label: 'Права доступу',
        path: '/admin/access',
        requiredRoles: adminOnly,
      },
      {
        id: 'quote-settings',
        label: 'Налаштування КП',
        path: '/admin/quote-settings',
        access: 'quote-settings',
      },
      {
        id: 'workshop-settings',
        label: 'Налаштування цеху',
        path: '/production/settings',
        access: 'workshop-settings',
      },
    ],
  },
];
