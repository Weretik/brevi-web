import { ppeCreateLimits, ppeUnitSuggestions, productOverviewLimits } from '@admin/products/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Autocomplete, MenuItem, Stack, TextField } from '@mui/material';

import { PpeLinkField } from '../../components/ppe-card/ppe-link-field';

import type { PpeCreateFieldsProps } from './ppe-create-fields-props';

export interface PpeCreateSectionOption {
  id: number;
  name: string;
}

interface Props extends PpeCreateFieldsProps {
  sections: readonly PpeCreateSectionOption[];
  /** A short note under the code field: «Перевіряємо…» or «Артикул вільний.». */
  codeNote: string | null;
}

/** Block 1 «Товар»: what the site shows for the product (sheet tab «ЗІЗ», columns A–E). */
export function PpeCreateProductFields({ values, errors, disabled, onChange, ...props }: Props) {
  return (
    <ReferenceFormSection title="Товар">
      <TextField
        label="Назва"
        required
        value={values.name}
        onChange={(event) => onChange('name', event.target.value)}
        error={Boolean(errors.name)}
        helperText={errors.name}
        disabled={disabled}
        fullWidth
        slotProps={{ htmlInput: { maxLength: ppeCreateLimits.name } }}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
        <TextField
          label="Артикул на сайті"
          required
          value={values.code}
          onChange={(event) => onChange('code', event.target.value)}
          error={Boolean(errors.code)}
          helperText={errors.code ?? props.codeNote ?? 'Унікальний серед ЗІЗ.'}
          disabled={disabled}
          fullWidth
          slotProps={{
            htmlInput: { maxLength: productOverviewLimits.code, spellCheck: false },
          }}
        />
        <TextField
          select
          label="Розділ"
          required
          value={values.sectionId}
          onChange={(event) =>
            onChange('sectionId', event.target.value === '' ? '' : Number(event.target.value))
          }
          error={Boolean(errors.sectionId)}
          helperText={
            errors.sectionId ??
            (props.sections.length === 0 ? 'Немає розділів ЗІЗ — «Типи і розділи».' : undefined)
          }
          disabled={disabled}
          fullWidth
        >
          <MenuItem value="">—</MenuItem>
          {props.sections.map((section) => (
            <MenuItem key={section.id} value={section.id}>
              {section.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Autocomplete
        freeSolo
        options={ppeUnitSuggestions}
        value={values.unit}
        inputValue={values.unit}
        onInputChange={(_, value) => onChange('unit', value)}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Одиниця"
            required
            error={Boolean(errors.unit)}
            helperText={errors.unit ?? 'Наприклад: пара, шт, комплект.'}
          />
        )}
      />
      <PpeLinkField
        label="Посилання на сайті Brevi"
        openLabel="Відкрити товар на сайті"
        value={values.currentSiteUrl}
        maxLength={productOverviewLimits.currentSiteUrl}
        error={errors.currentSiteUrl}
        helperText="Можна додати пізніше."
        disabled={disabled}
        onChange={(value) => onChange('currentSiteUrl', value)}
      />
    </ReferenceFormSection>
  );
}
