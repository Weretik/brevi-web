import { leadCommentMaxLength, leadResultTakesDate } from '@admin/leads/model';
import { Box, Button, TextField, Typography } from '@mui/material';

import { LeadCallNextDate } from './lead-call-next-date';
import { LeadCallResultButtons } from './lead-call-result-buttons';

import type { LeadCallFormErrors, LeadCallFormValues, LeadCallResult } from '@admin/leads/model';

interface Props {
  company: string;
  results: readonly LeadCallResult[];
  values: LeadCallFormValues;
  errors: LeadCallFormErrors;
  showErrors: boolean;
  saving: boolean;
  now: Date;
  onChange: (values: LeadCallFormValues) => void;
  onSubmit: () => void;
}

/** «Чим закінчився дзвінок?»: one button per result of «Довідники», a date when it needs one, a comment. */
export function LeadCallForm({
  company,
  results,
  values,
  errors,
  showErrors,
  saving,
  now,
  onChange,
  onSubmit,
}: Props) {
  const selected = results.find((x) => x.id === values.resultId);
  const takesDate = leadResultTakesDate(selected);
  const error = (field: keyof LeadCallFormErrors) => (showErrors ? errors[field] : undefined);

  return (
    <Box
      component="form"
      noValidate
      aria-label="Результат дзвінка"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      sx={{ display: 'grid', gap: 2 }}
    >
      <LeadCallResultButtons
        results={results}
        selectedId={values.resultId}
        error={error('resultId')}
        disabled={saving}
        onSelect={(resultId) => onChange({ ...values, resultId })}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: takesDate ? '240px minmax(0, 1fr) auto' : 'minmax(0, 1fr) auto',
          },
          gap: 1.25,
          alignItems: 'start',
        }}
      >
        {takesDate && (
          <LeadCallNextDate
            retry={selected?.outcome === 'Retry'}
            value={values.nextContactAt}
            error={error('nextContactAt')}
            disabled={saving}
            now={now}
            onChange={(nextContactAt) => onChange({ ...values, nextContactAt })}
          />
        )}
        <TextField
          label="Коментар"
          placeholder="З ким говорили, що домовились…"
          value={values.comment}
          disabled={saving}
          multiline
          minRows={1}
          maxRows={4}
          error={Boolean(error('comment'))}
          helperText={error('comment')}
          onChange={(event) => onChange({ ...values, comment: event.target.value })}
          slotProps={{ htmlInput: { maxLength: leadCommentMaxLength } }}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          sx={{ height: 56, px: 2.5, whiteSpace: 'nowrap' }}
        >
          {saving ? 'Зберігаю…' : 'Зберегти → наступний'}
        </Button>
      </Box>
      {takesDate && (
        <Typography variant="caption" color="text.secondary">
          Наступний контакт стане задачею «Подзвонити: {company}» у «Мої завдання», і лід
          повернеться у вашу чергу того дня.
        </Typography>
      )}
    </Box>
  );
}
