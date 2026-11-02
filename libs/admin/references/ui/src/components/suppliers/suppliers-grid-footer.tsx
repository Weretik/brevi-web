import { Typography } from '@mui/material';
import {
  GridFooterContainer,
  GridPagination,
  gridRowSelectionStateSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';

export function SuppliersGridFooter() {
  const apiRef = useGridApiContext();
  const selection = useGridSelector(apiRef, gridRowSelectionStateSelector);
  return (
    <GridFooterContainer sx={{ px: 2, gap: 1, flexWrap: 'wrap' }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontVariantNumeric: 'tabular-nums' }}
      >
        Вибрано: {selection.ids.size}
      </Typography>
      <GridPagination />
    </GridFooterContainer>
  );
}
