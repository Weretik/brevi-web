import { formatMoney } from '@admin/warehouse/model';
import { Autocomplete, TextField } from '@mui/material';

import type { FabricStockChoices, FabricStockFabricChoice } from '@admin/warehouse/model';

const offerLabel = (offer: FabricStockFabricChoice) =>
  [
    offer.code,
    offer.name,
    offer.supplier,
    offer.price === null ? null : `${formatMoney(offer.price)}/м`,
    offer.code !== offer.groupCode ? `на складі як ${offer.groupCode}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

interface FabricProps {
  choices: FabricStockChoices;
  value: number | null;
  error: string | undefined;
  disabled: boolean;
  onChange: (fabricId: number | null) => void;
}

/** The exact offer of «Тканини»: code, name, supplier and, for people who see them, the price. */
export function FabricOfferField({ choices, value, error, disabled, onChange }: FabricProps) {
  const offer = choices.fabrics.find((x) => x.id === value) ?? null;
  return (
    <Autocomplete
      options={choices.fabrics}
      value={offer}
      disabled={disabled}
      getOptionLabel={offerLabel}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      onChange={(_event, selected) => onChange(selected?.id ?? null)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Тканина"
          required
          error={Boolean(error)}
          helperText={error ?? 'Чинні позиції «Тканини» з кодом FAB-.'}
        />
      )}
    />
  );
}

interface ColorProps {
  colors: readonly string[];
  value: string;
  error: string | undefined;
  disabled: boolean;
  onChange: (color: string) => void;
}

/** A colour of «Кольори»: the stock keeps one name per colour. */
export function StockColorField({ colors, value, error, disabled, onChange }: ColorProps) {
  return (
    <Autocomplete
      options={[...colors]}
      value={value || null}
      disabled={disabled}
      onChange={(_event, selected) => onChange(selected ?? '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Колір"
          required
          error={Boolean(error)}
          helperText={error ?? 'З довідника «Кольори».'}
        />
      )}
    />
  );
}
