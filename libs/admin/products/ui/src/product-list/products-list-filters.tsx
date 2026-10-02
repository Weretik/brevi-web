import { Button, MenuItem, Stack, TextField } from '@mui/material';

import type { ProductCategory, ProductQuery } from '@admin/products/model';

const filterFieldSx = {
  '& .MuiOutlinedInput-root': { bgcolor: 'common.white', color: 'common.black' },
  '& .MuiInputLabel-root': { color: 'grey.700' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
  '& .MuiSvgIcon-root': { color: 'grey.700' },
} as const;

interface Props {
  categories: ProductCategory[];
  query: ProductQuery;
  searchInput: string;
  onCategoryChange: (categoryId: number | undefined) => void;
  onSearch: () => void;
  onSearchInputChange: (search: string) => void;
  onTypeChange: (type: ProductQuery['type'] | undefined) => void;
}

export function ProductsListFilters({
  categories,
  onCategoryChange,
  onSearch,
  onSearchInputChange,
  onTypeChange,
  query,
  searchInput,
}: Props) {
  return (
    <Stack
      component="form"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: 2, mb: 2 }}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <TextField
        label="Пошук за ID або назвою"
        size="small"
        sx={filterFieldSx}
        value={searchInput}
        onChange={(event) => onSearchInputChange(event.target.value)}
      />
      <Button type="submit" variant="outlined">
        Знайти
      </Button>
      <TextField
        select
        label="Тип"
        size="small"
        value={query.type ?? ''}
        sx={{ ...filterFieldSx, minWidth: 140 }}
        onChange={(event) =>
          onTypeChange((event.target.value as ProductQuery['type']) || undefined)
        }
      >
        <MenuItem value="">Усі</MenuItem>
        <MenuItem value="Sewing">Швейні</MenuItem>
        <MenuItem value="Ppe">ЗІЗ</MenuItem>
      </TextField>
      <TextField
        select
        label="Категорія"
        size="small"
        value={query.categoryId ?? ''}
        sx={{ ...filterFieldSx, minWidth: 180 }}
        onChange={(event) =>
          onCategoryChange(event.target.value ? Number(event.target.value) : undefined)
        }
      >
        <MenuItem value="">Усі</MenuItem>
        {categories
          .filter((category) => category.isActive)
          .map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
      </TextField>
    </Stack>
  );
}
