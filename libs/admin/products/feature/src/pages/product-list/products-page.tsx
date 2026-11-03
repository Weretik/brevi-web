import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { ProductOverviewContent } from './product-overview-content';

import type { ProductOverviewType } from '@admin/products/model';

export function productsTabOf(value: string | null): ProductOverviewType {
  return value === 'ppe' ? 'Ppe' : 'Sewing';
}

/** «Товари»: two tables of the Calculator sheet, switched by `?tab=ppe`. */
export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = productsTabOf(searchParams.get('tab'));
  const tabs = (
    <Tabs
      value={type}
      aria-label="Товари"
      onChange={(_, next: ProductOverviewType) =>
        setSearchParams(next === 'Sewing' ? {} : { tab: 'ppe' }, { replace: true })
      }
      sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab value="Sewing" label="Швейна продукція" />
      <Tab value="Ppe" label="ЗІЗ" />
    </Tabs>
  );
  return <ProductOverviewContent key={type} type={type} tabs={tabs} />;
}

export default ProductsPage;
