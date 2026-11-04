import { ButtonBase, Stack, Typography } from '@mui/material';

import { QuoteIntroStep } from './quote-intro-step';

import type { QuoteIntroLetter } from '@admin/quotes/model';

interface Props {
  letters: readonly QuoteIntroLetter[];
  letterName: string;
  onChange: (name: string) => void;
}

/** Step 3: the letter variant from «Налаштування КП»; its text can be edited in «Надіслати КП». */
export function QuoteIntroLetterStep({ letters, letterName, onChange }: Props) {
  return (
    <QuoteIntroStep
      step={3}
      title="Оберіть текст листа"
      description="Клієнт отримає вибраний лист разом із PDF. Перед відправленням текст можна змінити."
    >
      {letters.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Варіантів листа ще немає: директор додає їх у «Налаштування КП».
        </Typography>
      ) : (
        <Stack role="radiogroup" aria-label="Текст листа" sx={{ gap: 1 }}>
          {letters.map((letter) => {
            const selected = letter.name === letterName;
            return (
              <ButtonBase
                key={letter.name}
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(letter.name)}
                sx={{
                  display: 'block',
                  textAlign: 'left',
                  p: 1.5,
                  border: 1,
                  borderRadius: 1,
                  borderColor: selected ? 'primary.main' : 'divider',
                  bgcolor: selected ? 'action.selected' : 'background.paper',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {letter.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {letter.subject}
                </Typography>
              </ButtonBase>
            );
          })}
        </Stack>
      )}
    </QuoteIntroStep>
  );
}
