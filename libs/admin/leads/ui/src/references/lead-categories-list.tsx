import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Typography } from '@mui/material';

import { mono } from '../components/mono';

import type { LeadCategory } from '@admin/leads/model';

interface Props {
  categories: readonly LeadCategory[];
  onEdit?: (category: LeadCategory) => void;
}

/** «Категорії»: codes come from the sheet, the description is written here. */
export function LeadCategoriesList({ categories, onEdit }: Props) {
  if (!categories.length)
    return (
      <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1.5 }}>
        Категорії з’являться після синхронізації таблиці
      </Typography>
    );
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {categories.map((category) => (
        <Box
          component="li"
          key={category.code}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 44,
          }}
        >
          <Typography sx={{ ...mono, fontWeight: 700, width: 32, flex: 'none' }}>
            {category.code}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              minWidth: 0,
              color: category.description ? 'text.primary' : 'text.secondary',
            }}
          >
            {category.description ?? 'Без опису'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={mono}>
            {category.leads}
          </Typography>
          {onEdit && (
            <IconButton
              size="small"
              aria-label={`Редагувати категорію ${category.code}`}
              onClick={() => onEdit(category)}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
}
