import {
  EmbroideryBreakdownTable,
  EmbroideryPriceCards,
  EmbroiderySavedSummaryView,
} from '@admin/embroidery/ui';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import { Alert, Box, Button, Stack } from '@mui/material';

import { EmbroideryMockupSection } from './embroidery-mockup-section';

import type { EmbroiderySavedCalculation } from '@admin/embroidery/model';
import type { ComponentProps } from 'react';

interface Props {
  saved: EmbroiderySavedCalculation;
  deleteError: string | null;
  canAddToQuote: boolean;
  canDelete: boolean;
  onAdd: () => void;
  onCopy: ComponentProps<typeof EmbroideryPriceCards>['onCopy'];
  onDelete: () => void;
}

/** A saved calculation: its prices, summary, mockup and breakdown, with «Додати в КП» and delete. */
export function EmbroiderySavedDetails({
  saved,
  deleteError,
  canAddToQuote,
  canDelete,
  onAdd,
  onCopy,
  onDelete,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      {deleteError && <Alert severity="error">{deleteError}</Alert>}
      {canAddToQuote && saved.result.prices.length > 0 && (
        <Box>
          <Button variant="outlined" startIcon={<PostAddOutlinedIcon />} onClick={onAdd}>
            Додати в КП
          </Button>
        </Box>
      )}
      <EmbroideryPriceCards
        prices={saved.result.prices}
        quantity={saved.input.quantity}
        error={saved.result.error}
        missing={saved.result.missing}
        missingAction={null}
        waiting={false}
        fetching={false}
        onCopy={onCopy}
      />
      <EmbroiderySavedSummaryView saved={saved} />
      <EmbroideryMockupSection summary={saved.summary} />
      {saved.result.cost && <EmbroideryBreakdownTable cost={saved.result.cost} />}
      {canDelete && (
        <Box>
          <Button color="error" onClick={onDelete}>
            Видалити розрахунок
          </Button>
        </Box>
      )}
    </Stack>
  );
}
