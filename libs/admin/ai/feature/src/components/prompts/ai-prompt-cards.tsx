import { Stack } from '@mui/material';

import { AiBaseInstruction } from './ai-base-instruction';
import { AiRulesSection } from './ai-rules-section';
import { Card } from '../settings/ai-settings-card';

import type { useAiSettings } from '../../hooks/use-ai-settings';
import type { AiSettings } from '@admin/ai/model';

interface Props {
  settings: AiSettings;
  page: ReturnType<typeof useAiSettings>;
}

/** One card per AI task: its base instruction and the conditions the staff added. */
export function AiPromptCards({ settings, page }: Props) {
  return (
    <Stack sx={{ gap: 2, minWidth: 0 }}>
      {settings.prompts.map((prompt) => (
        <Card key={prompt.key} title={prompt.title} notice={page.notices.prompt}>
          <Stack sx={{ gap: 2 }}>
            <AiBaseInstruction text={prompt.baseText} />
            <AiRulesSection
              rules={page.rulesOf(prompt.key)}
              disabled={page.busy}
              onSave={(rules, done) => page.saveRules(prompt.key, rules, done)}
            />
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
