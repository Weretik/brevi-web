import { Box, Button, ButtonBase, Stack, TextField, Typography } from '@mui/material';

import { QuoteIntroStep } from './quote-intro-step';

import type { QuoteIntroLetter } from '@admin/quotes/model';

interface Props {
  letters: readonly QuoteIntroLetter[];
  letterName: string;
  /** The chosen letter's subject and text changed for this КП; null keeps the variant's. */
  letterSubject: string | null;
  letterBody: string | null;
  onChange: (name: string) => void;
  onEditLetter: (patch: { letterSubject?: string | null; letterBody?: string | null }) => void;
}

const subjectMax = 300;
const bodyMax = 4000;

/**
 * Step 3: the letter variant from «Налаштування КП». The chosen one opens with its subject and text, which can be
 * changed for this КП only (round 2, item 14); a text equal to the variant's is kept as the variant's.
 */
export function QuoteIntroLetterStep({
  letters,
  letterName,
  letterSubject,
  letterBody,
  onChange,
  onEditLetter,
}: Props) {
  return (
    <QuoteIntroStep
      step={3}
      title="Оберіть текст листа"
      description="Клієнт отримає вибраний лист разом із PDF. Тему й текст можна змінити — лише для цього КП."
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
              <Box
                key={letter.name}
                sx={{
                  border: 1,
                  borderRadius: 1,
                  borderColor: selected ? 'primary.main' : 'divider',
                  bgcolor: selected ? 'action.selected' : 'background.paper',
                }}
              >
                <ButtonBase
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(letter.name)}
                  sx={{ display: 'block', width: '100%', textAlign: 'left', p: 1.5 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {letter.name}
                  </Typography>
                  {!selected && (
                    <Typography variant="caption" color="text.secondary">
                      {letter.subject}
                    </Typography>
                  )}
                </ButtonBase>
                {selected && (
                  <LetterEditor
                    letter={letter}
                    subject={letterSubject}
                    body={letterBody}
                    onEdit={onEditLetter}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </QuoteIntroStep>
  );
}

interface EditorProps {
  letter: QuoteIntroLetter;
  subject: string | null;
  body: string | null;
  onEdit: Props['onEditLetter'];
}

function LetterEditor({ letter, subject, body, onEdit }: EditorProps) {
  const changed = subject !== null || body !== null;
  return (
    <Stack sx={{ gap: 1.5, px: 1.5, pb: 1.5 }}>
      <TextField
        size="small"
        fullWidth
        label="Тема листа"
        value={subject ?? letter.subject}
        onChange={(event) =>
          onEdit({
            letterSubject: event.target.value === letter.subject ? null : event.target.value,
          })
        }
        slotProps={{ htmlInput: { maxLength: subjectMax } }}
      />
      <TextField
        size="small"
        fullWidth
        multiline
        minRows={6}
        label="Текст листа"
        value={body ?? letter.body}
        onChange={(event) =>
          onEdit({ letterBody: event.target.value === letter.body ? null : event.target.value })
        }
        helperText="Позначки у фігурних дужках, як {managerName}, підставляться під час надсилання."
        slotProps={{ htmlInput: { maxLength: bodyMax } }}
      />
      {changed && (
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary">
            Лист змінено для цього КП.
          </Typography>
          <Button size="small" onClick={() => onEdit({ letterSubject: null, letterBody: null })}>
            Повернути текст з налаштувань
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
