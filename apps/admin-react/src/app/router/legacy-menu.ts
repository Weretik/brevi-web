import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
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
  /** Page of «Права доступу» (or any of several): shown only when the user's rights let them see it. */
  access?: string | readonly string[];
}

interface LegacyNavigationGroup {
  id: string;
  label: string;
  icon: SvgIconComponent;
  section: 'Робота' | 'Дані';
  items: readonly LegacyNavigationItem[];
}

const admin = ['Admin'] as const;

export const legacyGroups: readonly LegacyNavigationGroup[] = [
  {
    id: 'service-manager',
    icon: GroupsOutlinedIcon,
    section: 'Робота',
    label: 'Менеджер сервісу',
    items: [
      { id: 'leads', label: 'Ліди', path: '/crm/leads', access: 'leads' },
      { id: 'quotes', label: 'Комерційні пропозиції', path: '/crm/quotes', access: 'quotes' },
      {
        id: 'quote-settings',
        label: 'Налаштування КП',
        path: '/crm/quote-settings',
        access: 'quote-settings',
      },
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
        id: 'workshop-settings',
        label: 'Налаштування цеху',
        path: '/production/settings',
        access: 'workshop-settings',
      },
      {
        id: 'workshop-archive',
        label: 'Архів цеху',
        path: '/production/archive',
        access: 'workshop-archive',
      },
      {
        id: 'workshop-reports',
        label: 'Звіти цеху',
        path: '/production/reports',
        access: 'workshop-reports',
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
        id: 'fabric-movements',
        label: 'Рух тканини',
        path: '/warehouse/movements',
        access: 'fabric-stock',
      },
      {
        id: 'fabric-stock',
        label: 'Залишки',
        path: '/warehouse/stock',
        access: 'fabric-stock',
      },
      {
        id: 'fabric-opening',
        label: 'Початкові залишки',
        path: '/warehouse/opening',
        access: 'fabric-stock',
      },
      // The reports (WH-005): each is its own page of «Права доступу»; «Вартість складу» is the owner's.
      {
        id: 'fabric-plan-fact',
        label: 'План і факт',
        path: '/warehouse/plan-fact',
        access: 'fabric-plan-fact',
      },
      {
        id: 'fabric-booking',
        label: 'Бронь і що замовити',
        path: '/warehouse/booking',
        access: 'fabric-booking',
      },
      {
        id: 'fabric-valuation',
        label: 'Вартість складу',
        path: '/warehouse/valuation',
        access: 'fabric-valuation',
      },
      {
        id: 'hardware-to-order',
        label: 'Фурнітура до замовлення',
        path: '/warehouse/hardware',
        access: 'hardware-order',
      },
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
        id: 'finance-reports',
        label: 'Звіти',
        path: '/accounting/reports',
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
  {
    id: 'references',
    icon: MenuBookOutlinedIcon,
    section: 'Дані',
    label: 'Загальні довідники',
    items: [
      { id: 'products', label: 'Товари', path: '/references/products', access: 'products' },
      {
        id: 'product-sections',
        label: 'Типи і розділи',
        path: '/references/product-sections',
        access: 'product-sections',
      },
      {
        id: 'materials',
        label: 'Тканини та фурнітура',
        path: '/references/materials',
        access: 'materials',
      },
      {
        id: 'garment-part-operations',
        label: 'Операції',
        path: '/references/garment-part-operation',
        access: 'operations',
      },
      {
        id: 'counterparties',
        label: 'Контрагенти',
        path: '/references/counterparties',
        access: 'counterparties',
      },
      { id: 'calculations', label: 'Розрахунки' },
      {
        id: 'pricing-parameters',
        label: 'Параметри ціноутворення',
        path: '/references/pricing-parameters',
        access: 'pricing-parameters',
      },
      {
        id: 'price-import',
        label: 'Імпорт цін',
        path: '/references/price-import',
        access: 'price-import',
      },
    ],
  },
  {
    id: 'media',
    icon: PhotoLibraryOutlinedIcon,
    section: 'Дані',
    label: 'Фото',
    items: [{ id: 'media-library', label: 'Бібліотека фото', path: '/media', access: 'media' }],
  },
  {
    id: 'content',
    icon: ArticleOutlinedIcon,
    section: 'Дані',
    label: 'Контент',
    items: [
      {
        id: 'site-products',
        label: 'Товари сайту',
        path: '/content/products',
        access: 'content-products',
      },
      {
        id: 'site-categories',
        label: 'Розділи сайту',
        path: '/content/categories',
        access: 'content-categories',
      },
      {
        id: 'site-articles',
        label: 'Статті',
        path: '/content/articles',
        access: 'content-articles',
      },
      {
        id: 'site-redirects',
        label: 'Переадресації',
        path: '/content/redirects',
        access: 'content-redirects',
      },
      {
        id: 'site-seo-settings',
        label: 'Налаштування SEO сайту',
        path: '/content/seo-settings',
        access: 'content-seo-settings',
      },
      {
        id: 'site-pages',
        label: 'Сторінки сайту',
        path: '/content/site-pages',
        access: 'content-site-pages',
      },
      {
        id: 'site-seo-overview',
        label: 'SEO-огляд',
        path: '/content/seo-overview',
        access: 'content-seo-overview',
      },
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
      { id: 'lead-stats', label: 'Статистика лідів', path: '/admin/leads', access: 'lead-stats' },
      { id: 'ai-settings', label: 'Налаштування ШІ', path: '/admin/ai', requiredRoles: admin },
      { id: 'access-rights', label: 'Права доступу', path: '/admin/access', requiredRoles: admin },
    ],
  },
];
