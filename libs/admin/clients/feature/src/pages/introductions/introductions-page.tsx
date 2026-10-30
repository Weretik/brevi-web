import { IntroductionTemplateForm, IntroductionTemplatesList } from '@admin/clients/ui';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Pagination,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { IntroductionCatalogPickers } from '../../components/introductions/introduction-catalog-pickers';
import { IntroductionSelectionPanel } from '../../components/introductions/introduction-selection-panel';
import { useIntroductionCatalogPickers } from '../../hooks/introductions/use-introduction-catalog-pickers';
import { useIntroductionEditor } from '../../hooks/introductions/use-introduction-editor';

export default function IntroductionsPage() {
  const editor = useIntroductionEditor();
  const navigate = useNavigate();
  const pickers = useIntroductionCatalogPickers(editor);
  const source = editor.draft.source;
  const disabled = editor.busy || !!source?.archived;
  const currentEmailOptions = editor.draft.values.emailTemplateVersionId
    ? [{ id: editor.draft.values.emailTemplateVersionId, label: 'Збережена версія шаблону листа' }]
    : [];
  if (editor.accessDenied)
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Alert
          severity="error"
          action={<Button onClick={() => void editor.list.refetch()}>Оновити доступ</Button>}
        >
          Доступ до добірок змінився. Попередні дані приховано.
        </Alert>
      </Box>
    );
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">
          Добірки для першого знайомства
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button onClick={() => navigate('/crm/quotes')}>Розрахунки та КП</Button>
          <Button disabled={editor.busy} onClick={editor.reset}>
            Нова добірка
          </Button>
        </Stack>
        <Alert severity="info">
          Сезон і доступність перевіряються сервером перед створенням КП.
        </Alert>
        {editor.mapping.error && (
          <Alert severity="error">
            Конфігурація головних моделей недоступна. Оновіть її перед створенням КП.
          </Alert>
        )}
        <FormControlLabel
          label="Показати архівні добірки"
          control={
            <Switch
              checked={editor.includeArchived}
              disabled={editor.busy}
              onChange={(_, value) => {
                editor.setIncludeArchived(value);
                editor.setPage(1);
              }}
            />
          }
        />
        {editor.list.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => void editor.list.refetch()}>Повторити</Button>}
          >
            Не вдалося завантажити добірки.
          </Alert>
        )}
        <IntroductionTemplatesList
          rows={editor.list.currentData?.rows ?? []}
          selectedId={source?.id}
          loading={editor.busy || editor.list.isFetching}
          onSelect={(id) => void editor.open(id)}
          onArchive={editor.setArchived}
          onReuse={(id) => void editor.open(id)}
        />
        <Pagination
          aria-label="Сторінки добірок"
          page={editor.page}
          count={Math.max(1, editor.list.currentData?.totalPages ?? 1)}
          disabled={editor.busy || editor.list.isFetching}
          onChange={(_, value) => editor.setPage(value)}
        />
        {editor.busy && !editor.action.uncertain && (
          <CircularProgress aria-label="Виконання дії з добіркою" />
        )}
        {editor.readError && <Alert severity="error">{editor.readError}</Alert>}
        {editor.action.error && <Alert severity="error">{editor.action.error}</Alert>}
        {editor.action.uncertain && (
          <Alert
            severity="warning"
            action={
              <Button onClick={() => void editor.action.execute()}>
                Повторити той самий запит
              </Button>
            }
          >
            Результат дії невідомий. Повторіть запит до зміни добірки.
          </Alert>
        )}
        {source?.archived && (
          <Alert severity="info">
            Добірка в архіві. Відновіть її у списку, щоб змінювати або створювати КП.
          </Alert>
        )}
        {editor.draft.dirty && (
          <Alert severity="info">Збережіть зміни перед перевіркою та створенням КП.</Alert>
        )}
        <IntroductionTemplateForm
          value={editor.draft.values}
          emailTemplateOptions={currentEmailOptions}
          disabled={disabled}
          onChange={editor.draft.change}
          onSave={editor.save}
          submitLabel={source ? 'Зберегти нову версію добірки' : 'Зберегти добірку'}
        />
        <TextField
          label="Одержувач нового КП"
          value={editor.recipientName}
          disabled={disabled}
          onChange={(event) => editor.setRecipientName(event.target.value)}
          helperText="КП буде створено як чернетку. Перевірте його перед готовністю та PDF."
        />
        <IntroductionSelectionPanel
          format={editor.draft.values.format}
          slots={editor.slotViews}
          selectionToken={editor.selectionToken}
          disabled={disabled}
          onFormatChange={(format) => editor.draft.change({ ...editor.draft.values, format })}
          onChooseProduct={pickers.chooseProduct}
          onChooseFabric={pickers.chooseFabric}
          onCheck={editor.checkSelection}
          onApply={editor.applySelection}
        />
        <IntroductionCatalogPickers pickers={pickers} />
      </Stack>
    </Box>
  );
}
