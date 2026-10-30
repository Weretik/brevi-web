import { QuoteActionConfirmation } from '@admin/clients/ui';
import { Typography } from '@mui/material';

import type { QuoteLifecycleDialogProps } from '../../../models/quotes/quote-lifecycle-dialog-props';

export function QuoteCopyDialog(
  props: QuoteLifecycleDialogProps & { versionId: string; versionNumber: number },
) {
  const { detail, versionId, versionNumber } = props;
  return (
    <QuoteActionConfirmation
      {...props}
      title="Скопіювати КП"
      valid
      onConfirm={() =>
        props.onConfirm({
          action: 'copy',
          quoteId: detail.publicId,
          revision: detail.revision,
          versionId,
        })
      }
    >
      <Typography>{detail.draft.recipientName}</Typography>
      <Typography>
        Копія збереже ціни вибраної версії {versionNumber} та стане новою чернеткою.
      </Typography>
    </QuoteActionConfirmation>
  );
}
