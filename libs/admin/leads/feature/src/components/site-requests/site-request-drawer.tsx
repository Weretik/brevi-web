import {
  formatSiteRequestMoment,
  formatSiteRequestPhone,
  siteRequestActionLabels,
  siteRequestNoteMaxLength,
  siteRequestPhoneHref,
} from '@admin/leads/model';
import { SiteRequestStatusPill } from '@admin/leads/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material';

import type { SiteRequestPanel } from '../../hooks/site-requests/use-site-requests';
import type { SiteRequestAction } from '@admin/leads/model';
import type { ReactNode } from 'react';

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack sx={{ gap: 0.25 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
        {children}
      </Typography>
    </Stack>
  );
}

/** Side panel of «Заявки з сайту»: what the visitor wrote, the file, and «Беру» / «Готово» / «Не заявка». */
export function SiteRequestDrawer({ panel }: { panel: SiteRequestPanel }) {
  const request = panel.request;
  if (!request) return null;
  const [primary, ...others] = panel.actions;
  const closes = panel.actions.includes('Done');
  const button = (action: SiteRequestAction) => (
    <Button
      key={action}
      color="inherit"
      variant="outlined"
      disabled={panel.busy}
      onClick={() => void panel.run(action)}
    >
      {siteRequestActionLabels[action]}
    </Button>
  );

  return (
    <ReferenceEditorDrawer
      titleId="site-request-drawer-title"
      title={formatSiteRequestPhone(request.phone)}
      description={`Заявка з сайту від ${formatSiteRequestMoment(request.createdAt)}, ${
        request.locale === 'ru' ? 'російська' : 'українська'
      } версія`}
      formId="site-request-panel"
      paperWidth={520}
      readOnly
      saving={panel.busy}
      editLabel={primary ? siteRequestActionLabels[primary] : null}
      readActions={others.map(button)}
      onClose={panel.close}
      onEdit={() => primary && void panel.run(primary)}
      onSubmit={() => undefined}
    >
      {panel.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {panel.error}
        </Alert>
      )}
      {request.notifyError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Не надіслано в Telegram: {request.notifyError}
        </Alert>
      )}
      <Stack sx={{ gap: 2 }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <SiteRequestStatusPill status={request.status} />
          <Typography variant="body2" color="text.secondary">
            {request.ownerName ? `Веде: ${request.ownerName}` : 'Ніхто ще не взяв'}
          </Typography>
        </Stack>
        <Row label="Телефон">
          <Link href={siteRequestPhoneHref(request.phone)}>
            {formatSiteRequestPhone(request.phone)}
          </Link>
        </Row>
        {request.workwear && <Row label="Що потрібно">{request.workwear}</Row>}
        {request.quantity && <Row label="Кількість">{request.quantity}</Row>}
        {request.comment && <Row label="Коментар">{request.comment}</Row>}
        {request.fileUrl && (
          <Row label="Файл">
            <Link href={request.fileUrl} target="_blank" rel="noopener noreferrer">
              {request.fileName ?? 'Відкрити файл'}
            </Link>
          </Row>
        )}
        {request.note && <Row label="Результат">{request.note}</Row>}
        {closes && (
          <TextField
            label="Що вийшло (необов’язково)"
            helperText="Збережеться, коли натиснете «Готово» або «Не заявка»"
            value={panel.note}
            onChange={(event) => panel.setNote(event.target.value)}
            multiline
            minRows={2}
            slotProps={{ htmlInput: { maxLength: siteRequestNoteMaxLength } }}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
