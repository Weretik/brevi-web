import { aiRuleOf, validateAiRule } from '@admin/ai/model';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { AiRuleEditor } from './ai-rule-editor';
import { AiRuleView, ruleNumber as mono } from './ai-rule-view';

interface Props {
  rules: readonly string[];
  disabled: boolean;
  /** Saves the whole list; resolves true when the server accepted it. */
  onSave: (rules: string[], done: string) => Promise<boolean>;
}

type Editing = { index: number | 'new'; draft: string; error?: string } | null;

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
      <AiRuleEditor
        label={index === 'new' ? 'Нова умова' : `Умова ${index + 1}`}
        value={editing.draft}
        error={editing.error}
        disabled={disabled}
        onChange={(draft) => setEditing({ ...editing, draft, error: undefined })}
        onSubmit={() => void submit()}
        onCancel={() => setEditing(null)}
      />
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
              {editor(index) ?? (
                <AiRuleView
                  rule={rule}
                  index={index}
                  asking={deleting === index}
                  busy={busy}
                  disabled={disabled}
                  onEdit={() => setEditing({ index, draft: rule })}
                  onAsk={() => setDeleting(index)}
                  onCancel={() => setDeleting(null)}
                  onDelete={() => void remove(index)}
                />
              )}
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
