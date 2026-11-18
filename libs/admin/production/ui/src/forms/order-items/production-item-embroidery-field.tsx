import { embroideryChoiceText, embroideryLinkLabel } from '@admin/production/model';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';

import type {
  ItemApplicationFormValues,
  ItemEmbroideryLink,
  ProductionEmbroideryChoice,
} from '@admin/production/model';

/** «Розрахунок вишивки»: saved calculations found by the typed text. */
export interface EmbroideryPicker {
  options: readonly ProductionEmbroideryChoice[];
  loading: boolean;
  onSearch: (text: string) => void;
}

type EmbroideryOption = ItemEmbroideryLink & { details?: string };

const toOption = (x: ProductionEmbroideryChoice): EmbroideryOption => ({
  id: x.id,
  number: x.number,
  name: x.name,
  details: [embroideryChoiceText(x), x.customerName].filter(Boolean).join(' · '),
});

interface Props {
  id: string;
  application: ItemApplicationFormValues;
  disabled: boolean;
  /** Without it a linked calculation is shown but cannot be changed. */
  embroidery?: EmbroideryPicker;
  onChange: (application: ItemApplicationFormValues) => void;
}

/** «Розрахунок вишивки» of an embroidery: a saved calculation found by the typed text. */
export function ProductionItemEmbroideryField({
  id,
  application,
  disabled,
  embroidery,
  onChange,
}: Props) {
  const options = (embroidery?.options ?? []).map(toOption);
  return (
    <Autocomplete<EmbroideryOption>
      id={id}
      sx={{ gridColumn: { sm: '1 / -1' } }}
      options={options}
      value={application.embroidery}
      disabled={disabled || !embroidery}
      loading={embroidery?.loading ?? false}
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={embroideryLinkLabel}
      noOptionsText="Розрахунків не знайдено"
      onInputChange={(_event, text, reason) => {
        if (reason === 'input') embroidery?.onSearch(text);
      }}
      onChange={(_event, value) =>
        onChange({
          ...application,
          embroidery: value ? { id: value.id, number: value.number, name: value.name } : null,
          description: application.description || value?.name || '',
        })
      }
      renderOption={({ key, ...props }, option) => (
        <li key={key} {...props}>
          <Box>
            <Typography variant="body2">{embroideryLinkLabel(option)}</Typography>
            {option.details && (
              <Typography variant="caption" color="text.secondary">
                {option.details}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Розрахунок вишивки"
          helperText="З «Ціна вишивки»: цех побачить стібки, пʼяльця, матеріали й макет"
        />
      )}
    />
  );
}
