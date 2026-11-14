import { productOverviewLimits, productSeasons, sewingModelNameLimit } from '@admin/products/model';
import { InputAdornment, CircularProgress, MenuItem, Stack, TextField } from '@mui/material';

import type { ProductSectionOption } from '../product-overview/product-overview-form';
import type {
  ProductSeason,
  SewingModelField,
  SewingModelFieldErrors,
  SewingModelFormValues,
} from '@admin/products/model';

interface Props {
  values: SewingModelFormValues;
  errors: SewingModelFieldErrors;
  sections: ProductSectionOption[];
  /** The uniqueness check of the code is running. */
  checkingCode: boolean;
  /** Short note under the code when it is free («Код вільний»). */
  codeNote: string | null;
  disabled: boolean;
  onChange: <Field extends SewingModelField>(
    field: Field,
    value: SewingModelFormValues[Field],
  ) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/** Step 1 «Модель»: the fields of the sheet tab «Товари» for a new sewing model. */
export function SewingModelForm({
  values,
  errors,
  sections,
  checkingCode,
  codeNote,
  disabled,
  onChange,
}: Props) {
  return (
    <Stack component="fieldset" sx={{ gap: 2, m: 0, p: 0, border: 0, minWidth: 0 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
        <TextField
          label="Код моделі"
          required
          placeholder="MOD-025"
          value={values.code}
          onChange={(event) => onChange('code', event.target.value)}
          error={Boolean(errors.code)}
          helperText={errors.code ?? codeNote ?? ' '}
          disabled={disabled}
          slotProps={{
            htmlInput: { maxLength: productOverviewLimits.code, style: mono },
            input: {
              endAdornment: checkingCode ? (
                <InputAdornment position="end">
                  <CircularProgress size={16} aria-label="Перевірка коду" />
                </InputAdornment>
              ) : undefined,
            },
          }}
          sx={{ flex: { sm: '0 0 220px' } }}
        />
        <TextField
          label="Назва"
          required
          placeholder="Костюм «Верде»"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name ?? ' '}
          disabled={disabled}
          slotProps={{ htmlInput: { maxLength: sewingModelNameLimit } }}
          fullWidth
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
        <TextField
          select
          label="Розділ"
          required
          value={values.sectionId}
          onChange={(event) =>
            onChange('sectionId', event.target.value === '' ? '' : Number(event.target.value))
          }
          error={Boolean(errors.sectionId)}
          helperText={errors.sectionId ?? 'Розділи редагуються на сторінці «Типи і розділи».'}
          disabled={disabled}
          fullWidth
        >
          {sections.map((section) => (
            <MenuItem key={section.id} value={section.id}>
              {section.isActive ? section.name : `${section.name} (вимкнений)`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Сезон"
          value={values.season}
          onChange={(event) => onChange('season', event.target.value as ProductSeason | '')}
          helperText=" "
          disabled={disabled}
          sx={{ flex: { sm: '0 0 200px' } }}
        >
          <MenuItem value="">Без сезону</MenuItem>
          {productSeasons.map((season) => (
            <MenuItem key={season} value={season}>
              {season}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <TextField
        label="Посилання на сайті"
        placeholder="https://brevi.com.ua/…"
        value={values.currentSiteUrl}
        onChange={(event) => onChange('currentSiteUrl', event.target.value)}
        error={Boolean(errors.currentSiteUrl)}
        helperText={errors.currentSiteUrl ?? 'Необов’язково. Звідси КП поки бере фото товару.'}
        disabled={disabled}
        slotProps={{ htmlInput: { maxLength: productOverviewLimits.currentSiteUrl } }}
        fullWidth
      />
      <TextField
        label="Опис для КП"
        value={values.quoteDescription}
        onChange={(event) => onChange('quoteDescription', event.target.value)}
        error={Boolean(errors.quoteDescription)}
        helperText={errors.quoteDescription ?? 'Необов’язково.'}
        disabled={disabled}
        multiline
        minRows={3}
        slotProps={{ htmlInput: { maxLength: productOverviewLimits.quoteDescription } }}
        fullWidth
      />
    </Stack>
  );
}
