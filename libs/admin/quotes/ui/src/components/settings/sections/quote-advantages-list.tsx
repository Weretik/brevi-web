import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import { Box, IconButton, Stack, Typography } from '@mui/material';

import { QuoteSettingsField } from '../form/quote-settings-field';
import { errorsAt } from '../form/quote-settings-layout';

import type { QuoteAdvantageDraft, QuoteSettingsErrors } from '@admin/quotes/model';

interface Props {
  advantages: readonly QuoteAdvantageDraft[];
  saved: readonly QuoteAdvantageDraft[];
  errors: QuoteSettingsErrors;
  onChange: (index: number, patch: Partial<QuoteAdvantageDraft>) => void;
  onMove: (from: number, to: number) => void;
}

/** The five «Переваги»: one row each, the order as on the catalog page. */
export function QuoteAdvantagesList({ advantages, saved, errors, onChange, onMove }: Props) {
  return (
    <Box>
      {errors['introduction.advantages'] && (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {errors['introduction.advantages']}
        </Typography>
      )}
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
        {advantages.map((advantage, index) => {
          const at = errorsAt(errors, `advantage:${index}`);
          return (
            <Stack
              key={index}
              direction={{ xs: 'column', md: 'row' }}
              sx={{
                gap: 1.5,
                p: 1.5,
                alignItems: { md: 'flex-start' },
                borderTop: index === 0 ? 0 : 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{ width: 20, pt: 1, color: 'text.secondary', fontWeight: 600, flexShrink: 0 }}
              >
                {index + 1}
              </Typography>
              <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
                <QuoteSettingsField
                  required
                  path={`advantage:${index}.title`}
                  label={`Перевага ${index + 1}`}
                  value={advantage.title}
                  saved={saved[index]?.title}
                  error={at('title')}
                  onChange={(title) => onChange(index, { title })}
                />
              </Box>
              <Box sx={{ flex: '1.4 1 0', minWidth: 0 }}>
                <QuoteSettingsField
                  path={`advantage:${index}.text`}
                  label="Пояснення"
                  value={advantage.text}
                  saved={saved[index]?.text}
                  error={at('text')}
                  onChange={(text) => onChange(index, { text })}
                />
              </Box>
              <Stack direction="row" sx={{ flexShrink: 0 }}>
                <IconButton
                  size="small"
                  aria-label={`Вище: перевага ${index + 1}`}
                  disabled={index === 0}
                  onClick={() => onMove(index, index - 1)}
                >
                  <ArrowUpwardOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label={`Нижче: перевага ${index + 1}`}
                  disabled={index === advantages.length - 1}
                  onClick={() => onMove(index, index + 1)}
                >
                  <ArrowDownwardOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}
