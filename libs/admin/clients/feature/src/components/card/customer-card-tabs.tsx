import { Tab, Tabs } from '@mui/material';

import type { CustomerTab } from '../../hooks/card/use-customer-tab';

const labels: Readonly<Record<CustomerTab, string>> = {
  overview: 'Огляд',
  quotes: 'КП',
  orders: 'Завдання в цех',
  tasks: 'Завдання менеджерам',
  embroidery: 'Розрахунки вишивки',
  finance: 'Фінанси',
};

interface Props {
  tab: CustomerTab;
  tabs: readonly CustomerTab[];
  /** Counts of the period, shown after the label («КП 12»). */
  counts?: Partial<Record<CustomerTab, number | undefined>>;
  onChange: (tab: CustomerTab) => void;
}

/** The tabs of a client card (CARD-001); only those the user may open. */
export function CustomerCardTabs({ tab, tabs, counts = {}, onChange }: Props) {
  return (
    <Tabs
      value={tab}
      aria-label="Картка клієнта"
      variant="scrollable"
      allowScrollButtonsMobile
      onChange={(_, next: CustomerTab) => onChange(next)}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      {tabs.map((value) => (
        <Tab
          key={value}
          value={value}
          label={counts[value] !== undefined ? `${labels[value]} ${counts[value]}` : labels[value]}
        />
      ))}
    </Tabs>
  );
}
