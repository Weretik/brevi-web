import { QuoteActionConfirmation } from '@admin/clients/ui';
import { TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { QuoteAssigneePicker } from '../selection/quote-assignee-picker';

import type { QuoteLifecycleDialogProps } from '../../../models/quotes/quote-lifecycle-dialog-props';
import type { QuoteAssignee } from '@admin/clients/model';

export function QuoteTransferDialog(props: QuoteLifecycleDialogProps) {
  const { detail, pending, uncertain } = props;
  const [reason, setReason] = useState('');
  const [target, setTarget] = useState<QuoteAssignee | null>(null);
  const valid =
    !!reason.trim() && reason.length <= 1000 && !!target && target.userId !== detail.ownerId;
  return (
    <QuoteActionConfirmation
      {...props}
      title="Передати КП"
      valid={valid}
      onConfirm={() => {
        if (valid && target)
          props.onConfirm({
            action: 'transfer',
            quoteId: detail.publicId,
            revision: detail.revision,
            ownerId: target.userId,
            reason: reason.trim(),
          });
      }}
    >
      <Typography>{detail.draft.recipientName}</Typography>
      <Typography>Після передачі доступ до КП визначатиметься вашими правами.</Typography>
      <QuoteAssigneePicker
        value={target}
        onChange={setTarget}
        disabled={pending || uncertain}
        excludeId={detail.ownerId}
      />
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
