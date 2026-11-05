import { PurchaseDocumentForm } from '@admin/purchasing/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, CircularProgress, Link, Stack } from '@mui/material';

import { usePurchaseDocumentEditor } from '../../hooks/documents/use-purchase-document-editor';

import type { PurchaseInvoiceLink } from '@admin/purchasing/model';

interface Props {
  link: PurchaseInvoiceLink;
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** «Виправити» in the «Цех» side panel, next to the original it describes. */
export function PurchaseDocumentEditor({ link, onClose, onSaved }: Props) {
  const editor = usePurchaseDocumentEditor(link.id, onSaved);
  return (
    <ReferenceEditorDrawer
      titleId="purchase-document-editor-title"
      title="Виправити дані рахунку"
      description="Звірте з оригіналом. Зберегти можна, коли сума позицій збігається з «До оплати»."
      formId="purchase-document-editor-form"
      paperWidth={640}
      readOnly={false}
      saving={editor.saving}
      saveDisabled={!editor.values}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={editor.submit}
    >
      <Stack sx={{ gap: 2 }}>
        <Link href={link.url} target="_blank" rel="noopener noreferrer">
          Відкрити оригінал ↗
        </Link>
        {editor.loadError && <Alert severity="error">{editor.loadError}</Alert>}
        {editor.message && <Alert severity="error">{editor.message}</Alert>}
        {editor.values && editor.check ? (
          <PurchaseDocumentForm
            values={editor.values}
            check={editor.check}
            showErrors={editor.showErrors}
            disabled={editor.saving}
            onChange={editor.change}
          />
        ) : (
          !editor.loadError && (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
              <CircularProgress aria-label="Відкриваємо дані рахунку" />
            </Box>
          )
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}
