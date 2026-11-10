import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { FabricColorsContent } from './fabric-colors-content';
import { FabricsContent } from './fabrics-content';
import { GarmentAccessoriesContent } from './garment-accessories-content';

export type MaterialsTab = 'fabrics' | 'accessories' | 'colors';

export function materialsTabOf(value: string | null): MaterialsTab {
  return value === 'accessories' || value === 'colors' ? value : 'fabrics';
}

/** One page for the material sheets and their colours list, switched by `?tab=`. */
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
      <Tab value="colors" label="Кольори" />
    </Tabs>
  );
  if (tab === 'colors') return <FabricColorsContent tabs={tabs} />;
  return tab === 'fabrics' ? (
    <FabricsContent tabs={tabs} />
  ) : (
    <GarmentAccessoriesContent tabs={tabs} />
  );
}

export default MaterialsPage;
