import { quoteSettingsPreviewSample } from '@admin/quotes/model';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useMemo } from 'react';

import { QuoteLetterPreview } from './quote-letter-preview';
import { QuotePdfPreview } from './quote-pdf-preview';

import type { QuoteLetterRef } from '../sections/quote-letters-section';
import type { QuoteSettingsDraft } from '@admin/quotes/model';

export type QuotePreviewView = 'pdf' | 'letter';

interface Props {
  draft: QuoteSettingsDraft;
  view: QuotePreviewView;
  /** The letter open in «Лист клієнту»; the main letter otherwise. */
  letter: QuoteLetterRef | null;
  focused: string | null;
  onViewChange: (view: QuotePreviewView) => void;
}

/** «Перегляд»: the PDF or the letter the client gets, redrawn on every change. */
export function QuoteSettingsPreview({ draft, view, letter, focused, onViewChange }: Props) {
  const sample = useMemo(() => quoteSettingsPreviewSample(draft), [draft]);
  const variant =
    letter && letter !== 'main' ? draft.letterVariants.find((item) => item.key === letter) : null;
  return (
    <Box component="aside" aria-label="Перегляд">
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}
      >
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
          Перегляд
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          aria-label="Що показати"
          onChange={(_, next: QuotePreviewView | null) => next && onViewChange(next)}
        >
          <ToggleButton value="pdf">PDF</ToggleButton>
          <ToggleButton value="letter">Лист</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {view === 'pdf' ? (
        <QuotePdfPreview draft={draft} sample={sample} focused={focused} />
      ) : variant ? (
        <QuoteLetterPreview
          path={`letter:${variant.key}`}
          title={variant.name || 'Без назви'}
          letter={variant}
          sample={sample}
          focused={focused}
        />
      ) : (
        <QuoteLetterPreview
          path="email"
          title="Основний лист"
          letter={draft.email}
          sample={sample}
          focused={focused}
        />
      )}
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>
        Приклад: КП № {sample.number}, менеджер {sample.managerName}. Мітки вже підставлені.
      </Typography>
    </Box>
  );
}
