import AddIcon from '@mui/icons-material/Add';
import { ButtonBase, Card, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  /** The label of the slot. */
  head: ReactNode;
  isMain: boolean;
  seasonHint: string;
  problem: string | null | undefined;
  onPick: () => void;
}

/** A slot without a model: «Обрати модель» (or why the main model is missing). */
export function QuoteIntroEmptySlot({ head, isMain, seasonHint, problem, onPick }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{ p: 1.5, borderStyle: 'dashed', display: 'flex', flexDirection: 'column' }}
    >
      {head}
      <ButtonBase
        onClick={onPick}
        disabled={isMain}
        sx={{ flex: 1, minHeight: 160, flexDirection: 'column', gap: 0.5, borderRadius: 1 }}
      >
        <AddIcon />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {isMain ? 'Головну модель не знайдено' : 'Обрати модель'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {seasonHint}
        </Typography>
      </ButtonBase>
      {problem && (
        <Typography variant="caption" color="error.main">
          {problem}
        </Typography>
      )}
    </Card>
  );
}
