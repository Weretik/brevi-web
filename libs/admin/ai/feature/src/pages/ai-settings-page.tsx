import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';

import { AiBaseInstruction } from '../components/ai-base-instruction';
import { AiKeySection } from '../components/ai-key-section';
import { AiModelsDrawer } from '../components/ai-models-drawer';
import { AiModelsSection } from '../components/ai-models-section';
import { AiRulesSection } from '../components/ai-rules-section';
import { AiStatusStrip } from '../components/ai-status-strip';
import { AiWorkSection } from '../components/ai-work-section';
import { useAiSettings } from '../hooks/use-ai-settings';

import type { AiNotice } from '../hooks/use-ai-settings';
import type { ReactNode } from 'react';

const formatTime = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

function Card({
  title,
  action,
  notice,
  children,
}: {
  title: string;
  action?: ReactNode;
  notice?: AiNotice;
  children: ReactNode;
}) {
  return (
    <Paper component="section" variant="outlined" sx={{ p: 2, minWidth: 0 }} aria-label={title}>
      <Stack sx={{ gap: 1.5 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}
        >
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          {action}
        </Stack>
        {children}
        {notice && <Alert severity={notice.ok ? 'success' : 'error'}>{notice.text}</Alert>}
      </Stack>
    </Paper>
  );
}

/**
 * «Адміністрування › Налаштування ШІ»: the state strip answers «does the AI work now?»; below,
 * every card saves itself next to its fields.
 */
export function AiSettingsPage() {
  const page = useAiSettings();
  const settings = page.settings;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Адміністрування"
        title="Налаштування ШІ"
        subtitle="OpenAI читає рахунки на закупку. Кожна картка зберігається своєю кнопкою."
        actions={null}
      />
      <ReferenceListAlerts
        error={page.error}
        loading={page.loading}
        onRetry={() => void page.reload()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {settings ? (
        <Stack sx={{ gap: 2 }}>
          <AiStatusStrip settings={settings} />
          {/* Wide screens: settings on the left, recognition conditions on the right; no empty band. */}
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              alignItems: 'start',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <Stack sx={{ gap: 2, minWidth: 0 }}>
              <Card title="Робота ШІ" notice={page.notices.work}>
                <AiWorkSection
                  enabled={settings.enabled}
                  hasKey={settings.hasKey}
                  limit={page.limit}
                  limitError={page.limitError}
                  limitDirty={page.limitDirty}
                  disabled={page.busy}
                  onToggle={(enabled) => void page.toggle(enabled)}
                  onLimitChange={page.changeLimit}
                  onSaveLimit={() => void page.saveLimit()}
                />
              </Card>
              <Card title="Ключ OpenAI" notice={page.notices.key}>
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
              </Card>
              <Card
                title="Моделі й ціни"
                notice={page.notices.models}
                action={
                  <Button
                    size="small"
                    startIcon={<EditOutlinedIcon />}
                    disabled={page.busy}
                    onClick={page.openModels}
                  >
                    Змінити
                  </Button>
                }
              >
                <AiModelsSection
                  settings={settings}
                  disabled={page.busy}
                  testingTier={page.testingTier}
                  onTest={(tier) => void page.check(tier)}
                />
              </Card>
            </Stack>
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
          </Box>
          {settings.updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Змінено {formatTime(settings.updatedAt)}
              {settings.updatedBy ? ` · ${settings.updatedBy}` : ''}
            </Typography>
          )}
        </Stack>
      ) : (
        !page.error && (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
            <CircularProgress aria-label="Відкриваємо налаштування ШІ" />
          </Box>
        )
      )}
      {page.models && (
        <AiModelsDrawer
          values={page.models}
          errors={page.modelErrors}
          saving={page.saving}
          onChange={page.changeModels}
          onClose={page.closeModels}
          onSave={() => void page.saveModels()}
        />
      )}
    </Box>
  );
}

export default AiSettingsPage;
