import { legacyFinanceFileLimits } from '@admin/accounting/model';
import { FinanceDeleteDialog, LegacyImportReport } from '@admin/accounting/ui';
import { ReferencePageHeader } from '@admin/references/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Alert, Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';

import { financeAccountsPath } from '../../accounting.routes';
import { useLegacyFinanceImport } from '../../hooks/import/use-legacy-finance-import';

/** «Бухгалтерія → Перенесення архіву»: the one-off move of the old Calculator «Фінанси» (ACC-001 stage 5). */
export function LegacyFinanceImportPage() {
  const input = useRef<HTMLInputElement>(null);
  const [confirming, setConfirming] = useState(false);
  const { file, report, message, running, toAdd, canMove, pick, move } = useLegacyFinanceImport();
  const busy = running !== null;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Перенесення архіву"
        subtitle="Рахунки, категорії, контрагенти, операції й перекази зі старих «Фінансів» Калькулятора"
        actions={
          canMove && (
            <Button variant="contained" disabled={busy} onClick={() => setConfirming(true)}>
              Перенести
            </Button>
          )
        }
      />
      <Stack sx={{ gap: 2 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack sx={{ gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Оберіть файл finance.json з експорту Калькулятора. Спершу Brevi лише перевірить його й
              покаже, що буде перенесено; записує тільки кнопка «Перенести». Повторне перенесення
              додає лише те, чого ще немає.
            </Typography>
            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<UploadFileOutlinedIcon />}
                disabled={busy}
                onClick={() => input.current?.click()}
              >
                {file ? 'Обрати інший файл' : 'Обрати finance.json'}
              </Button>
              {file && (
                <Typography variant="body2" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
                  {file.name}
                </Typography>
              )}
              <input
                ref={input}
                type="file"
                hidden
                accept={legacyFinanceFileLimits.accept}
                aria-label="Файл експорту «Фінансів»"
                onChange={(event) => {
                  const picked = event.target.files?.[0];
                  event.target.value = '';
                  if (picked) pick(picked);
                }}
              />
            </Stack>
            {busy && (
              <Stack sx={{ gap: 0.5 }}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary">
                  {running === 'check'
                    ? 'Перевіряємо файл…'
                    : 'Переносимо записи, це може тривати до хвилини…'}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Paper>
        {message && <Alert severity="error">{message}</Alert>}
        {report?.applied && (
          <Alert severity="success">
            Архів перенесено. Перевірте залишки в розділі{' '}
            <a href={financeAccountsPath}>«Рахунки і каси»</a>.
          </Alert>
        )}
        {report && !report.applied && report.canApply && toAdd === 0 && (
          <Alert severity="info">Усе з цього файлу вже перенесено раніше.</Alert>
        )}
        {report && <LegacyImportReport report={report} />}
      </Stack>
      <FinanceDeleteDialog
        open={confirming}
        title="Перенести архів?"
        text={`Буде додано ${toAdd.toLocaleString('uk-UA')} записів зі старих «Фінансів». Видалити їх потім можна лише по одному, тож спершу перегляньте підсумок і залишки.`}
        deleting={busy}
        confirmLabel="Перенести"
        confirmColor="primary"
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          void move();
        }}
      />
    </Box>
  );
}

export default LegacyFinanceImportPage;
