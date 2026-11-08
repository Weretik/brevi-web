import { Tab, Tabs } from '@mui/material';

import type { CustomerTab } from '../../hooks/customers/use-customer-tab';

interface Props {
  tab: CustomerTab;
  disabled: boolean;
  /** «Фінанси» for those with the «Бухгалтерія» right. */
  canSeeFinance?: boolean;
  onChange: (tab: CustomerTab) => void;
}

export function CustomerTabs({ tab, disabled, canSeeFinance = false, onChange }: Props) {
  return (
    <Tabs
      value={tab}
      aria-label="Картка клієнта"
      onChange={(_, next: CustomerTab) => onChange(next)}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab value="card" label="Картка" />
      <Tab value="quotes" label="КП" disabled={disabled} />
      <Tab value="orders" label="Завдання в цех" disabled={disabled} />
      {canSeeFinance && <Tab value="finance" label="Фінанси" disabled={disabled} />}
    </Tabs>
  );
}
