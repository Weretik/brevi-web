import { Tab, Tabs } from '@mui/material';

import type { SupplierTab } from '../../hooks/supplier-card/use-supplier-tab';

const labels: Readonly<Record<SupplierTab, string>> = {
  overview: 'Огляд',
  fabrics: 'Тканини',
  accessories: 'Фурнітура',
  products: 'Товари',
  receipts: 'Прихід на склад',
  invoices: 'Рахунки на закупку',
  finance: 'Фінанси',
};

interface Props {
  tab: SupplierTab;
  tabs: readonly SupplierTab[];
  onChange: (tab: SupplierTab) => void;
}

/** The tabs of a supplier card (CARD-001); only those the user may open. */
export function SupplierCardTabs({ tab, tabs, onChange }: Props) {
  return (
    <Tabs
      value={tab}
      aria-label="Картка постачальника"
      variant="scrollable"
      allowScrollButtonsMobile
      onChange={(_, next: SupplierTab) => onChange(next)}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      {tabs.map((value) => (
        <Tab key={value} value={value} label={labels[value]} />
      ))}
    </Tabs>
  );
}
