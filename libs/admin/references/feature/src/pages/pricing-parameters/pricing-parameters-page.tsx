import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { PpeMarkupRulesContent } from './ppe-markup-rules-content';
import { PricingParametersContent } from './pricing-parameters-content';

export type PricingTab = 'parameters' | 'ppe';

export function pricingTabOf(value: string | null): PricingTab {
  return value === 'ppe' ? 'ppe' : 'parameters';
}

/** «Параметри ціноутворення»: both tables of the Calculator sheet «Налаштування цін», `?tab=ppe`. */
export function PricingParametersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = pricingTabOf(searchParams.get('tab'));
  const tabs = (
    <Tabs
      value={tab}
      aria-label="Параметри ціноутворення"
      onChange={(_, next: PricingTab) =>
        setSearchParams(next === 'parameters' ? {} : { tab: next }, { replace: true })
      }
      sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab value="parameters" label="Параметри" />
      <Tab value="ppe" label="Націнки ЗІЗ" />
    </Tabs>
  );
  return tab === 'parameters' ? (
    <PricingParametersContent tabs={tabs} />
  ) : (
    <PpeMarkupRulesContent tabs={tabs} />
  );
}

export default PricingParametersPage;
