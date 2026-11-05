import { aiRuleOf, validateAiRule } from '@admin/ai/model';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

interface Props {
  rules: readonly string[];
  disabled: boolean;
  /** Saves the whole list; resolves true when the server accepted it. */
  onSave: (rules: string[], done: string) => Promise<boolean>;
}

type Editing = { index: number | 'new'; draft: string; error?: string } | null;

const mono = { fontFamily: 'var(--admin-font-mono)', color: 'text.secondary' } as const;

/**
 * Conditions as a list: «+ Додати умову» opens a field in place, each condition can be changed
 * or deleted (asked in its row). Every action saves the list at once.
 */
export function AiRulesSection({ rules, disabled, onSave }: Props) {
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const busy = disabled || editing !== null || deleting !== null;

  async function submit() {
    if (!editing) return;
    const others = rules.filter((_, index) => index !== editing.index);
    const error = validateAiRule(editing.draft, others);
    if (error) {
      setEditing({ ...editing, error });
      return;
    }
    const rule = aiRuleOf(editing.draft);
    const next =
      editing.index === 'new'
        ? [...rules, rule]
        : rules.map((value, index) => (index === editing.index ? rule : value));
    const done = editing.index === 'new' ? 'Умову додано.' : 'Умову змінено.';
    if (await onSave(next, done)) setEditing(null);
  }

  async function remove(at: number) {
    if (
      await onSave(
        rules.filter((_, index) => index !== at),
        'Умову видалено.',
      )
    )
      setDeleting(null);
  }

  const editor = (index: number | 'new') =>
    editing && editing.index === index ? (
      <Stack
        component="form"
        sx={{ gap: 1, flex: 1, minWidth: 0 }}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <TextField
          autoFocus
          size="small"
          label={index === 'new' ? 'Нова умова' : `Умова ${index + 1}`}
          placeholder="Наприклад: «Номер рахунку пиши без №»"
          value={editing.draft}
          error={Boolean(editing.error)}
          helperText={editing.error}
          disabled={disabled}
          onChange={(event) =>
            setEditing({ ...editing, draft: event.target.value, error: undefined })
          }
        />
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button type="submit" variant="contained" size="small" disabled={disabled}>
            Зберегти
          </Button>
          <Button size="small" disabled={disabled} onClick={() => setEditing(null)}>
            Скасувати
          </Button>
        </Stack>
      </Stack>
    ) : null;

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="body2" color="text.secondary">
        Додавайте умову, коли ШІ повторює ту саму помилку.
      </Typography>
      {rules.length === 0 && editing?.index !== 'new' ? (
        <Typography variant="body2">Умов немає: ШІ працює за базовою інструкцією.</Typography>
      ) : (
        <Box
          component="ol"
          aria-label="Умови"
          sx={{ m: 0, p: 0, listStyle: 'none', border: 1, borderColor: 'divider', borderRadius: 1 }}
        >
          {rules.map((rule, index) => (
            <Box
              component="li"
              key={`${index}-${rule}`}
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
                px: 1.5,
                py: 1,
                borderTop: index === 0 ? 0 : 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" sx={{ ...mono, pt: 0.5, minWidth: 20 }}>
                {index + 1}
              </Typography>
              {editor(index) ??
                (deleting === index ? (
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{ gap: 1, flex: 1, alignItems: { sm: 'center' } }}
                  >
                    <Typography variant="body2" color="error.main" sx={{ flex: 1, minWidth: 0 }}>
                      Видалити умову «{rule}»?
                    </Typography>
                    <Stack direction="row" sx={{ gap: 1 }}>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        disabled={disabled}
                        onClick={() => void remove(index)}
                      >
                        Видалити
                      </Button>
                      <Button size="small" disabled={disabled} onClick={() => setDeleting(null)}>
                        Ні
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      sx={{ flex: 1, minWidth: 0, pt: 0.5, wordBreak: 'break-word' }}
                    >
                      {rule}
                    </Typography>
                    <Tooltip title="Змінити">
                      <span>
                        <IconButton
                          size="small"
                          aria-label={`Змінити умову ${index + 1}`}
                          disabled={busy}
                          onClick={() => setEditing({ index, draft: rule })}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Видалити">
                      <span>
                        <IconButton
                          size="small"
                          aria-label={`Видалити умову ${index + 1}`}
                          disabled={busy}
                          onClick={() => setDeleting(index)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </>
                ))}
            </Box>
          ))}
          {editing?.index === 'new' && (
            <Box
              component="li"
              sx={{
                display: 'flex',
                gap: 1.5,
                px: 1.5,
                py: 1,
                borderTop: rules.length === 0 ? 0 : 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" sx={{ ...mono, pt: 1, minWidth: 20 }}>
                {rules.length + 1}
              </Typography>
              {editor('new')}
            </Box>
          )}
        </Box>
      )}
      {editing?.index !== 'new' && (
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            disabled={busy}
            onClick={() => setEditing({ index: 'new', draft: '' })}
          >
            Додати умову
          </Button>
        </Box>
      )}
    </Stack>
  );
}
