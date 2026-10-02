import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

import type { Product, ProductCategory } from '@admin/products/model';
import type { GridColDef } from '@mui/x-data-grid';

export function createProductTableColumns(categories: ProductCategory[]): GridColDef<Product>[] {
  return [
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
  ];
}
