import { Alert, Box } from '@mui/material';

import type { useSiteGalleryContent } from '../../hooks/galleries/use-site-gallery-content';

/** Messages above the gallery: what was saved, what failed, and the report of the move to «Фото». */
export function SiteGalleryNotices({
  notice,
  onCloseNotice,
  error,
  onCloseError,
  report,
  onCloseReport,
}: {
  notice: string | null;
  onCloseNotice: () => void;
  error: string | null;
  onCloseError: () => void;
  report: ReturnType<typeof useSiteGalleryContent>['report'];
  onCloseReport: (() => void) | undefined;
}) {
  return (
    <>
      {notice && (
        <Alert severity="success" onClose={onCloseNotice} sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={onCloseError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {report && (
        <Alert
          severity={report.problems.length > 0 ? 'warning' : 'info'}
          onClose={onCloseReport}
          sx={{ mb: 2 }}
        >
          Перенесено в «Фото»: {report.moved}.{report.left > 0 ? ` Лишилось: ${report.left}.` : ''}
          {report.problems.map((problem) => (
            <Box key={problem}>{problem}</Box>
          ))}
        </Alert>
      )}
    </>
  );
}
