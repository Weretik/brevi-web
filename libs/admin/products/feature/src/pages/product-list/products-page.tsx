import { ProductsListFilters } from '@admin/products/ui';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ProductDeleteDialog } from '../../components/product-deletion/product-delete-dialog';
import { ProductRowContextMenu } from '../../components/product-list/product-row-context-menu';
import { createProductTableColumns } from '../../components/product-list/product-table-columns';
import { useProductCategories } from '../../hooks/product-list/use-product-categories';
import { useProducts } from '../../hooks/product-list/use-products';

import type { Product, ProductQuery } from '@admin/products/model';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import type { KeyboardEvent, MouseEvent } from 'react';

const emptyQuery: ProductQuery = { page: 1, pageSize: 20, sortBy: 'name', sortDirection: 'asc' };
interface RowMenuState {
  product: Product;
  anchorPosition: { left: number; top: number };
  focusTarget: HTMLElement | null;
}

function ProductsEmptyOverlay() {
  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center' }}>
      <Typography>Товарів не знайдено</Typography>
    </Box>
  );
}

export function ProductsPage() {
  const [query, setQuery] = useState<ProductQuery>(emptyQuery);
  const [searchInput, setSearchInput] = useState('');
  const { categories, error: categoriesError, reload: reloadCategories } = useProductCategories();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [rowMenu, setRowMenu] = useState<RowMenuState | null>(null);
  const { page, loading, error, reload } = useProducts(query);

  const columns = useMemo(() => createProductTableColumns(categories), [categories]);

  function productForRow(row: HTMLDivElement): Product | undefined {
    const rowId = Number(row.dataset['id']);
    return page?.value.find((product) => product.id === rowId);
  }

  function openRowMenu(
    row: HTMLDivElement,
    anchorPosition: RowMenuState['anchorPosition'],
    focusTarget: HTMLElement | null,
  ) {
    const product = productForRow(row);
    if (product) setRowMenu({ product, anchorPosition, focusTarget });
  }

  function handleRowContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    openRowMenu(
      event.currentTarget,
      { left: event.clientX + 2, top: event.clientY - 6 },
      document.activeElement instanceof HTMLElement ? document.activeElement : null,
    );
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
    event.preventDefault();
    const target = event.target instanceof HTMLElement ? event.target : event.currentTarget;
    const bounds = event.currentTarget.getBoundingClientRect();
    openRowMenu(
      event.currentTarget,
      { left: bounds.left + 24, top: bounds.top + bounds.height / 2 },
      target,
    );
  }

  function closeRowMenu() {
    const focusTarget = rowMenu?.focusTarget;
    setRowMenu(null);
    requestAnimationFrame(() => focusTarget?.focus());
  }

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
      <ProductsListFilters
        categories={categories}
        query={query}
        searchInput={searchInput}
        onSearch={() =>
          setQuery((current) => ({
            ...current,
            page: 1,
            search: searchInput.trim() || undefined,
          }))
        }
        onSearchInputChange={setSearchInput}
        onTypeChange={(type) => setQuery((current) => ({ ...current, page: 1, type }))}
        onCategoryChange={(categoryId) =>
          setQuery((current) => ({ ...current, page: 1, categoryId }))
        }
      />
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
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ noRowsOverlay: ProductsEmptyOverlay }}
          slotProps={{
            row: {
              onContextMenu: handleRowContextMenu,
              onKeyDown: handleRowKeyDown,
            },
          }}
        />
      </Box>
      <ProductRowContextMenu
        anchorPosition={rowMenu?.anchorPosition ?? null}
        product={rowMenu?.product ?? null}
        onClose={closeRowMenu}
        onDelete={setDeleteTarget}
      />
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

export default ProductsPage;
