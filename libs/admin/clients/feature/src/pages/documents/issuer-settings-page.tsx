import { DocumentTemplateFields, IssuerSettingsFields } from '@admin/clients/ui';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

import { issuerSettingsError } from '../../errors/documents/issuer-settings-error';
import { useIssuerSettingsEditor } from '../../hooks/documents/use-issuer-settings-editor';

export default function IssuerSettingsPage() {
  const editor = useIssuerSettingsEditor();
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">
          Реквізити продавця та шаблон КП
        </Typography>
        {editor.query.isLoading && <CircularProgress aria-label="Завантаження реквізитів" />}
        {editor.query.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => void editor.query.refetch()}>Повторити</Button>}
          >
            {issuerSettingsError(editor.query.error)}
          </Alert>
        )}
        {editor.query.data && (
          <Alert severity="info">
            {editor.query.data.active
              ? `Активна версія ${editor.query.data.active.versionNumber}.`
              : 'Активні реквізити ще не задані.'}{' '}
            Створення версії не змінює чинний документ до активації.
          </Alert>
        )}
        {editor.query.data?.active && (
          <Button disabled={editor.busy} onClick={editor.loadActive}>
            Завантажити активну версію до форми
          </Button>
        )}
        <IssuerSettingsFields
          value={editor.issuer}
          errors={editor.issuerErrors}
          disabled={editor.busy}
          onChange={editor.changeIssuer}
        />
        <DocumentTemplateFields
          value={editor.template}
          errors={editor.templateErrors}
          disabled={editor.busy}
          onChange={editor.changeTemplate}
        />
        {editor.error && <Alert severity="error">{editor.error}</Alert>}
        {editor.notice && <Alert severity="success">{editor.notice}</Alert>}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            disabled={editor.busy || !!editor.query.error}
            onClick={() => void editor.save()}
          >
            Створити версію
          </Button>
          <Button
            variant="contained"
            disabled={editor.busy || !editor.created || !editor.query.data}
            onClick={() => void editor.activateCreated()}
          >
            Активувати створену версію
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
