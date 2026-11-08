import { CustomersReferenceContent } from '@admin/clients/feature';
import { PurchaseInvoicesContent } from '@admin/purchasing/feature';
import { Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SuppliersPage } from '../suppliers/suppliers-page';

interface Props {
  /** The app passes the role check: accountant and Admin see «Рахунки на закупку». */
  canSeePurchaseInvoices?: boolean;
}

export type CounterpartiesTab = 'suppliers' | 'clients' | 'purchases';

/** `?tab=` of the page; «Рахунки на закупку» falls back to suppliers for those who cannot see it. */
export function counterpartiesTabOf(value: string | null, purchases = false): CounterpartiesTab {
  if (value === 'clients') return 'clients';
  if (value === 'purchases' && purchases) return 'purchases';
  return 'suppliers';
}

/**
 * «Загальні довідники → Контрагенти»: suppliers and clients from KeepinCRM, and purchase invoices
 * for the accountant and Admin, switched by `?tab=`.
 */
export function CounterpartiesPage({ canSeePurchaseInvoices = false }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const purchases = canSeePurchaseInvoices;
  const tab = counterpartiesTabOf(searchParams.get('tab'), purchases);
  const openSupplierId = Number(searchParams.get('supplier')) || null;
  const dropOpenSupplier = useCallback(
    () =>
      setSearchParams(
        (params) => {
          params.delete('supplier');
          return params;
        },
        { replace: true },
      ),
    [setSearchParams],
  );
  const tabs = (
    <Tabs
      value={tab}
      aria-label="Контрагенти"
      onChange={(_, next: CounterpartiesTab) =>
        setSearchParams(next === 'suppliers' ? {} : { tab: next }, { replace: true })
      }
      sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab value="suppliers" label="Постачальники" />
      <Tab value="clients" label="Клієнти" />
      {purchases && <Tab value="purchases" label="Рахунки на закупку" />}
    </Tabs>
  );
  if (tab === 'purchases') return <PurchaseInvoicesContent tabs={tabs} />;
  return tab === 'suppliers' ? (
    <SuppliersPage
      tabs={tabs}
      canSeePurchaseInvoices={purchases}
      openSupplierId={openSupplierId}
      onSupplierOpened={dropOpenSupplier}
    />
  ) : (
    <CustomersReferenceContent tabs={tabs} />
  );
}

export default CounterpartiesPage;
