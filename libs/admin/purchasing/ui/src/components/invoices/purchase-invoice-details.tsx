import { ReferenceDetailsList, ReferenceFormSection } from '@admin/references/ui';
import { Divider, Link, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';

import { PurchaseDocumentView } from '../documents/purchase-document-view';

import type { PurchaseInvoice, PurchaseInvoiceLink } from '@admin/purchasing/model';
import type { ReactNode } from 'react';

interface Props {
  invoice: PurchaseInvoice;
  /** Buttons of one safe link («Розпізнати», JSON), given by the feature. */
  renderLinkActions?: (link: PurchaseInvoiceLink) => ReactNode;
}

const formatTime = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

/**
 * Read-only card of one purchase invoice in the side panel: the message from the sheet, originals,
 * the source payment mark, problems (only when there are any) and the manual supplier and note.
 */
export function PurchaseInvoiceDetails({ invoice, renderLinkActions }: Props) {
  const supplier =
    invoice.supplierId !== null && invoice.supplierName === null
      ? 'Постачальника не знайдено або видалено з довідника'
      : invoice.supplierName;
  return (
    <Stack sx={{ gap: 2 }}>
      {invoice.issues.length > 0 && (
        <ReferenceFormSection title="Потребує перевірки">
          <Stack component="ul" sx={{ m: 0, pl: 2.5, gap: 0.5 }}>
            {invoice.issues.map((issue) => (
              <Typography key={issue} component="li" variant="body2" color="warning.main">
                {issue}
              </Typography>
            ))}
          </Stack>
        </ReferenceFormSection>
      )}
      <ReferenceFormSection title="Постачальник і примітка">
        <ReferenceDetailsList
          items={[
            { label: 'Постачальник', value: supplier },
            { label: 'Примітка', value: invoice.reviewNote },
            {
              label: 'Змінено',
              value:
                invoice.reviewedAt && invoice.reviewedBy
                  ? `${formatTime(invoice.reviewedAt)} · ${invoice.reviewedBy}`
                  : null,
              mono: true,
            },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Повідомлення">
        <ReferenceDetailsList
          items={[
            { label: 'Текст', value: invoice.text },
            {
              label: 'Чат і автор',
              value: [invoice.chatName, invoice.fromUser].filter(Boolean).join(' · ') || null,
            },
            { label: 'Дата', value: invoice.messageAt, mono: true },
            {
              label: 'Джерело',
              value: `UID ${invoice.sourceUid} · рядок ${invoice.rowNumber}${
                invoice.sourceRowCount > 1 ? ` · рядків: ${invoice.sourceRowCount}` : ''
              }`,
              mono: true,
            },
            {
              label: 'Оплата',
              value: invoice.markedPaid
                ? ['Відмічено в джерелі', invoice.markBy, invoice.markAt]
                    .filter(Boolean)
                    .join(' · ')
                : 'Не підтверджено',
            },
          ]}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Оригінали">
        {invoice.links.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ) : (
          <Stack sx={{ gap: 1.5 }}>
            {invoice.links.map((link, index) =>
              link.safe ? (
                <Fragment key={link.id}>
                  {index > 0 && <Divider />}
                  <Stack sx={{ gap: 1 }}>
                    <Link href={link.url} target="_blank" rel="noopener noreferrer">
                      Оригінал{invoice.links.length > 1 ? ` ${index + 1}` : ''} ↗
                    </Link>
                    {link.document && <PurchaseDocumentView document={link.document} />}
                    {renderLinkActions?.(link)}
                  </Stack>
                </Fragment>
              ) : (
                <Typography
                  key={link.id}
                  variant="body2"
                  color="warning.main"
                  sx={{ wordBreak: 'break-all' }}
                >
                  Посилання потребує перевірки: {link.url}
                </Typography>
              ),
            )}
          </Stack>
        )}
      </ReferenceFormSection>
    </Stack>
  );
}
