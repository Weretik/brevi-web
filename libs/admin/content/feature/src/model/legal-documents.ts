/** Public BreviERP documents served without sign-in from `apps/admin-react/public/brevi-erp/`. */
export interface LegalDocument {
  id: 'about' | 'privacy' | 'terms';
  title: string;
  description: string;
  /** Path on the Admin host; Google OAuth links to these pages. */
  path: string;
}

export const legalDocumentsEdition = '30 жовтня 2026';

export const legalDocuments: readonly LegalDocument[] = [
  {
    id: 'about',
    title: 'Про BreviERP',
    description: 'Для чого сервіс і навіщо підключення Google (Gmail для надсилання КП).',
    path: '/brevi-erp/index.html',
  },
  {
    id: 'privacy',
    title: 'Політика конфіденційності',
    description: 'Які дані обробляються, дозволи Google, зберігання і видалення даних.',
    path: '/brevi-erp/privacy.html',
  },
  {
    id: 'terms',
    title: 'Умови використання',
    description: 'Хто може користуватися сервісом, обовʼязки працівників і обмеження.',
    path: '/brevi-erp/terms.html',
  },
];
