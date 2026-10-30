import { QuoteActionConfirmation } from '@admin/clients/ui';
import { TextField, Typography } from '@mui/material';
import { useState } from 'react';

import type { QuoteLifecycleDialogProps } from '../../../models/quotes/quote-lifecycle-dialog-props';

export function QuoteArchiveDialog(props: QuoteLifecycleDialogProps) {
  const { detail, pending, uncertain } = props;
  const [reason, setReason] = useState('');
  const valid = !!reason.trim() && reason.length <= 1000;
  return (
    <QuoteActionConfirmation
      {...props}
      title={detail.archived ? 'Відновити КП' : 'Архівувати КП'}
      valid={valid}
      onConfirm={() => {
        if (valid)
          props.onConfirm({
            action: 'archive',
            quoteId: detail.publicId,
            revision: detail.revision,
            archived: !detail.archived,
            reason: reason.trim(),
          });
      }}
    >
      <Typography>{detail.draft.recipientName}</Typography>
      <TextField
        label="Причина"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        disabled={pending || uncertain}
        multiline
        minRows={2}
        slotProps={{ htmlInput: { maxLength: 1000 } }}
        required
      />
    </QuoteActionConfirmation>
  );
}
