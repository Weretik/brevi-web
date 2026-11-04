import { lazy } from 'react';

const LegalDocumentsPage = lazy(() => import('./pages/legal/legal-documents-page'));

/** «Контент»: public content of Brevi sites. Today only the public BreviERP documents. */
export const contentRoutes = [{ path: '/content/legal', element: <LegalDocumentsPage /> }] as const;
