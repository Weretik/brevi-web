import {
  ActivateEmailTemplateDialog,
  EmailTemplateDetails,
  EmailTemplateFields,
  EmailTemplateVersionsList,
} from '@admin/clients/ui';
import { Alert, Box, Button, CircularProgress, Pagination, Stack, Typography } from '@mui/material';

import { useEmailTemplateRegistry } from '../../hooks/documents/email-templates/use-email-template-registry';

export default function EmailTemplatesPage() {
  const editor = useEmailTemplateRegistry();
  if (editor.accessDenied)
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Alert
          severity="error"
          action={
            <Button
              onClick={() => {
                if (editor.action.forbidden) {
                  window.location.reload();
                  return;
                }
                editor.retryReadAccess();
              }}
            >
              {editor.action.forbidden ? 'Перезавантажити сторінку' : 'Оновити доступ'}
            </Button>
          }
        >
          Доступ до шаблонів листів змінено. Попередні дані приховано.
        </Alert>
      </Box>
    );
  const active = editor.settings.currentData?.active;
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">
          Шаблони листів
        </Typography>
        <Typography color="text.secondary">
          Збережені версії незмінні. Створення версії не активує її та не надсилає листів.
        </Typography>
        {(editor.roles.isLoading || editor.list.isLoading || editor.settings.isLoading) && (
          <CircularProgress aria-label="Завантаження шаблонів листів" />
        )}
        {!!editor.roles.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => void editor.roles.refetch()}>Повторити</Button>}
          >
            Не вдалося перевірити права. Створення й активація недоступні.
          </Alert>
        )}
        {editor.settings.error ? (
          <Alert
            severity="error"
            action={<Button onClick={() => void editor.settings.refetch()}>Повторити</Button>}
          >
            Не вдалося завантажити активний шаблон.
          </Alert>
        ) : (
          editor.settings.currentData && (
            <Alert severity="info">
              {active
                ? `Активна версія ${active.number}: ${active.label}.`
                : 'Активного шаблону ще немає.'}
            </Alert>
          )
        )}
        {editor.list.error ? (
          <Alert
            severity="error"
            action={<Button onClick={() => void editor.list.refetch()}>Повторити</Button>}
          >
            Не вдалося завантажити версії шаблонів.
          </Alert>
        ) : (
          !editor.list.isLoading && (
            <EmailTemplateVersionsList
              rows={editor.list.currentData?.rows ?? []}
              activeId={active?.id}
              disabled={editor.busy}
              onSelect={(id) => void editor.open(id)}
            />
          )
        )}
        <Pagination
          aria-label="Сторінки шаблонів листів"
          page={editor.page}
          count={Math.max(1, editor.list.currentData?.totalPages ?? 1)}
          disabled={editor.busy || editor.list.isFetching}
          onChange={(_, page) => editor.setPage(page)}
        />
        {editor.loading && <CircularProgress aria-label="Завантаження версії шаблону" />}
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
            Результат дії невідомий. Поля заблоковано до уточнення результату.
          </Alert>
        )}
        {editor.notice && <Alert severity="success">{editor.notice}</Alert>}
        {editor.selected && (
          <EmailTemplateDetails
            value={editor.selected}
            canManage={editor.canManage}
            disabled={editor.busy}
            canActivate={
              !!editor.settings.currentData &&
              !editor.settings.error &&
              !editor.settings.isFetching &&
              active?.id !== editor.selected.id
            }
            onCopy={editor.copySelected}
            onActivate={() => editor.setConfirmActivation(true)}
          />
        )}
        {editor.canManage ? (
          <Stack spacing={2}>
            <Typography component="h2" variant="h6">
              Нова версія
            </Typography>
            <EmailTemplateFields
              value={editor.draft}
              errors={editor.errors}
              disabled={editor.busy}
              onChange={editor.change}
              onSave={editor.save}
            />
          </Stack>
        ) : (
          !editor.roles.isLoading &&
          !editor.roles.error && (
            <Alert severity="info">
              Доступний перегляд. Створення й активація — лише для адміністратора.
            </Alert>
          )
        )}
        <ActivateEmailTemplateDialog
          open={editor.confirmActivation && !!editor.selected && editor.canManage}
          versionNumber={editor.selected?.number ?? null}
          disabled={editor.busy || !!editor.settings.error || !!editor.settings.isFetching}
          onClose={() => editor.setConfirmActivation(false)}
          onConfirm={editor.activate}
        />
      </Stack>
    </Box>
  );
}
