import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

import type { LegacyNavigationGroup } from './legacy-menu';

/** «Робота»: accounting and reminders. */
export const officeGroups: readonly LegacyNavigationGroup[] = [
  {
    id: 'accounting',
    icon: AccountBalanceWalletOutlinedIcon,
    section: 'Робота',
    label: 'Бухгалтерія',
    items: [
      {
        id: 'finance-overview',
        label: 'Огляд',
        path: '/accounting/overview',
        access: 'accounting',
      },
      {
        id: 'finance-operations',
        label: 'Операції',
        path: '/accounting/transactions',
        access: 'accounting',
      },
      {
        id: 'finance-transfers',
        label: 'Перекази',
        path: '/accounting/transfers',
        access: 'accounting',
      },
      {
        id: 'finance-accounts',
        label: 'Рахунки і каси',
        path: '/accounting/accounts',
        access: 'accounting',
      },
      {
        id: 'finance-categories',
        label: 'Категорії',
        path: '/accounting/categories',
        access: 'accounting',
      },
      {
        id: 'finance-counterparties',
        label: 'Контрагенти',
        path: '/accounting/counterparties',
        access: 'accounting',
      },
      {
        id: 'purchase-invoices',
        label: 'Рахунки на закупку',
        path: '/accounting/purchase-invoices',
        access: 'purchase-invoices',
      },
      {
        id: 'finance-review',
        label: 'Потребують перевірки',
        path: '/accounting/review',
        access: 'accounting',
      },
      {
        id: 'finance-import',
        label: 'Виписки банку',
        path: '/accounting/statements',
        access: 'accounting',
      },
      {
        id: 'finance-legacy-import',
        label: 'Перенесення архіву',
        path: '/accounting/legacy-import',
        access: 'accounting',
      },
      {
        id: 'finance-audit',
        label: 'Журнал змін',
        path: '/accounting/audit',
        access: 'accounting',
      },
    ],
  },
  {
    id: 'reminders',
    icon: NotificationsActiveOutlinedIcon,
    section: 'Робота',
    label: 'Нагадування',
    items: [
      { id: 'reminder-tasks', label: 'Задачі', path: '/reminders/tasks', access: 'reminders' },
      { id: 'reminder-periods', label: 'Періоди', path: '/reminders/periods', access: 'reminders' },
      {
        id: 'reminder-chats',
        label: 'Чати Telegram',
        path: '/reminders/chats',
        access: 'reminders',
      },
      {
        id: 'reminder-non-working-days',
        label: 'Неробочі дні',
        path: '/reminders/non-working-days',
        access: 'reminders',
      },
    ],
  },
];
