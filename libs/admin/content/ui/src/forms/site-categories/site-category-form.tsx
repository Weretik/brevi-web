import { siteCategoryName } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, InputAdornment, MenuItem, Switch, TextField } from '@mui/material';

import { SiteCategoryTextFields } from './site-category-text-fields';

import type {
  SiteCategoryErrors,
  SiteCategoryFormValues,
  SiteCategoryRow,
} from '@admin/content/model';

interface Props {
  values: SiteCategoryFormValues;
  errors: SiteCategoryErrors;
  disabled: boolean;
  /** Categories of the top level this one may sit under (never itself). */
  parents: readonly SiteCategoryRow[];
  /** The category has subcategories, so it must stay on the top level. */
  hasChildren: boolean;
  /** A new category may leave the address empty. */
  isNew: boolean;
  onChange: (values: SiteCategoryFormValues) => void;
}

const top = 'top';

/**
 * Editor of a site category: the mark, the place in the tree, the address and texts by language. The
 * text is edited in the visual editor; nothing is typed as markup.
 */
export function SiteCategoryForm({
  values,
  errors,
  disabled,
  parents,
  hasChildren,
  isNew,
  onChange,
}: Props) {
  return (
    <>
      <ReferenceFormSection title="Розділ">
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
          select
          label="Де стоїть"
          value={values.parentId ?? top}
          disabled={disabled || hasChildren}
          helperText={
            hasChildren
              ? 'У розділу є підрозділи, тому він лишається на верхньому рівні.'
              : 'Верхній рівень або підрозділ іншого розділу. Після перенесення стане останнім.'
          }
          onChange={(event) =>
            onChange({
              ...values,
              parentId: event.target.value === top ? null : Number(event.target.value),
            })
          }
          fullWidth
        >
          <MenuItem value={top}>Верхній рівень</MenuItem>
          {parents.map((parent) => (
            <MenuItem key={parent.id} value={parent.id}>
              Підрозділ у «{siteCategoryName(parent)}»
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Адреса розділу"
          value={values.slug}
          disabled={disabled}
          error={Boolean(errors.slug)}
          helperText={
            errors.slug ??
            (isNew
              ? 'Можна не заповнювати: адреса складеться з назви українською.'
              : 'Частина посилання після /catalog/. Однакова для обох мов.')
          }
          onChange={(event) => onChange({ ...values, slug: event.target.value })}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">/catalog/</InputAdornment>,
              sx: { fontFamily: 'var(--admin-font-mono)' },
            },
          }}
          fullWidth
        />
      </ReferenceFormSection>
      <SiteCategoryTextFields
        values={values}
        errors={errors}
        disabled={disabled}
        onChange={onChange}
      />
    </>
  );
}
