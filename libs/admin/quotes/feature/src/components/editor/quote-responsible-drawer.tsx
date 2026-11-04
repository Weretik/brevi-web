import { useGetQuoteStaffQuery, useSetQuoteResponsibleMutation } from '@admin/quotes/data-access';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { UserAvatar } from '@admin/shared/ui';
import { Alert, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { Quote } from '@admin/quotes/model';

interface Props {
  quote: Quote;
  onClose: () => void;
  onDone: (quote: Quote) => void;
}

/** «Передати розрахунок»: Director or Admin gives the КП to themselves or another manager. */
export function QuoteResponsibleDrawer({ quote, onClose, onDone }: Props) {
  const staff = useGetQuoteStaffQuery();
  const [assign, assigning] = useSetQuoteResponsibleMutation();
  const [userId, setUserId] = useState(quote.responsible.userId);
  const [error, setError] = useState<string | null>(null);

  return (
    <ReferenceEditorDrawer
      titleId="quote-responsible-title"
      title="Передати розрахунок"
      description={`Зараз відповідальний(-а): ${quote.responsible.name}. Автор не змінюється.`}
      formId="quote-responsible-form"
      paperWidth={420}
      readOnly={false}
      saving={assigning.isLoading}
      saveDisabled={userId === quote.responsible.userId}
      submitLabel="Передати"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={async () => {
        setError(null);
        try {
          onDone(await assign({ id: quote.id, version: quote.version, userId }).unwrap());
        } catch (cause) {
          setError((cause as { message?: string }).message ?? 'Не вдалося передати КП.');
        }
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {staff.isError && <Alert severity="error">Не вдалося завантажити менеджерів.</Alert>}
      <RadioGroup value={userId} onChange={(event) => setUserId(Number(event.target.value))}>
        {(staff.data ?? []).map((member) => (
          <FormControlLabel
            key={member.userId}
            value={member.userId}
            control={<Radio />}
            label={
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <UserAvatar name={member.name} size={28} />
                <span>
                  <Typography variant="body2">{member.name}</Typography>
                  {member.email && (
                    <Typography variant="caption" color="text.secondary">
                      {member.email}
                    </Typography>
                  )}
                </span>
              </Stack>
            }
            sx={{ py: 0.5 }}
          />
        ))}
      </RadioGroup>
    </ReferenceEditorDrawer>
  );
}
