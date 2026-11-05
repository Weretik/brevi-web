import { PurchaseInvoiceDetails, PurchaseReviewForm } from '@admin/purchasing/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { usePurchaseFileActions } from '../../hooks/documents/use-purchase-file-actions';
import { usePurchaseReviewEditor } from '../../hooks/review/use-purchase-review-editor';
import { PurchaseFileActions } from '../documents/purchase-file-actions';

import type {
  PurchaseInvoice,
  PurchaseInvoiceLink,
  PurchaseInvoiceReview,
} from '@admin/purchasing/model';

interface Props {
  invoice: PurchaseInvoice;
  onFix: (link: PurchaseInvoiceLink) => void;
  onClose: () => void;
  onSaved: (review: PurchaseInvoiceReview) => void;
}

/**
 * A register row in the «Цех» side panel; «Редагувати» links the supplier and writes a note.
 * Each original can be read by AI or filled in by hand («Виправити»).
 */
export function PurchaseInvoiceDrawer({ invoice, onFix, onClose, onSaved }: Props) {
  const editor = usePurchaseReviewEditor(invoice, onSaved);
  const files = usePurchaseFileActions();
  const readOnly = editor.mode === 'view';

  return (
    <ReferenceEditorDrawer
      titleId="purchase-invoice-drawer-title"
      title={readOnly ? 'Рахунок на закупку' : 'Постачальник і примітка'}
      description={
        readOnly
          ? 'Повідомлення з таблиці «финансы». Постачальника і примітку можна змінити.'
          : 'Оберіть постачальника з довідника і за потреби напишіть примітку.'
      }
      formId="purchase-invoice-review-form"
      paperWidth={560}
      readOnly={readOnly}
      saving={editor.saving}
      onClose={onClose}
      onEdit={editor.enableEditing}
      onSubmit={editor.save}
    >
      <Stack sx={{ gap: 2 }}>
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {!readOnly && editor.suppliersError && (
          <Alert severity="error">{editor.suppliersError}</Alert>
        )}
        {readOnly ? (
          <PurchaseInvoiceDetails
            invoice={invoice}
            renderLinkActions={(link) => (
              <PurchaseFileActions
                link={link}
                busy={files.busy}
                notice={files.notice}
                onFix={onFix}
                onRecognize={(value) => void files.recognize(value)}
              />
            )}
          />
        ) : (
          <PurchaseReviewForm
            invoice={invoice}
            values={editor.values}
            errors={editor.errors}
            suppliers={editor.suppliers}
            suppliersLoading={editor.suppliersLoading}
            disabled={editor.saving}
            onChange={editor.change}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
