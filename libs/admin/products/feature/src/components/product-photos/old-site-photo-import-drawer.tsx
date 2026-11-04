import { ReferenceEditorDrawer } from '@admin/references/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Alert, Box, Button, LinearProgress, Stack, Typography } from '@mui/material';

import { useOldSitePhotoImport } from '../../hooks/product-photos/use-old-site-photo-import';

import type { OldSitePhotoImportReport } from '@admin/products/model';

interface Props {
  onClose: () => void;
}

function ReportSummary({ report }: { report: OldSitePhotoImportReport }) {
  const rows: [string, number][] = report.dryRun
    ? [
        ['Товарів у файлі', report.products],
        ['Знайдено в Brevi', report.found],
        ['Нових моделей (будуть вимкнені)', report.modelsToCreate],
        ['Не знайдено (пропускаються)', report.notFound],
        ['Фото завантажити', report.filesToDownload],
      ]
    : [
        ['Оброблено товарів', report.products],
        ['Створено моделей (вимкнені)', report.modelsCreated],
        ['Завантажено файлів', report.filesDownloaded],
        ['Додано фото до товарів', report.photosAdded],
        ['Не знайдено (пропущено)', report.notFound],
      ];
  const failed = report.lines.filter((line) => line.errors.length > 0);
  const notFound = report.lines.filter((line) => line.status === 'NotFound');
  return (
    <Stack sx={{ gap: 2 }}>
      <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 0.5, m: 0 }}>
        {rows.map(([label, value]) => (
          <Box key={label} sx={{ display: 'contents' }}>
            <Typography component="dt" variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography
              component="dd"
              variant="body2"
              sx={{ m: 0, fontWeight: 600, textAlign: 'right' }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
      {failed.length > 0 && (
        <Alert severity="warning">
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Не все вдалося ({failed.length})
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, maxHeight: 220, overflow: 'auto' }}>
            {failed.map((line) => (
              <li key={line.oldId}>
                {line.productName ?? line.oldName}: {line.errors.join('; ')}
              </li>
            ))}
          </Box>
        </Alert>
      )}
      {notFound.length > 0 && (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Не знайдено в Brevi ({notFound.length})
          </Typography>
          <Box
            component="ul"
            sx={{
              m: 0,
              pl: 2,
              maxHeight: 200,
              overflow: 'auto',
              typography: 'body2',
              color: 'text.secondary',
            }}
          >
            {notFound.map((line) => (
              <li key={line.oldId}>{line.oldName}</li>
            ))}
          </Box>
        </Box>
      )}
    </Stack>
  );
}

/**
 * «Імпорт зі старого сайту» (CAT-018): the file from the old-site export brings photos into the
 * library folder «Старий сайт» and links them to products; missing sewing models are created switched off.
 */
export function OldSitePhotoImportDrawer({ onClose }: Props) {
  const flow = useOldSitePhotoImport();
  const checked = flow.report?.dryRun === true;
  const importing = flow.busy === 'import';

  return (
    <ReferenceEditorDrawer
      titleId="old-site-import-title"
      title="Імпорт зі старого сайту"
      description="Фото старого сайту потрапляють у медіатеку («Старий сайт») і до товарів. Відсутні моделі створюються вимкненими."
      formId="old-site-import-form"
      paperWidth={560}
      readOnly={false}
      saving={flow.busy !== null}
      saveDisabled={!checked}
      submitLabel="Імпортувати"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={flow.run}
    >
      <Stack sx={{ gap: 2 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileOutlinedIcon />}
            disabled={flow.busy !== null}
          >
            Вибрати файл
            <input
              hidden
              type="file"
              accept="application/json,.json"
              aria-label="Файл імпорту фото"
              onChange={(event) => {
                const picked = event.target.files?.[0];
                if (picked) flow.pick(picked);
                event.target.value = '';
              }}
            />
          </Button>
          <Typography variant="body2" color="text.secondary">
            {flow.fileName
              ? `${flow.fileName} · товарів: ${flow.productCount}`
              : 'old-site-photo-import.json'}
          </Typography>
        </Stack>
        <Box>
          <Button
            variant="contained"
            disabled={!flow.fileName || flow.busy !== null}
            onClick={flow.check}
          >
            Перевірити
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Перевірка нічого не змінює. «Імпортувати» стане доступним після неї.
          </Typography>
        </Box>
        {flow.busy === 'check' && <LinearProgress aria-label="Перевірка файлу" />}
        {importing && (
          <Box>
            <LinearProgress
              variant="determinate"
              value={flow.productCount ? (flow.done / flow.productCount) * 100 : 0}
              aria-label="Імпорт фото"
            />
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                {flow.done} з {flow.productCount} товарів
              </Typography>
              <Button size="small" onClick={flow.stop}>
                Зупинити
              </Button>
            </Stack>
          </Box>
        )}
        {flow.error && <Alert severity="error">{flow.error}</Alert>}
        {flow.report && <ReportSummary report={flow.report} />}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
