import { CustomersReferenceContent } from '@admin/clients/feature';
import { purchaseInvoicesPath } from '@admin/purchasing/feature';
import { Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { SuppliersPage } from '../suppliers/suppliers-page';

interface Props {
  /** The app passes the role check: only the Director sees «Рахунки на закупку» of a supplier. */
  canSeePurchaseInvoices?: boolean;
}

export type CounterpartiesTab = 'suppliers' | 'clients';

/** `?tab=` of the page. */
export function counterpartiesTabOf(value: string | null): CounterpartiesTab {
  return value === 'clients' ? 'clients' : 'suppliers';
}

/**
 * «Загальні довідники → Контрагенти»: suppliers and clients from KeepinCRM, switched by `?tab=`.
 * The old `?tab=purchases` link leads the Director to «Бухгалтерія → Рахунки на закупку».
 */
export function CounterpartiesPage({ canSeePurchaseInvoices = false }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const purchases = canSeePurchaseInvoices;
  const tab = counterpartiesTabOf(searchParams.get('tab'));
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
    </Tabs>
  );
  if (purchases && searchParams.get('tab') === 'purchases') {
    const kept = new URLSearchParams(searchParams);
    kept.delete('tab');
    const query = kept.toString();
    return (
      <Navigate to={query ? `${purchaseInvoicesPath}?${query}` : purchaseInvoicesPath} replace />
    );
  }
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
