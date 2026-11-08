import { quoteTemplateMarkLabels, quoteTemplateMarks } from '@admin/quotes/model';
import { Chip, Stack, Typography } from '@mui/material';

import type { QuoteMark } from '@admin/quotes/model';

interface Props {
  /** Field name for screen readers: «Вставити «Менеджер» у поле «Текст»». */
  fieldLabel: string;
  /** The marks this field understands; the common ones by default. */
  marks?: readonly QuoteMark[];
  onInsert: (mark: QuoteMark) => void;
}

/** «+ Номер КП», «+ Менеджер»…: inserts the mark where the cursor is, so nobody types braces. */
export function QuoteMarkChips({ fieldLabel, marks = quoteTemplateMarks, onInsert }: Props) {
  return (
    <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
      <Typography variant="caption" color="text.secondary">
        Вставити:
      </Typography>
      {marks.map((mark) => (
        <Chip
          key={mark}
          size="small"
          variant="outlined"
          label={`+ ${quoteTemplateMarkLabels[mark]}`}
          aria-label={`Вставити «${quoteTemplateMarkLabels[mark]}» у поле «${fieldLabel}»`}
          // Keeps the cursor in the field.
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onInsert(mark)}
        />
      ))}
    </Stack>
  );
}
