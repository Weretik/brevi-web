import { PurchaseInvoiceDetails, PurchaseReviewForm } from '@admin/purchasing/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { usePurchaseReviewEditor } from '../../hooks/review/use-purchase-review-editor';

import type { PurchaseInvoice, PurchaseInvoiceReview } from '@admin/purchasing/model';

interface Props {
  invoice: PurchaseInvoice;
  onClose: () => void;
  onSaved: (review: PurchaseInvoiceReview) => void;
}

/** A register row in the «Цех» side panel; «Редагувати» links the supplier and writes a note. */
export function PurchaseInvoiceDrawer({ invoice, onClose, onSaved }: Props) {
  const editor = usePurchaseReviewEditor(invoice, onSaved);
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
          <PurchaseInvoiceDetails invoice={invoice} />
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
