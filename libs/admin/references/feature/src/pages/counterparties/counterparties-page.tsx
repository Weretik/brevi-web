import { CustomersReferenceContent } from '@admin/clients/feature';
import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { SuppliersPage } from '../suppliers/suppliers-page';

export type CounterpartiesTab = 'suppliers' | 'clients';

export function counterpartiesTabOf(value: string | null): CounterpartiesTab {
  return value === 'clients' ? 'clients' : 'suppliers';
}

/** «Загальні довідники → Контрагенти»: suppliers and clients from KeepinCRM, switched by `?tab=`. */
export function CounterpartiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = counterpartiesTabOf(searchParams.get('tab'));
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
  return tab === 'suppliers' ? (
    <SuppliersPage tabs={tabs} />
  ) : (
    <CustomersReferenceContent tabs={tabs} />
  );
}

export default CounterpartiesPage;
