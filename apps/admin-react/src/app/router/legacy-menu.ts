import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

import type { SvgIconComponent } from '@mui/icons-material';

interface LegacyNavigationItem {
  id: string;
  label: string;
  path?: string;
  requiredRole?: 'Admin';
}

interface LegacyNavigationGroup {
  id: string;
  label: string;
  icon: SvgIconComponent;
  section: 'Робота' | 'Дані';
  items: readonly LegacyNavigationItem[];
}

export const legacyGroups: readonly LegacyNavigationGroup[] = [
  {
    id: 'service-manager',
    icon: GroupsOutlinedIcon,
    section: 'Робота',
    label: 'Менеджер сервісу',
    items: [
      { id: 'clients', label: 'Клієнти', path: '/crm/clients' },
      { id: 'leads', label: 'Ліди' },
      { id: 'service-suppliers', label: 'Постачальники' },
      { id: 'quotes', label: 'Розрахунки та КП', path: '/crm/quotes' },
      {
        id: 'issuer-settings',
        label: 'Реквізити та шаблон КП',
        path: '/crm/issuer-settings',
        requiredRole: 'Admin',
      },
      { id: 'price-list', label: 'Прайс' },
      { id: 'quote-archive', label: 'Архів КП', path: '/crm/quotes/archive' },
      { id: 'tasks', label: 'Завдання в роботу' },
      { id: 'deals', label: 'Угоди' },
    ],
  },
  {
    id: 'sewing-shop',
    icon: ContentCutOutlinedIcon,
    section: 'Робота',
    label: 'Швейний цех',
    items: [
      { id: 'schedule', label: 'Графік роботи' },
      { id: 'salary', label: 'Зарплата' },
      { id: 'fabric-stock', label: 'Тканина в цеху' },
      { id: 'furnitura-stock', label: 'Фурнітура в цеху' },
      { id: 'work-time', label: 'Робочий час' },
      { id: 'embroidery', label: 'Вишивка' },
      { id: 'cashbox', label: 'Каса цеху' },
    ],
  },
  {
    id: 'accounting',
    icon: AccountBalanceWalletOutlinedIcon,
    section: 'Робота',
    label: 'Бухгалтерія',
    items: [
      { id: 'bills', label: 'Рахунки' },
      { id: 'receipts', label: 'Надходження' },
      { id: 'expenses', label: 'Витрати' },
      { id: 'reports', label: 'Звіти' },
      { id: 'accounting-references', label: 'Довідники' },
    ],
  },
  {
    id: 'reminders',
    icon: NotificationsActiveOutlinedIcon,
    section: 'Робота',
    label: 'Нагадування',
    items: [
      { id: 'reminder-tasks', label: 'Задачі', path: '/reminders/tasks' },
      { id: 'reminder-periods', label: 'Періоди', path: '/reminders/periods' },
      { id: 'reminder-chats', label: 'Чати Telegram', path: '/reminders/chats' },
      {
        id: 'reminder-non-working-days',
        label: 'Неробочі дні',
        path: '/reminders/non-working-days',
      },
    ],
  },
  {
    id: 'references',
    icon: MenuBookOutlinedIcon,
    section: 'Дані',
    label: 'Загальні довідники',
    items: [
      { id: 'products', label: 'Товари', path: '/references/products' },
      {
        id: 'fabric-accessories',
        label: 'Тканина та фурнітура',
        path: '/references/garment-accessory',
      },
      {
        id: 'garment-part-operations',
        label: 'Операції',
        path: '/references/garment-part-operation',
      },
      { id: 'reference-suppliers', label: 'Постачальники', path: '/references/supplier' },
      { id: 'calculations', label: 'Розрахунки' },
      {
        id: 'additional-references',
        label: 'Додаткові довідники',
        path: '/references/additional-reference',
      },
      { id: 'media', label: 'Медіа/Фото', path: '/references/media' },
    ],
  },
  {
    id: 'general-reports',
    icon: InsertChartOutlinedIcon,
    section: 'Дані',
    label: 'Загальні звіти',
    items: [{ id: 'reports-overview', label: 'Загальні звіти' }],
  },
];
