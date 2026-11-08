import {
  leadCommentMaxLength,
  leadOutcomeHint,
  leadQuickDates,
  leadResultTakesDate,
} from '@admin/leads/model';
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';

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

const tones = { Client: 'success.main', Closed: 'error.main' } as const;

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
      <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <Typography variant="overline" component="legend" color="text.secondary" sx={{ mb: 1 }}>
          Чим закінчився дзвінок?
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 1,
          }}
        >
          {results.map((result) => {
            const active = result.id === values.resultId;
            return (
              <Button
                key={result.id}
                type="button"
                variant="outlined"
                color="inherit"
                aria-pressed={active}
                disabled={saving}
                onClick={() => onChange({ ...values, resultId: result.id })}
                sx={{
                  minHeight: 56,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  textAlign: 'left',
                  textTransform: 'none',
                  px: 1.75,
                  borderColor: active ? 'primary.main' : 'divider',
                  bgcolor: active ? 'primary.light' : 'background.paper',
                  color:
                    result.outcome in tones
                      ? tones[result.outcome as keyof typeof tones]
                      : 'text.primary',
                }}
              >
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ fontWeight: 600, color: 'inherit' }}
                >
                  {result.name}
                </Typography>
                <Typography variant="caption" component="span" color="text.secondary">
                  {leadOutcomeHint(result.outcome, result.retryDays)}
                </Typography>
              </Button>
            );
          })}
        </Box>
        {error('resultId') && (
          <Typography
            variant="caption"
            color="error"
            role="alert"
            sx={{ mt: 0.5, display: 'block' }}
          >
            {error('resultId')}
          </Typography>
        )}
      </Box>

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
          <Box>
            <TextField
              label={
                selected?.outcome === 'Retry' ? 'Коли повторити (необов’язково)' : 'Коли зв’язатися'
              }
              type="datetime-local"
              value={values.nextContactAt}
              disabled={saving}
              error={Boolean(error('nextContactAt'))}
              helperText={error('nextContactAt')}
              onChange={(event) => onChange({ ...values, nextContactAt: event.target.value })}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { style: { fontFamily: 'var(--admin-font-mono)' } },
              }}
            />
            <Stack direction="row" sx={{ gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
              {leadQuickDates(now).map((quick) => (
                <Chip
                  key={quick.label}
                  size="small"
                  label={quick.label}
                  variant={values.nextContactAt === quick.value ? 'filled' : 'outlined'}
                  onClick={() => onChange({ ...values, nextContactAt: quick.value })}
                />
              ))}
            </Stack>
          </Box>
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
