import {
  ReferenceFormSection,
  ReferenceListAlerts,
  ReferencePageHeader,
} from '@admin/references/ui';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';

import { AiKeySection } from '../components/ai-key-section';
import { AiModelsSection } from '../components/ai-models-section';
import { AiPromptSection } from '../components/ai-prompt-section';
import { AiUsageSection } from '../components/ai-usage-section';
import { useAiSettings } from '../hooks/use-ai-settings';

const formatTime = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

/** «Адміністрування › Налаштування ШІ»: OpenAI key, models, limit and recognition rules. */
export function AiSettingsPage() {
  const page = useAiSettings();
  const settings = page.settings;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Адміністрування"
        title="Налаштування ШІ"
        subtitle="OpenAI читає рахунки на закупку. Тут ключ, моделі, ціни та ліміт витрат."
        actions={
          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            disabled={page.busy || !page.dirty}
            onClick={() => void page.save()}
          >
            Зберегти
          </Button>
        }
      />
      <ReferenceListAlerts
        error={page.error}
        loading={page.loading}
        onRetry={() => void page.reload()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {page.notice && (
        <Alert
          severity={page.notice.ok ? 'success' : 'error'}
          onClose={page.clearNotice}
          sx={{ mb: 2 }}
        >
          {page.notice.text}
        </Alert>
      )}
      {settings && page.values ? (
        <Paper variant="outlined" sx={{ p: 2, maxWidth: 860 }}>
          <Stack sx={{ gap: 3 }}>
            <ReferenceFormSection title="Ключ OpenAI">
              <AiKeySection
                hasKey={settings.hasKey}
                keyHint={settings.keyHint}
                value={page.key}
                error={page.keyError}
                disabled={page.busy}
                onChange={page.changeKey}
                onSave={() => void page.saveKey()}
                onRemove={() => {
                  if (window.confirm('Видалити ключ OpenAI? ШІ буде вимкнено.'))
                    void page.deleteKey();
                }}
              />
            </ReferenceFormSection>
            <ReferenceFormSection title="Моделі та ліміт">
              <AiModelsSection
                values={page.values}
                errors={page.errors}
                hasKey={settings.hasKey}
                disabled={page.busy}
                testingTier={page.testingTier}
                canTest={settings.hasKey && !page.dirty}
                onChange={page.change}
                onTest={(tier) => void page.check(tier)}
              />
            </ReferenceFormSection>
            <ReferenceFormSection title="Витрати цього місяця">
              <AiUsageSection usage={settings.usage} limitUsd={settings.monthlyLimitUsd} />
            </ReferenceFormSection>
            {settings.prompts.map((prompt) => (
              <ReferenceFormSection key={prompt.key} title={prompt.title}>
                <AiPromptSection
                  prompt={prompt}
                  value={page.prompts[prompt.key] ?? ''}
                  dirty={page.promptDirty(prompt.key)}
                  disabled={page.busy}
                  onChange={(text) => page.changePrompt(prompt.key, text)}
                  onSave={() => void page.savePrompt(prompt.key)}
                />
              </ReferenceFormSection>
            ))}
            {settings.updatedAt && (
              <Typography variant="caption" color="text.secondary">
                Змінено {formatTime(settings.updatedAt)}
                {settings.updatedBy ? ` · ${settings.updatedBy}` : ''}
              </Typography>
            )}
          </Stack>
        </Paper>
      ) : (
        !page.error && (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
            <CircularProgress aria-label="Відкриваємо налаштування ШІ" />
          </Box>
        )
      )}
    </Box>
  );
}

export default AiSettingsPage;
