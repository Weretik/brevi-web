import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

import type { LegacyNavigationGroup } from './legacy-menu';

/** «Робота»: managers, the sewing shop and the fabric warehouse. */
export const workGroups: readonly LegacyNavigationGroup[] = [
  {
    id: 'service-manager',
    icon: GroupsOutlinedIcon,
    section: 'Робота',
    label: 'Менеджер сервісу',
    items: [
      { id: 'leads', label: 'Ліди', path: '/crm/leads', access: 'leads' },
      {
        id: 'site-requests',
        label: 'Заявки з сайту',
        path: '/crm/site-requests',
        access: 'site-requests',
      },
      { id: 'quotes', label: 'Комерційні пропозиції', path: '/crm/quotes', access: 'quotes' },
      {
        id: 'embroidery-price',
        label: 'Ціна вишивки',
        path: '/crm/embroidery',
        access: 'embroidery',
      },
      { id: 'tasks', label: 'Мої завдання', path: '/crm/tasks', access: 'tasks' },
    ],
  },
  {
    id: 'sewing-shop',
    icon: ContentCutOutlinedIcon,
    section: 'Робота',
    label: 'Швейний цех',
    items: [
      {
        id: 'production-orders',
        label: 'Виробничі завдання',
        path: '/production/orders',
        access: 'production-orders',
      },
      {
        id: 'work-log',
        label: 'Журнал робіт',
        path: '/production/work',
        access: 'work-log',
      },
      {
        id: 'sewing-forecast',
        label: 'Прогноз пошиття',
        path: '/production/forecast',
        access: 'forecast',
      },
      {
        id: 'workshop-people',
        label: 'Персонал цеху',
        path: '/production/people',
        access: ['workshop-staff', 'timesheet', 'payroll'],
      },
      {
        id: 'fabric-norms',
        label: 'Норми витрати тканини',
        path: '/production/fabric-norms',
        access: 'fabric-norms',
      },
      {
        id: 'workshop-archive',
        label: 'Архів цеху',
        path: '/production/archive',
        access: 'workshop-archive',
      },
    ],
  },
  {
    // Own module Warehouse (WH-001…WH-005).
    id: 'fabric-warehouse',
    icon: Inventory2OutlinedIcon,
    section: 'Робота',
    label: 'Склад тканин',
    items: [
      {
        id: 'fabric-stock',
        label: 'Залишки',
        path: '/warehouse/stock',
        access: 'fabric-stock',
      },
      {
        id: 'fabric-movements',
        label: 'Рух тканини',
        path: '/warehouse/movements',
        access: 'fabric-stock',
      },
      // Tabs «Тканина» (бронь) and «Фурнітура»: each its own page of «Права доступу».
      {
        id: 'warehouse-to-order',
        label: 'Що замовити',
        path: '/warehouse/to-order',
        access: ['fabric-booking', 'hardware-order'],
      },
    ],
  },
];
