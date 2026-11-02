import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { GarmentPartOperationsContent } from './garment-part-operations-content';
import { GarmentPartsContent } from './garment-parts-content';

export type OperationsTab = 'operations' | 'groups';

export function operationsTabOf(value: string | null): OperationsTab {
  return value === 'groups' || value === 'parts' ? 'groups' : 'operations';
}

/** The Calculator sheet «Операції» with its «Група деталей» list, switched by `?tab=`. */
export function OperationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = operationsTabOf(searchParams.get('tab'));
  const tabs = (
    <Tabs
      value={tab}
      aria-label="Операції"
      onChange={(_, next: OperationsTab) =>
        setSearchParams(next === 'operations' ? {} : { tab: next }, { replace: true })
      }
      sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab value="operations" label="Операції" />
      <Tab value="groups" label="Групи деталей" />
    </Tabs>
  );
  return tab === 'operations' ? (
    <GarmentPartOperationsContent tabs={tabs} />
  ) : (
    <GarmentPartsContent tabs={tabs} />
  );
}

export default OperationsPage;
