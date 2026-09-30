interface LegacyNavigationItem {
  id: string;
  label: string;
  path?: string;
}

interface LegacyNavigationGroup {
  id: string;
  label: string;
  items: readonly LegacyNavigationItem[];
}

export const legacyGroups: readonly LegacyNavigationGroup[] = [
  {
    id: 'service-manager',
    label: 'Менеджер сервісу',
    items: [
      { id: 'clients', label: 'Клієнти' },
      { id: 'leads', label: 'Ліди' },
      { id: 'service-suppliers', label: 'Постачальники' },
      { id: 'quotes', label: 'Розрахунки та КП' },
      { id: 'price-list', label: 'Прайс' },
      { id: 'quote-archive', label: 'Архів КП' },
      { id: 'tasks', label: 'Завдання в роботу' },
      { id: 'deals', label: 'Угоди' },
    ],
  },
  {
    id: 'sewing-shop',
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
    id: 'references',
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
    label: 'Загальні звіти',
    items: [{ id: 'reports-overview', label: 'Загальні звіти' }],
  },
];
