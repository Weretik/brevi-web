import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ProductDeleteDialog } from '../components/product-delete-dialog';
import { useProductCategories } from '../hooks/use-product-categories';
import { useProducts } from '../hooks/use-products';

import type { Product, ProductQuery } from '@admin/products/data-access';
import type { GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

const emptyQuery: ProductQuery = { page: 1, pageSize: 20, sortBy: 'name', sortDirection: 'asc' };

export function ProductsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState<ProductQuery>(emptyQuery);
  const [searchInput, setSearchInput] = useState('');
  const { categories, error: categoriesError, reload: reloadCategories } = useProductCategories();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const { page, loading, error, reload } = useProducts(query);

  const columns: GridColDef<Product>[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    {
      field: 'mainPhoto',
      headerName: 'Фото',
      width: 90,
      sortable: false,
      renderCell: ({ row }) =>
        row.mainPhoto ? (
          <Box
            component="img"
            src={row.mainPhoto.url}
            alt=""
            sx={{ width: 48, height: 48, objectFit: 'contain' }}
          />
        ) : (
          '—'
        ),
    },
    {
      field: 'name',
      headerName: 'Назва',
      flex: 1,
      minWidth: 180,
      renderCell: ({ row }) => <Link to={`/references/products/${row.id}`}>{row.name}</Link>,
    },
    {
      field: 'type',
      headerName: 'Тип',
      width: 120,
      sortable: false,
      valueFormatter: (value: Product['type']) => (value === 'Sewing' ? 'Швейний' : 'ЗІЗ'),
    },
    {
      field: 'categoryIds',
      headerName: 'Категорії',
      width: 200,
      sortable: false,
      renderCell: ({ row }) =>
        row.categoryIds
          .map((id) => categories.find((category) => category.id === id)?.name ?? `#${id}`)
          .join(', ') || '—',
    },
    {
      field: 'minimumWholesalePrice',
      headerName: 'Мін. оптова ціна',
      width: 190,
      sortable: false,
      valueFormatter: (value: number) =>
        value > 0 ? value.toLocaleString('uk-UA') : 'Не розраховано',
    },
    {
      field: 'createdAtUtc',
      headerName: 'Створено',
      width: 150,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString('uk-UA'),
    },
    {
      field: 'updatedAtUtc',
      headerName: 'Змінено',
      width: 150,
      valueFormatter: (value: string | null) =>
        value ? new Date(value).toLocaleDateString('uk-UA') : '—',
    },
    {
      field: 'actions',
      headerName: 'Дії',
      width: 240,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row">
          <Button size="small" onClick={() => navigate(`/references/products/${row.id}/edit`)}>
            Змінити
          </Button>
          <Button size="small" color="error" onClick={() => setDeleteTarget(row)}>
            Видалити
          </Button>
        </Stack>
      ),
    },
  ];

  function changePage(model: GridPaginationModel) {
    setQuery((current) => ({
      ...current,
      page: model.page + 1,
      pageSize: model.pageSize as 10 | 20 | 50,
    }));
  }
  function changeSort(model: GridSortModel) {
    const sort = model[0];
    setQuery((current) => ({
      ...current,
      page: 1,
      sortBy:
        sort?.field === 'createdAtUtc'
          ? 'createdAt'
          : sort?.field === 'updatedAtUtc'
            ? 'updatedAt'
            : sort?.field === 'id'
              ? 'id'
              : 'name',
      sortDirection: sort?.sort === 'desc' ? 'desc' : 'asc',
    }));
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', gap: 2, mb: 2 }}
      >
        <Typography variant="h4" component="h1">
          Товари
        </Typography>
        <Button component={Link} to="/references/products/create" variant="contained">
          Створити товар
        </Button>
      </Stack>
      <Stack
        component="form"
        direction={{ xs: 'column', md: 'row' }}
        sx={{ gap: 2, mb: 2 }}
        onSubmit={(event) => {
          event.preventDefault();
          setQuery((current) => ({ ...current, page: 1, search: searchInput.trim() || undefined }));
        }}
      >
        <TextField
          label="Пошук за ID або назвою"
          size="small"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <Button type="submit" variant="outlined">
          Знайти
        </Button>
        <TextField
          select
          label="Тип"
          size="small"
          value={query.type ?? ''}
          sx={{ minWidth: 140 }}
          onChange={(event) =>
            setQuery((current) => ({
              ...current,
              page: 1,
              type: (event.target.value as ProductQuery['type']) || undefined,
            }))
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
          sx={{ minWidth: 180 }}
          onChange={(event) =>
            setQuery((current) => ({
              ...current,
              page: 1,
              categoryId: event.target.value ? Number(event.target.value) : undefined,
            }))
          }
        >
          <MenuItem value="">Усі</MenuItem>
          {categories
            .filter((item) => item.isActive)
            .map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
        </TextField>
      </Stack>
      {error && (
        <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {categoriesError && (
        <Alert
          severity="warning"
          action={<Button onClick={reloadCategories}>Повторити</Button>}
          sx={{ mb: 2 }}
        >
          {categoriesError}
        </Alert>
      )}
      <Box sx={{ minHeight: 440, width: '100%' }}>
        <DataGrid
          aria-label="Товари"
          rows={loading || error ? [] : (page?.value ?? [])}
          columns={columns}
          loading={loading}
          paginationMode="server"
          sortingMode="server"
          sortModel={[
            {
              field:
                query.sortBy === 'createdAt'
                  ? 'createdAtUtc'
                  : query.sortBy === 'updatedAt'
                    ? 'updatedAtUtc'
                    : (query.sortBy ?? 'name'),
              sort: query.sortDirection ?? 'asc',
            },
          ]}
          rowCount={page?.pagedInfo.totalRecords ?? 0}
          paginationModel={{ page: (query.page ?? 1) - 1, pageSize: query.pageSize ?? 20 }}
          onPaginationModelChange={changePage}
          onSortModelChange={changeSort}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'Товарів не знайдено' }}
        />
      </Box>
      <ProductDeleteDialog
        id={deleteTarget?.id ?? null}
        name={deleteTarget?.name ?? ''}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => {
          setDeleteTarget(null);
          reload();
        }}
      />
    </Box>
  );
}
