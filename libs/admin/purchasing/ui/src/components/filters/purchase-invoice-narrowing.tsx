import { Button, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { PurchaseDocumentVat } from '@admin/purchasing/model';

interface Props {
  /** yyyy-mm-dd or ''. */
  from: string;
  to: string;
  vat: PurchaseDocumentVat | null;
  onChange: (changes: { from?: string; to?: string; vat?: PurchaseDocumentVat | null }) => void;
}

/**
 * «Дата рахунку з … по …» and «З ПДВ / Без ПДВ» over the recognized facts: invoices that are not
 * recognized yet have no date or VAT and drop out while a value is set.
 */
export function PurchaseInvoiceNarrowing({ from, to, vat, onChange }: Props) {
  const active = Boolean(from || to || vat);
  return (
    <Stack
      direction="row"
      role="group"
      aria-label="Дата рахунку і ПДВ"
      sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 1.5 }}
    >
      <TextField
        size="small"
        type="date"
        label="Дата рахунку з"
        value={from}
        onChange={(event) => onChange({ from: event.target.value })}
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: to || undefined } }}
        sx={{ width: 170 }}
      />
      <TextField
        size="small"
        type="date"
        label="по"
        value={to}
        onChange={(event) => onChange({ to: event.target.value })}
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: from || undefined } }}
        sx={{ width: 170 }}
      />
      <ToggleButtonGroup
        size="small"
        exclusive
        value={vat ?? 'all'}
        aria-label="ПДВ"
        onChange={(_, next: PurchaseDocumentVat | 'all' | null) => {
          if (next) onChange({ vat: next === 'all' ? null : next });
        }}
      >
        <ToggleButton value="all">Усі</ToggleButton>
        <ToggleButton value="WithVat">З ПДВ</ToggleButton>
        <ToggleButton value="WithoutVat">Без ПДВ</ToggleButton>
      </ToggleButtonGroup>
      {active && (
        <Button size="small" onClick={() => onChange({ from: '', to: '', vat: null })}>
          Скинути дату і ПДВ
        </Button>
      )}
    </Stack>
  );
}
