import { Box } from '@mui/material';

interface Props {
  active: boolean;
}

/** «Цех» status pill for «Використовувати в проєкті»: dot, soft background, text label. */
export function SupplierStatusPill({ active }: Props) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        height: 24,
        px: 1,
        borderRadius: 999,
        typography: 'caption',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        bgcolor: active ? 'success.light' : 'action.hover',
        color: active ? 'success.main' : 'text.secondary',
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }}
      />
      {active ? 'Активний' : 'Не використовується'}
    </Box>
  );
}
