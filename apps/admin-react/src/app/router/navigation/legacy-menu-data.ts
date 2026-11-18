import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';

import type { LegacyNavigationGroup } from './legacy-menu';

/** «Дані»: references, media and the site content. */
export const dataGroups: readonly LegacyNavigationGroup[] = [
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
      {
        id: 'site-company',
        label: 'Контакти та компанія',
        path: '/content/company',
        access: 'content-company',
      },
      {
        id: 'site-works',
        label: 'Наші роботи',
        path: '/content/works',
        access: 'content-works',
      },
      {
        id: 'site-certificates',
        label: 'Сертифікати',
        path: '/content/certificates',
        access: 'content-certificates',
      },
      { id: 'legal', label: 'Конфіденційність та умови', path: '/content/legal' },
    ],
  },
];
