import { purchaseInvoiceStatus, purchaseLinkStatus } from '@admin/purchasing/model';
import { PurchaseDocumentView, PurchaseStatusChip } from '@admin/purchasing/ui';
import { usePageRights } from '@admin/shared/ui';
import { Box, Button, Link, Stack, Typography } from '@mui/material';

import { PurchaseLinkDraft } from '../documents/purchase-link-draft';

import type { PurchaseInvoice, PurchaseInvoiceLink } from '@admin/purchasing/model';
import type { ReactNode } from 'react';

interface Props {
  invoice: PurchaseInvoice;
  renderActions: (link: PurchaseInvoiceLink) => ReactNode;
  onOpenReview: (invoice: PurchaseInvoice) => void;
}

/** An open register row: the message, the reasons of its state, and each original with its facts. */
export function PurchaseInvoiceRowDetails({ invoice, renderActions, onOpenReview }: Props) {
  const { notes } = purchaseInvoiceStatus(invoice);
  const canChange = usePageRights().can('edit', 'purchase-invoices');
  return (
    <Stack sx={{ gap: 1.5, pt: 1 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 1, justifyContent: 'space-between', alignItems: { sm: 'flex-start' } }}
      >
        <Typography variant="body2" sx={{ minWidth: 0, whiteSpace: 'pre-wrap' }}>
          {invoice.text || '—'}
          <Typography component="span" variant="caption" color="text.secondary">
            {' · '}
            {[
              invoice.chatName,
              invoice.fromUser,
              invoice.supplierName && `постачальник: ${invoice.supplierName}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Typography>
        </Typography>
        {canChange && (
          <Button size="small" onClick={() => onOpenReview(invoice)} sx={{ flexShrink: 0 }}>
            Постачальник і примітка
          </Button>
        )}
      </Stack>
      {notes.length > 0 && (
        <Stack component="ul" sx={{ m: 0, pl: 2.5, gap: 0.25 }} aria-label="Що перевірити">
          {notes.map((note) => (
            <Typography key={note} component="li" variant="body2" color="warning.main">
              {note}
            </Typography>
          ))}
        </Stack>
      )}
      {invoice.links.map((link, index) => {
        const { status } = purchaseLinkStatus(link);
        return (
          <Box
            key={link.id}
            sx={{
              p: 1.5,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Stack sx={{ gap: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                {link.safe ? (
                  <Link href={link.url} target="_blank" rel="noopener noreferrer">
                    Оригінал{invoice.links.length > 1 ? ` ${index + 1}` : ''} ↗
                  </Link>
                ) : (
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {link.url}
                  </Typography>
                )}
                <PurchaseStatusChip status={status} />
              </Stack>
              {link.document ? (
                <PurchaseDocumentView document={link.document} />
              ) : (
                status === 'Error' && <PurchaseLinkDraft fileId={link.id} />
              )}
              {link.safe && renderActions(link)}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
