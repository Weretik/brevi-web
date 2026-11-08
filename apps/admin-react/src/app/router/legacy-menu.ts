import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';

import type { SvgIconComponent } from '@mui/icons-material';

interface LegacyNavigationItem {
  id: string;
  label: string;
  path?: string;
  /** Shown only to a user with one of these server roles. */
  requiredRoles?: readonly string[];
}

interface LegacyNavigationGroup {
  id: string;
  label: string;
  icon: SvgIconComponent;
  section: 'Робота' | 'Дані';
  items: readonly LegacyNavigationItem[];
}

const admin = ['Admin'] as const;
/** «Ціна вишивки»: managers price it; Admin covers the director. */
const embroideryPrice = ['Admin', 'Manager'] as const;
/** «Швейний цех»: the head of the workshop; Admin covers the director. */
const workshop = ['Admin', 'WorkshopChief'] as const;
/** «Виробничі завдання»: managers too, since they pass КП to the workshop. */
const productionOrders = ['Admin', 'Manager', 'WorkshopChief'] as const;
/** «Бухгалтерія»: the director only (ACC-001); Admin and Accountant do not see it. */
const accounting = ['Director'] as const;

export const legacyGroups: readonly LegacyNavigationGroup[] = [
  {
    id: 'service-manager',
    icon: GroupsOutlinedIcon,
    section: 'Робота',
    label: 'Менеджер сервісу',
    items: [
      { id: 'leads', label: 'Ліди' },
      { id: 'quotes', label: 'Комерційні пропозиції', path: '/crm/quotes' },
      {
        id: 'quote-settings',
        label: 'Налаштування КП',
        path: '/crm/quote-settings',
        requiredRoles: admin,
      },
      {
        id: 'embroidery-price',
        label: 'Ціна вишивки',
        path: '/crm/embroidery',
        requiredRoles: embroideryPrice,
      },
      { id: 'price-list', label: 'Прайс' },
      { id: 'tasks', label: 'Мої завдання', path: '/crm/tasks' },
      { id: 'deals', label: 'Угоди' },
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
        requiredRoles: productionOrders,
      },
      {
        id: 'fabric-stock',
        label: 'Склад тканин',
        path: '/production/fabric-stock',
        requiredRoles: productionOrders,
      },
      {
        id: 'work-log',
        label: 'Журнал робіт',
        path: '/production/work',
        requiredRoles: workshop,
      },
      {
        id: 'sewing-forecast',
        label: 'Прогноз пошиття',
        path: '/production/forecast',
        requiredRoles: productionOrders,
      },
      {
        id: 'workshop-staff',
        label: 'Працівники цеху',
        path: '/production/staff',
        requiredRoles: workshop,
      },
      {
        id: 'fabric-norms',
        label: 'Норми витрати тканини',
        path: '/production/fabric-norms',
        requiredRoles: workshop,
      },
      {
        id: 'payroll-rules',
        label: 'Правила зарплати',
        path: '/production/payroll-rules',
        requiredRoles: workshop,
      },
      {
        id: 'workshop-settings',
        label: 'Налаштування цеху',
        path: '/production/settings',
        requiredRoles: workshop,
      },
      {
        id: 'workshop-archive',
        label: 'Архів цеху',
        path: '/production/archive',
        requiredRoles: productionOrders,
      },
      {
        id: 'salary',
        label: 'Зарплата',
        path: '/production/payroll',
        requiredRoles: workshop,
      },
      { id: 'furnitura-stock', label: 'Фурнітура в цеху' },
      {
        id: 'work-time',
        label: 'Робочий час',
        path: '/production/timesheet',
        requiredRoles: workshop,
      },
      {
        id: 'workshop-reports',
        label: 'Звіти цеху',
        path: '/production/reports',
        requiredRoles: admin,
      },
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
      {
        id: 'finance-overview',
        label: 'Огляд',
        path: '/accounting/overview',
        requiredRoles: accounting,
      },
      {
        id: 'finance-operations',
        label: 'Операції',
        path: '/accounting/transactions',
        requiredRoles: accounting,
      },
      {
        id: 'finance-transfers',
        label: 'Перекази',
        path: '/accounting/transfers',
        requiredRoles: accounting,
      },
      {
        id: 'finance-accounts',
        label: 'Рахунки і каси',
        path: '/accounting/accounts',
        requiredRoles: accounting,
      },
      {
        id: 'finance-categories',
        label: 'Категорії',
        path: '/accounting/categories',
        requiredRoles: accounting,
      },
      {
        id: 'finance-counterparties',
        label: 'Контрагенти',
        path: '/accounting/counterparties',
        requiredRoles: accounting,
      },
      {
        id: 'purchase-invoices',
        label: 'Рахунки на закупку',
        path: '/accounting/purchase-invoices',
        requiredRoles: accounting,
      },
      {
        id: 'finance-review',
        label: 'Потребують перевірки',
        path: '/accounting/review',
        requiredRoles: accounting,
      },
      {
        id: 'finance-import',
        label: 'Виписки банку',
        path: '/accounting/statements',
        requiredRoles: accounting,
      },
      {
        id: 'finance-legacy-import',
        label: 'Перенесення архіву',
        path: '/accounting/legacy-import',
        requiredRoles: accounting,
      },
      { id: 'finance-reports', label: 'Звіти', requiredRoles: accounting },
      { id: 'finance-audit', label: 'Журнал змін', requiredRoles: accounting },
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
      { id: 'product-sections', label: 'Типи і розділи', path: '/references/product-sections' },
      { id: 'materials', label: 'Тканини та фурнітура', path: '/references/materials' },
      {
        id: 'garment-part-operations',
        label: 'Операції',
        path: '/references/garment-part-operation',
      },
      { id: 'counterparties', label: 'Контрагенти', path: '/references/counterparties' },
      { id: 'calculations', label: 'Розрахунки' },
      {
        id: 'pricing-parameters',
        label: 'Параметри ціноутворення',
        path: '/references/pricing-parameters',
      },
      { id: 'price-import', label: 'Імпорт цін', path: '/references/price-import' },
    ],
  },
  {
    id: 'media',
    icon: PhotoLibraryOutlinedIcon,
    section: 'Дані',
    label: 'Фото',
    items: [{ id: 'media-library', label: 'Бібліотека фото', path: '/media' }],
  },
  {
    id: 'content',
    icon: ArticleOutlinedIcon,
    section: 'Дані',
    label: 'Контент',
    items: [
      { id: 'site-pages', label: 'Сторінки сайту' },
      { id: 'legal', label: 'Конфіденційність та умови', path: '/content/legal' },
    ],
  },
  {
    id: 'general-reports',
    icon: InsertChartOutlinedIcon,
    section: 'Дані',
    label: 'Загальні звіти',
    items: [{ id: 'reports-overview', label: 'Загальні звіти' }],
  },
  {
    id: 'administration',
    icon: ManageAccountsOutlinedIcon,
    section: 'Дані',
    label: 'Адміністрування',
    items: [
      { id: 'users', label: 'Користувачі', path: '/admin/users', requiredRoles: admin },
      {
        id: 'manager-tasks',
        label: 'Завдання менеджерам',
        path: '/admin/tasks',
        requiredRoles: admin,
      },
      { id: 'ai-settings', label: 'Налаштування ШІ', path: '/admin/ai', requiredRoles: admin },
    ],
  },
];
