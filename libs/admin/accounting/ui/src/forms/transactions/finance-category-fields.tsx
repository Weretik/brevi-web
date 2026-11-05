import { MenuItem, TextField } from '@mui/material';

export interface FinanceNamedChoice {
  id: string;
  name: string;
}

interface Props {
  rootId: string;
  subcategoryId: string;
  roots: FinanceNamedChoice[];
  children: FinanceNamedChoice[];
  error?: string;
  /** «Без категорії» in the root list: a counterparty may have no default. */
  optional?: boolean;
  onRootChange: (id: string) => void;
  onSubcategoryChange: (id: string) => void;
}

/** Root category and its subcategory of an operation or a counterparty. */
export function FinanceCategoryFields({
  rootId,
  subcategoryId,
  roots,
  children,
  error,
  optional,
  onRootChange,
  onSubcategoryChange,
}: Props) {
  return (
    <>
      <TextField
        select
        label="Категорія"
        value={rootId}
        onChange={(event) => onRootChange(event.target.value)}
        error={Boolean(error)}
        helperText={
          error ?? (roots.length ? undefined : 'Спершу додайте категорію в «Категоріях».')
        }
        fullWidth
      >
        {optional && <MenuItem value="">Без категорії</MenuItem>}
        {roots.map((root) => (
          <MenuItem key={root.id} value={root.id}>
            {root.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Підкатегорія"
        value={subcategoryId}
        disabled={!children.length}
        onChange={(event) => onSubcategoryChange(event.target.value)}
        fullWidth
      >
        <MenuItem value="">Без підкатегорії</MenuItem>
        {children.map((child) => (
          <MenuItem key={child.id} value={child.id}>
            {child.name}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
