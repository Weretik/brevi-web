import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { FabricsContent } from './fabrics-content';
import { GarmentAccessoriesContent } from './garment-accessories-content';

export type MaterialsTab = 'fabrics' | 'accessories';

export function materialsTabOf(value: string | null): MaterialsTab {
  return value === 'accessories' ? 'accessories' : 'fabrics';
}

/** One page for the Calculator's two material sheets, switched by `?tab=`. */
export function MaterialsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = materialsTabOf(searchParams.get('tab'));
  const tabs = (
    <Tabs
      value={tab}
      aria-label="Матеріали"
      onChange={(_, next: MaterialsTab) =>
        setSearchParams(next === 'fabrics' ? {} : { tab: next }, { replace: true })
      }
      sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab value="fabrics" label="Тканини" />
      <Tab value="accessories" label="Фурнітура" />
    </Tabs>
  );
  return tab === 'fabrics' ? (
    <FabricsContent tabs={tabs} />
  ) : (
    <GarmentAccessoriesContent tabs={tabs} />
  );
}

export default MaterialsPage;
