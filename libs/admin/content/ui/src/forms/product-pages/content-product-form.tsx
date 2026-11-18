import { siteCategoryPath } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Autocomplete, FormControlLabel, InputAdornment, Switch, TextField } from '@mui/material';

import { ContentProductTextFields } from './content-product-text-fields';

import type {
  ContentProductErrors,
  ContentProductFormValues,
  SiteCategoryRow,
} from '@admin/content/model';

interface Props {
  values: ContentProductFormValues;
  errors: ContentProductErrors;
  disabled: boolean;
  /** The tree of «Розділи сайту»; null when the staff member may not see it. */
  categories: readonly SiteCategoryRow[] | null;
  onChange: (values: ContentProductFormValues) => void;
}

/**
 * Editor of a product page: the mark, the address and texts by language. The description is edited in
 * the visual editor, facts and characteristics as rows of fields; nothing is typed as markup.
 */
export function ContentProductForm({ values, errors, disabled, categories, onChange }: Props) {
  const options = categories ?? [];

  return (
    <>
      <ReferenceFormSection title="Сторінка">
        <FormControlLabel
          control={
            <Switch
              checked={values.showOnSite}
              disabled={disabled}
              onChange={(event) => onChange({ ...values, showOnSite: event.target.checked })}
            />
          }
          label="Показувати на сайті"
        />
        <TextField
          label="Адреса сторінки"
          value={values.slug}
          disabled={disabled}
          error={Boolean(errors.slug)}
          helperText={errors.slug ?? 'Частина посилання після /product/. Однакова для обох мов.'}
          onChange={(event) => onChange({ ...values, slug: event.target.value })}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">/product/</InputAdornment>,
              sx: { fontFamily: 'var(--admin-font-mono)' },
            },
          }}
          fullWidth
        />
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={options}
          value={options.filter((row) => values.categoryIds?.includes(row.id))}
          disabled={disabled || categories === null || values.categoryIds === null}
          getOptionLabel={(row) => siteCategoryPath(row, options)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText="Розділів ще немає. Додайте їх у «Розділи сайту»."
          onChange={(_event, rows) =>
            onChange({ ...values, categoryIds: rows.map((row) => row.id) })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Розділи сайту"
              helperText={
                categories === null
                  ? 'Немає права бачити «Розділи сайту», тому розділи товару лишаються як є.'
                  : 'У яких розділах каталогу сайт показує товар. Можна обрати кілька.'
              }
            />
          )}
        />
      </ReferenceFormSection>
      <ContentProductTextFields
        values={values}
        errors={errors}
        disabled={disabled}
        onChange={onChange}
      />
    </>
  );
}
