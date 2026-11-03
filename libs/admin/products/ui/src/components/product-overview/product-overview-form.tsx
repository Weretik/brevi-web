import { productOverviewLimits, productSeasons } from '@admin/products/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import type {
  ProductOverviewField,
  ProductOverviewFieldErrors,
  ProductOverviewFormValues,
  ProductOverviewType,
  ProductSeason,
} from '@admin/products/model';

export interface ProductSectionOption {
  id: number;
  name: string;
  isActive: boolean;
}

interface Props {
  type: ProductOverviewType;
  values: ProductOverviewFormValues;
  errors: ProductOverviewFieldErrors;
  sections: ProductSectionOption[];
  onChange: <Field extends ProductOverviewField>(
    field: Field,
    value: ProductOverviewFormValues[Field],
  ) => void;
}

export function ProductOverviewForm({ type, values, errors, sections, onChange }: Props) {
  const sewing = type === 'Sewing';
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Товар">
        <TextField
          label={sewing ? 'ID моделі' : 'Артикул сайту'}
          placeholder={sewing ? 'MOD-025' : '17'}
          value={values.code}
          onChange={(event) => onChange('code', event.target.value)}
          error={Boolean(errors.code)}
          helperText={errors.code}
          slotProps={{ htmlInput: { maxLength: productOverviewLimits.code } }}
          fullWidth
        />
        <TextField
          select
          label={sewing ? 'Категорія' : 'Розділ / категорія'}
          value={values.sectionId}
          onChange={(event) =>
            onChange('sectionId', event.target.value === '' ? '' : Number(event.target.value))
          }
          error={Boolean(errors.sectionId)}
          helperText={errors.sectionId ?? 'Розділи редагуються на сторінці «Типи і розділи».'}
          fullWidth
        >
          <MenuItem value="">Без розділу</MenuItem>
          {sections.map((section) => (
            <MenuItem key={section.id} value={section.id}>
              {section.isActive ? section.name : `${section.name} (вимкнений)`}
            </MenuItem>
          ))}
        </TextField>
        {sewing && (
          <TextField
            select
            label="Сезон"
            value={values.season}
            onChange={(event) => onChange('season', event.target.value as ProductSeason | '')}
            fullWidth
          >
            <MenuItem value="">—</MenuItem>
            {productSeasons.map((season) => (
              <MenuItem key={season} value={season}>
                {season}
              </MenuItem>
            ))}
          </TextField>
        )}
        <FormControlLabel
          control={
            <Switch
              checked={values.isActive}
              onChange={(event) => onChange('isActive', event.target.checked)}
            />
          }
          label="Активний"
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Для КП">
        <TextField
          label="Посилання на товар на сайті"
          placeholder="https://brevi.com.ua/…"
          value={values.currentSiteUrl}
          onChange={(event) => onChange('currentSiteUrl', event.target.value)}
          error={Boolean(errors.currentSiteUrl)}
          helperText={errors.currentSiteUrl ?? 'Звідси КП поки бере фото товару.'}
          slotProps={{ htmlInput: { maxLength: productOverviewLimits.currentSiteUrl } }}
          fullWidth
        />
        <TextField
          label="Короткий опис для КП"
          value={values.quoteDescription}
          onChange={(event) => onChange('quoteDescription', event.target.value)}
          error={Boolean(errors.quoteDescription)}
          helperText={errors.quoteDescription}
          multiline
          minRows={3}
          slotProps={{ htmlInput: { maxLength: productOverviewLimits.quoteDescription } }}
          fullWidth
        />
      </ReferenceFormSection>
    </Stack>
  );
}
