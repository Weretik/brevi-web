import { quoteMaxLetterVariants } from '@admin/quotes/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';

import { quoteMarksHint } from './quote-email-template-card';
import {
  QuoteSettingsCard,
  QuoteSettingsField,
  QuoteSettingsGrid,
  errorsAt,
} from './quote-settings-fields';

import type { QuoteLetterVariantDraft, QuoteSettingsErrors } from '@admin/quotes/model';

interface Props {
  variants: readonly QuoteLetterVariantDraft[];
  errors: QuoteSettingsErrors;
  onAdd: () => void;
  onChange: (key: string, patch: Partial<QuoteLetterVariantDraft>) => void;
  onRemove: (key: string) => void;
}

/** «Варіанти листа»: ready letters the manager picks when sending a КП. */
export function QuoteLetterVariantsCard({ variants, errors, onAdd, onChange, onRemove }: Props) {
  return (
    <QuoteSettingsCard
      title="Варіанти листа"
      description={`Готові листи, з яких менеджер обирає при надсиланні. ${quoteMarksHint}`}
    >
      <Stack sx={{ gap: 2 }}>
        {variants.map((variant, index) => {
          const at = errorsAt(errors, `letter:${variant.key}`);
          return (
            <Box key={variant.key} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <QuoteSettingsGrid>
                  <QuoteSettingsField
                    required
                    label={`Назва варіанта ${index + 1}`}
                    value={variant.name}
                    error={at('name')}
                    onChange={(name) => onChange(variant.key, { name })}
                  />
                  <QuoteSettingsField
                    required
                    label="Тема"
                    value={variant.subject}
                    error={at('subject')}
                    onChange={(subject) => onChange(variant.key, { subject })}
                  />
                  <QuoteSettingsField
                    required
                    wide
                    multiline
                    label="Текст"
                    value={variant.body}
                    error={at('body')}
                    onChange={(body) => onChange(variant.key, { body })}
                  />
                </QuoteSettingsGrid>
              </Box>
              <Tooltip title="Видалити варіант">
                <IconButton
                  aria-label={`Видалити варіант ${index + 1}`}
                  onClick={() => onRemove(variant.key)}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
        <Button
          variant="outlined"
          startIcon={<AddOutlinedIcon />}
          onClick={onAdd}
          disabled={variants.length >= quoteMaxLetterVariants}
          sx={{ alignSelf: 'flex-start' }}
        >
          Додати варіант
        </Button>
      </Stack>
    </QuoteSettingsCard>
  );
}
