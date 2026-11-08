import { bankStatementFileLimits } from '@admin/accounting/model';
import { BankStatementsGrid } from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { bankStatementPath } from '../../accounting.routes';
import { useBankStatementUpload } from '../../hooks/statements/use-bank-statement-upload';

/**
 * «Бухгалтерія → Виписки банку» (ACC-001 stage 6): upload a PrivatBank statement of one account and the history
 * of uploads. A statement opens as a preview; nothing reaches the books until «Провести виписку».
 */
export function BankStatementsPage() {
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const upload = useBankStatementUpload((statement) =>
    navigate(bankStatementPath(statement.id), { state: { existing: statement.existing } }),
  );

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Виписки банку"
        subtitle="Виписка ПриватБанку стає операціями й переказами після перевірки рядків"
        actions={null}
      />
      <Stack sx={{ gap: 2 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack sx={{ gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Оберіть рахунок і файл виписки XLSX, XLS або CSV з Приват24. Brevi розпізнає
              контрагентів, перекази між своїми рахунками й рядки, які вже є в обліку. Записує лише
              кнопка «Провести виписку».
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5 }}>
              <TextField
                select
                size="small"
                label="Рахунок"
                value={upload.accountId}
                onChange={(event) => upload.setAccountId(event.target.value)}
                disabled={upload.uploading || upload.accounts.length < 2}
                helperText={
                  !upload.accountsLoading && !upload.accounts.length
                    ? 'Немає активних банківських рахунків або карток.'
                    : undefined
                }
                sx={{ minWidth: 280 }}
              >
                {upload.accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                startIcon={<UploadFileOutlinedIcon />}
                disabled={upload.uploading || !upload.accountId}
                onClick={() => input.current?.click()}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, height: 40 }}
              >
                Завантажити виписку
              </Button>
              <input
                ref={input}
                type="file"
                hidden
                accept={bankStatementFileLimits.accept}
                aria-label="Файл виписки"
                onChange={(event) => {
                  const picked = event.target.files?.[0];
                  event.target.value = '';
                  if (picked) upload.send(picked);
                }}
              />
            </Stack>
            {upload.uploading && (
              <Stack sx={{ gap: 0.5 }}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary">
                  Читаємо виписку…
                </Typography>
              </Stack>
            )}
            {upload.message && <Alert severity="error">{upload.message}</Alert>}
          </Stack>
        </Paper>
        <ReferenceListAlerts
          error={upload.error}
          loading={upload.loading}
          onRetry={upload.retry}
          actionMessage={null}
          onCloseActionMessage={() => undefined}
        />
        <Paper variant="outlined" sx={{ minWidth: 0, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ px: 2, py: 1.5 }}>
            Історія виписок
          </Typography>
          <BankStatementsGrid
            rows={upload.statements}
            loading={upload.loading}
            unavailable={Boolean(upload.error)}
            onOpen={(statement) => navigate(bankStatementPath(statement.id))}
          />
        </Paper>
      </Stack>
    </Box>
  );
}

export default BankStatementsPage;
